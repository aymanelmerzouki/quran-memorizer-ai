# Security Policy 🔒

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | ✅ Yes            |

## Reporting a Vulnerability

If you discover a security vulnerability, please **DO NOT** open a public issue.

Instead, please report it by:
1. Opening a private security advisory on GitHub
2. Or emailing the maintainer through GitHub

### What to include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if you have one)

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial assessment**: Within 7 days
- **Fix timeline**: Depends on severity
  - Critical: As soon as possible
  - High: Within 2 weeks
  - Medium: Within 1 month
  - Low: Next release cycle

## Security Best Practices for Users

### API Keys

⚠️ **NEVER** commit your `.env` file with real API keys!

```bash
# Always use .env.example as template
cp .env.example .env
# Then edit .env with your keys
```

### Building from Source

- Only clone from official repository
- Verify commit signatures when possible
- Check `package.json` for suspicious dependencies
- Use `npm audit` to check for vulnerabilities

```bash
npm audit
npm audit fix
```

### Running the Backend

- Don't expose the backend port to the internet
- Use a reverse proxy with HTTPS in production
- Keep Python dependencies updated
- Use virtual environments

```bash
# Check for outdated packages
pip list --outdated
```

### Mobile App

- Only install APKs from trusted sources
- Verify checksums if provided
- Check permissions before installing
- Keep the app updated

## Known Limitations

### Current Version (1.0.x)

1. **API Key Storage**: Groq API key is stored in `.env` file
   - **Mitigation**: Keep `.env` private, never commit it
   
2. **Local Backend**: Backend runs on localhost without authentication
   - **Mitigation**: Don't expose to public network
   
3. **Audio Recording**: Raw audio is processed locally
   - **Impact**: Audio is sent to Groq API for transcription
   - **Mitigation**: Check Groq's privacy policy

## Privacy Considerations

### Data Collection

This app does NOT collect:
- ❌ Personal information
- ❌ Usage analytics
- ❌ Tracking data
- ❌ Device information

### Data Storage

Local storage only:
- ✅ Progress data (SQLite)
- ✅ Settings (AsyncStorage)
- ✅ Cached Quran text

### External Services

1. **Groq API** (for voice recognition)
   - Audio is sent for transcription
   - Subject to [Groq's privacy policy](https://groq.com/privacy-policy/)
   - You can self-host alternative ASR backend

## Security Features

### Current Implementation

- ✅ Input validation on backend
- ✅ Error handling to prevent crashes
- ✅ No eval() or dangerous functions
- ✅ Proper permission requests (Android)
- ✅ Dependencies from trusted sources

### Planned Improvements

- 🔄 End-to-end encryption for sync (future)
- 🔄 Optional self-hosted ASR backend
- 🔄 Secure credential storage (Keychain/Keystore)
- 🔄 Code signing for releases

## Dependency Management

### Regular Updates

We monitor dependencies for security issues:

```bash
# Frontend
npm audit
npm update

# Backend
pip check
pip list --outdated
```

### Trusted Sources

All dependencies are from:
- npm registry (verified packages)
- PyPI (Python packages)
- Official repositories

## Build Security

### APK Signing

Official releases are signed with our keystore. Verify:
- Download from official GitHub releases
- Check SHA256 checksums (when provided)
- Verify signature if you have the public key

### Build from Source

Most secure option:
```bash
git clone https://github.com/aymanelmerzouki/quran-memorizer-ai.git
cd quran-memorizer-ai
# Review code
npm install
npm run build
```

## Contact

For security concerns, please use GitHub's security advisory feature or contact the maintainer privately.

---

**JazakAllahu Khayran** for helping keep this project secure for the Muslim community. 🔒
