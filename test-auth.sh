#!/bin/bash

echo "🚀 Authentication System Test Script"
echo "==================================="

# Check if the backend is running
echo "1. Checking backend connection..."
if curl -s http://localhost:8000/api/v1/auth/user > /dev/null 2>&1; then
    echo "✅ Backend is running on http://localhost:8000"
else
    echo "❌ Backend is not accessible. Please start your Laravel backend on port 8000"
    exit 1
fi

# Check frontend dependencies
echo ""
echo "2. Checking frontend dependencies..."
cd /home/ishan/Documents/Rukshan/Projects/customer/saloon-sahan/Final/saloan-frontend

if [ -f "package.json" ]; then
    echo "✅ Frontend project found"
else
    echo "❌ Frontend project not found"
    exit 1
fi

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed"
else
    echo "📦 Installing dependencies..."
    npm install
fi

# Check environment variables
echo ""
echo "3. Checking environment configuration..."
if [ -f ".env.local" ]; then
    if grep -q "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1" .env.local; then
        echo "✅ API URL configured correctly"
    else
        echo "⚠️  API URL might not be configured correctly"
        echo "Expected: NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1"
    fi
else
    echo "⚠️  .env.local file not found"
fi

# Check key authentication files
echo ""
echo "4. Checking authentication files..."

files=(
    "lib/auth.js"
    "contexts/AuthContext.js"
    "lib/axios.js"
    "components/ProtectedRoute.jsx"
    "app/login/page.jsx"
    "app/signup/page.jsx"
    "app/dashboard/page.jsx"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file missing"
    fi
done

echo ""
echo "5. Starting development server..."
echo "🌐 Frontend will be available at: http://localhost:3000"
echo "🔗 Login page: http://localhost:3000/login"
echo "🔗 Signup page: http://localhost:3000/signup"
echo "🔗 Dashboard: http://localhost:3000/dashboard"
echo ""
echo "📋 Test Checklist:"
echo "   1. Register a new user"
echo "   2. Login with the created user"
echo "   3. Access protected dashboard"
echo "   4. Logout and verify redirection"
echo ""
echo "Press Ctrl+C to stop the development server"
echo ""

# Start the development server
npm run dev
