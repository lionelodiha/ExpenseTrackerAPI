namespace ExpenseTracker.Models.DTOs.Auth;

/// <summary>
/// Contains basic identity information for the authenticated user.
/// </summary>
public class AuthUserDto
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
	/// The email address associated with the user's account.
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
}
