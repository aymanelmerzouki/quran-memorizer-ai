# Contributing to Quran Memorizer AI 🤝

Bismillah ar-Rahman ar-Rahim

Thank you for considering contributing to this project! This app is created to help Muslims memorize the Holy Quran, and every contribution is considered an act of khair (goodness).

## How to Contribute

### 🐛 Reporting Bugs

If you find a bug, please open an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Device/OS information

### ✨ Suggesting Features

We welcome feature suggestions! Please open an issue with:
- Clear description of the feature
- Why it would be beneficial
- How it might work (if you have ideas)

### 💻 Code Contributions

1. **Fork the repository**
2. **Create a branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes**
4. **Test thoroughly**: Run `node test-app.js` and test manually
5. **Commit**: Use clear, descriptive commit messages
6. **Push**: `git push origin feature/your-feature-name`
7. **Open a Pull Request**

### 📝 Code Style

- Follow existing code patterns
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused
- Use React hooks properly
- Ensure 60fps animations

### 🧪 Testing

Before submitting:
- Run existing tests: `node test-app.js`
- Test on real device if possible
- Check for console errors
- Verify UI/UX is smooth

### 📚 Documentation

- Update README.md if you change functionality
- Add JSDoc comments for new functions
- Update QUICK_START.md if setup changes

## Development Setup

See [QUICK_START.md](QUICK_START.md) for detailed setup instructions.

Quick version:
```bash
# Clone and install
git clone https://github.com/aymanelmerzouki/quran-memorizer-ai.git
cd quran-memorizer-ai
npm install

# Backend setup (in separate terminal)
cd path/to/quran-ai-tracker
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your Groq API key
python run.py

# Start app
npm start
```

## Priority Areas

We especially welcome contributions in:

### 🎯 High Priority
- Offline mode for basic features
- Performance optimizations
- UI/UX improvements
- Accessibility enhancements
- Multi-language support (Arabic, English, French, Urdu, etc.)
- Better error handling

### 📱 Mobile
- iOS testing and fixes
- Android optimization
- Tablet support
- Landscape mode

### 🤖 AI Features
- Alternative ASR backends
- Tajweed rules detection
- Makharij (pronunciation) feedback
- Better similarity algorithms

### 📊 Analytics
- Better progress tracking
- Advanced statistics
- Export/import data
- Backup/sync options

### 🎨 UI/UX
- Dark mode improvements
- Custom themes
- Gesture controls
- Widget support

## Guidelines

### ✅ Do
- Write clean, readable code
- Test your changes
- Be respectful in discussions
- Keep commits atomic
- Update documentation
- Follow Islamic ethics

### ❌ Don't
- Add unnecessary dependencies
- Break existing functionality
- Include copyrighted content without permission
- Submit untested code
- Make large PRs without discussion first

## Code of Conduct

### Islamic Ethics
This is an Islamic project. All contributors should:
- Be respectful and professional
- Avoid inappropriate content
- Remember the noble purpose (helping memorize Quran)
- Make sincere intention (niyyah) for the sake of Allah

### Professional Conduct
- Be patient with beginners
- Give constructive feedback
- Assume good intentions
- Be inclusive and welcoming
- Help others learn

## Questions?

Feel free to:
- Open an issue for questions
- Start a discussion on GitHub
- Review existing documentation

## Attribution

If you contribute:
- You'll be added to contributors list
- Your GitHub profile will be linked
- May Allah reward you for your effort

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**JazakAllahu Khayran** (May Allah reward you with goodness) for your interest in contributing!

May Allah accept this work and make it a means of benefit for the Muslim community. Ameen. 🤲
