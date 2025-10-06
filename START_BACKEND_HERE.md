# 🚀 START YOUR BACKEND HERE

## Quick Start - Mock Backend (Easiest!)

The easiest way to get your backend running is to use the mock server:

### On Windows (PowerShell or CMD):

**Option 1: Using the batch file** (Double-click or run in CMD)
```cmd
start-mock-backend.bat
```

**Option 2: Manual start**
```cmd
cd backend-mock
npm install
npm start
```

### On Linux/Mac:

```bash
cd backend-mock
npm install
npm start
```

---

## What You'll See

When the mock backend starts successfully:

```
🎭 ========================================
    Air Pay Mock Backend Server
========================================

✅ Server running on: http://localhost:5068
📚 API docs: http://localhost:5068/scalar/v1
💚 Health check: http://localhost:5068/health

📝 Available endpoints:
   - POST /api/v1/auth/register
   - POST /api/v1/auth/login
   - GET  /api/v1/auth/me
   - GET  /api/v1/dashboard/summary

🔥 Ready to accept requests!
```

---

## Verify It's Working

1. **Open a new browser tab** and go to:
   - http://localhost:5068/health
   
2. **You should see**:
   ```json
   {
     "status": "OK",
     "message": "Mock backend is running!",
     "timestamp": "..."
   }
   ```

3. **Now your login will work!** ✅

---

## Alternative: Real .NET Backend

If you want to use the real .NET backend instead:

### Prerequisites:
- ✅ .NET 9.0 SDK installed (you have this!)
- ✅ PostgreSQL database running

### Steps:

1. **Start PostgreSQL** (if not running):
   ```powershell
   # Using Docker
   docker run --name expense-tracker-db `
     -e POSTGRES_DB=expense_tracker `
     -e POSTGRES_USER=postgres `
     -e POSTGRES_PASSWORD=postgres `
     -p 5432:5432 `
     -d postgres:14
   ```

2. **Navigate to backend directory**:
   ```powershell
   cd backend
   ```

3. **Restore packages**:
   ```powershell
   dotnet restore
   ```

4. **Apply migrations**:
   ```powershell
   dotnet ef database update
   ```

5. **Run the backend**:
   ```powershell
   dotnet run
   ```

---

## Troubleshooting

### "Port 5068 already in use"
- Stop any existing server on that port
- On Windows: 
  ```powershell
  netstat -ano | findstr :5068
  taskkill /PID <PID> /F
  ```

### "npm: command not found"
- You need Node.js installed
- Download from: https://nodejs.org/

### Backend starts but frontend can't connect
1. Check the backend is running: http://localhost:5068/health
2. Check CORS is enabled (already done in config)
3. Make sure frontend is using the correct URL (already configured)

---

## 🎯 Recommended: Use Mock Backend

For quick testing and development, I recommend using the **mock backend**:

✅ **Pros:**
- No database setup needed
- Quick to start
- Perfect for frontend testing
- Same API as real backend

❌ **Cons:**
- Data stored in memory (lost on restart)
- Not for production use

---

## After Backend Starts

1. **Leave the backend running** (don't close the terminal)
2. **Open a NEW terminal** for the frontend
3. **Start frontend**:
   ```powershell
   cd frontend
   npm run dev
   ```
4. **Open browser**: http://localhost:3000
5. **Register and login** - it will work! 🎉

---

**Choose one option above and start your backend now!** 🚀
