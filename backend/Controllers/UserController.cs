using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExpenseTracker.Data;
using ExpenseTracker.DTOs.Users;
using ExpenseTracker.Utilities.Extension;
using ExpenseTracker.Models;

namespace ExpenseTracker.Controllers;

/// <summary>
/// Controller for managing user profile operations.
/// </summary>
[ApiController]
[Route("api/v1/user")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly ExpenseTrackerDbContext _context;
    private readonly ILogger<UserController> _logger;

    public UserController(ExpenseTrackerDbContext context, ILogger<UserController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get the current user's profile information.
    /// </summary>
    /// <returns>User profile data.</returns>
    [HttpGet("profile")]
    [ProducesResponseType(typeof(ApiResponse<UserProfileResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<UserProfileResponse>>> GetProfile()
    {
        try
        {
            if (!User.TryGetUserId(out Guid userId))
            {
                return Unauthorized(ApiResponse<object>.Fail(null, "Invalid user token."));
            }

            _logger.LogInformation("Getting profile for user {UserId}", userId);

            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound(ApiResponse<object>.Fail(null, "User not found."));
            }

            var response = new UserProfileResponse
            {
                Id = user.Id,
                Name = user.Name,
                Nickname = user.Nickname,
                Email = user.Email,
                ProfilePicture = user.ProfilePicture,
                Phone = user.Phone,
                Bio = user.Bio,
                CreatedAt = user.CreatedAt
            };

            return Ok(ApiResponse<UserProfileResponse>.Ok(response, "Profile retrieved successfully."));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting profile");
            return StatusCode(500, ApiResponse<object>.Fail(null, "An error occurred while retrieving the profile."));
        }
    }

    /// <summary>
    /// Update the current user's profile information.
    /// </summary>
    /// <param name="request">Profile update data.</param>
    /// <returns>Updated user profile.</returns>
    [HttpPut("profile")]
    [ProducesResponseType(typeof(ApiResponse<UserProfileResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<UserProfileResponse>>> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        try
        {
            if (!User.TryGetUserId(out Guid userId))
            {
                return Unauthorized(ApiResponse<object>.Fail(null, "Invalid user token."));
            }

            _logger.LogInformation("Updating profile for user {UserId}", userId);

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound(ApiResponse<object>.Fail(null, "User not found."));
            }

            // Update user fields
            user.Name = request.Name;
            user.Nickname = request.Nickname ?? user.Name;
            user.ProfilePicture = request.ProfilePicture;
            user.Phone = request.Phone;
            user.Bio = request.Bio;

            await _context.SaveChangesAsync();

            var response = new UserProfileResponse
            {
                Id = user.Id,
                Name = user.Name,
                Nickname = user.Nickname,
                Email = user.Email,
                ProfilePicture = user.ProfilePicture,
                Phone = user.Phone,
                Bio = user.Bio,
                CreatedAt = user.CreatedAt
            };

            _logger.LogInformation("Profile updated successfully for user {UserId}", userId);
            return Ok(ApiResponse<UserProfileResponse>.Ok(response, "Profile updated successfully."));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating profile");
            return StatusCode(500, ApiResponse<object>.Fail(null, "An error occurred while updating the profile."));
        }
    }
}
