# Security Policy

## Supported Versions

We actively support the following versions of ModernToasts with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Features

ModernToasts is designed with security as a priority. Here are the built-in security features:

### XSS Protection

- **HTML Sanitization**: All user-provided content is automatically sanitized to prevent XSS attacks
- **Safe DOM Manipulation**: Uses safe DOM methods instead of `innerHTML` for user content
- **Content Security Policy**: Compatible with strict CSP policies

### Input Validation

- **Type Checking**: All inputs are validated against expected types
- **Range Validation**: Numeric inputs are validated for reasonable ranges
- **Prototype Pollution Protection**: Object inputs are validated to prevent prototype pollution

### Safe Defaults

- **Secure Configuration**: Default settings prioritize security
- **No Dynamic Code Execution**: No use of `eval()` or similar dangerous functions
- **Minimal Permissions**: Requires minimal browser permissions

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability in ModernToasts, please report it responsibly.

### How to Report

1. **Email**: Send details to [sukarthacharya@gmail.com](mailto:sukarthacharya@gmail.com)
2. **Subject**: Use "SECURITY: ModernToasts Vulnerability Report"
3. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: We'll acknowledge receipt within 48 hours
- **Investigation**: We'll investigate and assess the vulnerability
- **Timeline**: We aim to provide a fix within 7 days for critical issues
- **Credit**: We'll credit you in the security advisory (unless you prefer anonymity)

### Please Don't

- **Public Disclosure**: Don't publicly disclose the vulnerability until we've had a chance to fix it
- **Automated Scanning**: Don't use automated vulnerability scanners against our infrastructure
- **Social Engineering**: Don't attempt to social engineer our team members

## Security Best Practices

When using ModernToasts in your application, follow these security best practices:

### Content Sanitization

While ModernToasts sanitizes content, you should also sanitize data at the source:

```javascript
// Good: Sanitize user input before passing to toast
const userMessage = sanitizeUserInput(rawUserInput);
toast.success(userMessage);

// Avoid: Passing unsanitized user input
toast.success(req.body.message); // Potential XSS risk
```

### Configuration Security

Be careful with configuration options that accept HTML or CSS:

```javascript
// Good: Use predefined safe values
toast.configure({
  position: 'top-right',
  maxVisibleStackToasts: 3
});

// Be careful: Custom CSS should be from trusted sources only
toast.configure({
  customCSS: trustedCSSFromYourApp // Only use trusted CSS
});
```

### Event Handlers

Validate data in event handlers:

```javascript
toast.on('show', (toastData) => {
  // Validate toastData before using it
  if (typeof toastData.message === 'string') {
    logToastEvent(toastData.message);
  }
});
```

## Content Security Policy (CSP)

ModernToasts is compatible with Content Security Policy. Here's a minimal CSP that works:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  style-src 'self' 'unsafe-inline';
  script-src 'self';
">
```

### CSP Directives Needed

- `style-src 'unsafe-inline'`: Required for dynamic CSS injection
- `script-src 'self'`: For the ModernToasts JavaScript

### Strict CSP

For stricter CSP, you can pre-inject the CSS and use nonces:

```javascript
// Pre-inject CSS to avoid 'unsafe-inline'
const style = document.createElement('style');
style.nonce = 'your-nonce';
style.textContent = '/* ModernToasts CSS */';
document.head.appendChild(style);
```

## Vulnerability Disclosure Timeline

Our typical vulnerability disclosure process:

1. **Day 0**: Vulnerability reported
2. **Day 1-2**: Acknowledgment and initial assessment
3. **Day 3-7**: Investigation and fix development
4. **Day 7-14**: Testing and validation
5. **Day 14**: Public disclosure and patch release

## Security Considerations for Developers

### Server-Side Rendering (SSR)

When using ModernToasts with SSR:

```javascript
// Ensure ModernToasts only runs in browser
if (typeof window !== 'undefined') {
  import('modern-toasts').then(({ default: toast }) => {
    toast.success('SSR-safe toast');
  });
}
```

### Third-Party Integration

When integrating with third-party services:

```javascript
// Validate external data before displaying
fetch('/api/notifications')
  .then(response => response.json())
  .then(data => {
    if (isValidNotification(data)) {
      toast.info(data.message);
    }
  });
```

### Production Deployment

For production deployments:

1. **Minified Version**: Always use the minified version in production
2. **Integrity Checks**: Use Subresource Integrity (SRI) when loading from CDN
3. **HTTPS Only**: Always serve over HTTPS
4. **Regular Updates**: Keep ModernToasts updated to the latest version

```html
<!-- CDN with SRI -->
<script 
  src="https://unpkg.com/modern-toasts@1.0.0/dist/modern-toasts.min.js"
  integrity="sha384-..."
  crossorigin="anonymous">
</script>
```

## Security Audit History

| Date | Type | Findings | Status |
|------|------|----------|--------|
| 2025-01-25 | Internal | Initial security review | ✅ Complete |

## Contact

For security-related questions or concerns:

- **Email**: [sukarthacharya@gmail.com](mailto:sukarthacharya@gmail.com)
- **GitHub**: [@sukarth](https://github.com/sukarth)

## License

This security policy is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).