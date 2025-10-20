using PostmarkDotNet;

namespace ExpenseTracker.Services;

/// <summary>
/// Email service that gracefully disables delivery when Postmark config is missing.
/// Prevents local/dev environments from failing on auth flows.
/// </summary>
internal class EmailService : IEmailService
{
    private readonly string? _postmarkToken;
    private readonly string? _fromEmail;
    private readonly ILogger<EmailService> _logger;
    private readonly bool _enabled;

    public EmailService(IConfiguration config, ILogger<EmailService> logger)
    {
        _logger = logger;
        _postmarkToken = config["Postmark:Token"];
        _fromEmail = config["Postmark:FromEmail"];

        _enabled = !string.IsNullOrWhiteSpace(_postmarkToken)
                   && !string.IsNullOrWhiteSpace(_fromEmail);

        if (!_enabled)
        {
            _logger.LogWarning("Postmark configuration missing. Email sending disabled in this environment.");
        }
    }

    public async Task<bool> SendEmailAsync(string to, string subject, string htmlBody, string? plainText = null)
    {
        if (!_enabled)
        {
            _logger.LogInformation("EmailService disabled: skipping SendEmailAsync to {to}", to);
            await Task.CompletedTask;
            return false;
        }

        PostmarkClient client = new(_postmarkToken!);

        PostmarkMessage message = new()
        {
            To = to,
            From = _fromEmail!,
            Subject = subject,
            HtmlBody = htmlBody,
            TextBody = plainText ?? "This is a fallback plain-text version.",
            TrackOpens = true,
        };

        PostmarkResponse result = await client.SendMessageAsync(message);
        return result.Status == PostmarkStatus.Success;
    }

    public async Task<bool> SendTemplateEmailAsync(string to, int templateId, object templateModel)
    {
        if (!_enabled)
        {
            _logger.LogInformation("EmailService disabled: skipping SendTemplateEmailAsync to {to} with template {templateId}", to, templateId);
            await Task.CompletedTask;
            return false;
        }

        PostmarkClient client = new(_postmarkToken!);

        PostmarkResponse result = await client.SendEmailWithTemplateAsync(new TemplatedPostmarkMessage
        {
            To = to,
            From = _fromEmail!,
            TemplateId = templateId,
            TemplateModel = templateModel
        });

        return result.Status == PostmarkStatus.Success;
    }
}
