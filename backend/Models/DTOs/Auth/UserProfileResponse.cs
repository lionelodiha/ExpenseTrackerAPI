namespace ExpenseTracker.Models.DTOs.Auth;

/// <summary>
/// Represents the response model for a user's profile information.
/// </summary>
public class UserProfileResponse
{
	/// <summary>
	/// The unique identifier of the user.
	/// </summary>
	public required Guid Id { get; set; }

	/// <summary>
	/// The full name of the user.
	/// </summary>
	public required string Name { get; set; }

	/// <summary>
	/// The user's nickname or preferred display name.
	/// </summary>
	public string? Nickname { get; set; }

	/// <summary>
	/// The email address of the user.
	/// </summary>
	public required string Email { get; set; }

	/// <summary>
	/// Base64 encoded profile picture.
	/// </summary>
	public string? ProfilePicture { get; set; }

	/// <summary>
	/// User's phone number.
	/// </summary>
	public string? Phone { get; set; }

	/// <summary>
	/// User's bio or description.
	/// </summary>
	public string? Bio { get; set; }

	/// <summary>
	/// The date and time when the user account was created.
	/// </summary>
	public required DateTime CreatedAt { get; set; }

	/// <summary>
	/// The date and time when the user last logged in.
	/// </summary>
	public required DateTime? LastLoginAt { get; set; }
}
