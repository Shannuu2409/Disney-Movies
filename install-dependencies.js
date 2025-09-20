#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Installing Movie Web App dependencies...\n');

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  console.error('❌ package.json not found. Please run this script from the project root directory.');
  process.exit(1);
}

try {
  // Install all dependencies
  console.log('📦 Installing npm packages...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('\n✅ Dependencies installed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Set up your environment variables (see ENVIRONMENT_SETUP.md)');
  console.log('2. Create a .env.local file with your API keys');
  console.log('3. Run: npm run dev');
  console.log('\n🔗 Required APIs:');
  console.log('- TMDB API: https://www.themoviedb.org/settings/api');
  console.log('- Firebase: https://console.firebase.google.com/');
  console.log('- MongoDB: https://www.mongodb.com/atlas');
  
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  process.exit(1);
}
