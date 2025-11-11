#!/bin/bash
# Tauri Linux Dependencies Installation Script
# Run this with: chmod +x INSTALL_DEPENDENCIES.sh && ./INSTALL_DEPENDENCIES.sh

echo "Installing Tauri dependencies for Debian/Ubuntu..."
echo ""

# Update package list
sudo apt-get update

# Install required libraries for Tauri
sudo apt-get install -y \
    libwebkit2gtk-4.1-dev \
    libsoup-3.0-dev \
    build-essential \
    curl \
    wget \
    file \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev

echo ""
echo "✓ Dependencies installed successfully!"
echo ""
echo "Now you can run: npm run tauri dev"
