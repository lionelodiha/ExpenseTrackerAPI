#!/bin/bash

echo "🚀 Starting Air Pay Backend..."
echo ""

# Check if .NET is installed
if command -v dotnet &> /dev/null; then
    echo "✅ .NET SDK found"
    echo "📂 Navigating to backend directory..."
    cd backend
    
    echo "🔧 Restoring dependencies..."
    dotnet restore
    
    echo "🗄️  Applying database migrations..."
    dotnet ef database update || echo "⚠️  Migration failed - you may need to set up the database first"
    
    echo "▶️  Starting backend server..."
    dotnet run --urls "http://localhost:5068"
else
    echo "❌ .NET SDK not found"
    echo ""
    echo "Options to start the backend:"
    echo ""
    echo "1. Install .NET 8.0 SDK:"
    echo "   https://dotnet.microsoft.com/download/dotnet/8.0"
    echo ""
    echo "2. Use Docker (if available):"
    echo "   docker compose up"
    echo ""
    echo "3. Ask someone with .NET installed to start it for you"
fi
