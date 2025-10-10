using System.ComponentModel.DataAnnotations;

namespace ExpenseTracker.DTOs.Users;

/// <summary>
/// Request DTO for updating user profile.
/// </summary>
public class UpdateProfileRequest
{
    /// <summary>
    /// User's full name.
    /// </summary>
    [Required(ErrorMessage = "Name is required.")]
    [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters.")]
    public required string Name { get; set; }

    /// <summary>
    /// User's nickname or preferred display name.
    /// </summary>
    [StringLength(50, ErrorMessage = "Nickname cannot exceed 50 characters.")]
    public string? Nickname { get; set; }

    /// <summary>
    /// Base64 encoded profile picture.
    /// </summary>
    public string? ProfilePicture { get; set; }

    /// <summary>
    /// User's phone number.
    /// </summary>
    [StringLength(20, ErrorMessage = "Phone number cannot exceed 20 characters.")]
    public string? Phone { get; set; }

    /// <summary>
    /// User's bio or description.
    /// </summary>
    [StringLength(500, ErrorMessage = "Bio cannot exceed 500 characters.")]
    public string? Bio { get; set; }
}
