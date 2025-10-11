namespace ExpenseTracker.DTOs.Users;

/// <summary>
/// Response DTO for user profile information.
/// </summary>
public class UserProfileResponse
{
    /// <summary>
    /// User's unique identifier.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// User's full name.
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// User's nickname or preferred display name.
    /// </summary>
    public string? Nickname { get; set; }

    /// <summary>
    /// User's email address.
    /// </summary>
    public string Email { get; set; } = string.Empty;

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
    /// Date the account was created.
    /// </summary>
    public DateTime CreatedAt { get; set; }
}
