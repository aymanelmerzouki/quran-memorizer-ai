#!/bin/bash
#
# Build Preparation Script
# Prepares the app for production build
#

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════╗"
echo "║   QURAN HYBRID APP - BUILD PREPARATION                ║"
echo "╚════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Function to print step
step() {
    echo -e "\n${BLUE}▶ $1${NC}"
}

# Function to print success
success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print warning
warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Function to print error
error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    error "Error: package.json not found. Are you in the project directory?"
    exit 1
fi

success "Found package.json"

# ============================================================================
# 1. Check Dependencies
# ============================================================================
step "Checking Dependencies..."

if ! command -v node &> /dev/null; then
    error "Node.js not found. Please install Node.js"
    exit 1
fi
success "Node.js: $(node --version)"

if ! command -v npm &> /dev/null; then
    error "npm not found. Please install npm"
    exit 1
fi
success "npm: $(npm --version)"

# ============================================================================
# 2. Install/Update Dependencies
# ============================================================================
step "Installing/Updating Dependencies..."

npm install
success "Dependencies installed"

# ============================================================================
# 3. Run Tests
# ============================================================================
step "Running Tests..."

if [ -f "test-app.js" ]; then
    if node test-app.js; then
        success "All tests passed!"
    else
        error "Some tests failed. Please fix before building."
        exit 1
    fi
else
    warning "test-app.js not found, skipping tests"
fi

# ============================================================================
# 4. Check Backend
# ============================================================================
step "Checking Backend Availability..."

if curl -s http://localhost:7860 > /dev/null 2>&1; then
    success "Backend is running on http://localhost:7860"
else
    warning "Backend not running on http://localhost:7860"
    echo "  Note: Backend is required for AI features"
    echo "  Start it with:"
    echo "    cd ~/quran-ai-tracker"
    echo "    source venv/bin/activate"
    echo "    python run.py"
fi

# ============================================================================
# 5. Check EAS CLI
# ============================================================================
step "Checking EAS CLI..."

if command -v eas &> /dev/null; then
    success "EAS CLI installed: $(eas --version)"
else
    warning "EAS CLI not found"
    echo ""
    echo "  To install: npm install -g eas-cli"
    echo ""
    read -p "Install EAS CLI now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm install -g eas-cli
        success "EAS CLI installed"
    fi
fi

# ============================================================================
# 6. Check Configuration
# ============================================================================
step "Verifying Configuration..."

# Check app.json
if grep -q "com.quranapp.memorizerai" app.json; then
    success "Package name configured"
else
    warning "Package name might not be configured correctly"
fi

# Check permissions
if grep -q "RECORD_AUDIO" app.json; then
    success "Audio permission configured"
else
    error "Audio permission not found in app.json"
fi

# ============================================================================
# Summary
# ============================================================================
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Build Preparation Complete!${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""

# ============================================================================
# Next Steps
# ============================================================================
echo -e "${BLUE}Next Steps:${NC}"
echo ""
echo "For EAS Build (Recommended):"
echo "  1. eas login"
echo "  2. eas build --platform android --profile production"
echo ""
echo "For Local Build:"
echo "  1. npx expo prebuild --platform android"
echo "  2. cd android && ./gradlew assembleRelease"
echo ""
echo "For more details, see BUILD_GUIDE.md"
echo ""

# Ask if user wants to start build now
read -p "Start EAS build now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${BLUE}Starting EAS build...${NC}"
    
    # Check if logged in
    if eas whoami &> /dev/null; then
        eas build --platform android --profile production
    else
        echo "Please login first:"
        eas login
        eas build --platform android --profile production
    fi
else
    echo ""
    echo -e "${YELLOW}Build not started. Run manually when ready.${NC}"
fi
