# 🔧 Troubleshooting Guide - Air Pay

## Common Issues and Solutions

---

### 🔴 401 Unauthorized Error

**Symptoms:**
- Error: "Failed to load resource: 401 (Unauthorized)"
- Can't access dashboard
- Getting kicked back to login

**Solution:**

1. **Clear your browser data**:
   - Press F12
   - Console tab
   - Type: `localStorage.clear()`
   - Refresh page (F5)

2. **Register a new account**:
   - Go to: http://localhost:3000/register
   - Create account with any email/password
   - Login with same credentials

3. **That's it!** ✅

---

### 🔴 ERR_CONNECTION_REFUSED

**Symptoms:**
- Error: "net::ERR_CONNECTION_REFUSED"
- Can't connect to backend
- Login button does nothing

**Solution:**

**Backend is NOT running!** You need to start it on YOUR Windows PC:

**Quick Fix:**
```powershell
cd "C:\Users\KING VINCENZO\Documents\GitHub\ExpenseTrackerAPI\backend-mock"
npm install
npm start
```

**Verify it's running:**
- Open: http://localhost:5068/health
- Should see: `{"status":"OK"}`

---

### 🔴 Cannot find module / npm errors

**Symptoms:**
- "Cannot find module"
- "npm is not recognized"
- Missing dependencies

**Solution:**

1. **Install Node.js**:
   - Download: https://nodejs.org/
   - Get LTS version
   - Restart terminal after install

2. **Install dependencies**:
   ```powershell
   cd frontend
   npm install
   
   cd ../backend-mock
   npm install
   ```

---

### 🔴 Port Already in Use

**Symptoms:**
- "EADDRINUSE: address already in use :::5068"
- "Port 5068 is already in use"

**Solution:**

**Find and kill the process:**

Windows PowerShell:
```powershell
# Find process using port 5068
netstat -ano | findstr :5068

# Kill it (replace <PID> with the number from above)
taskkill /PID <PID> /F
```

Then start your backend again.

---

### 🔴 Database Connection Failed

**Symptoms:**
- "Failed to connect to database"
- "Connection refused to localhost:5432"
- Entity Framework errors

**Solution:**

**If using Mock Backend:**
- No database needed! ✅
- Just use the mock backend

**If using Real .NET Backend:**

1. **Start PostgreSQL**:
   ```powershell
   # Using Docker
   docker run --name expense-tracker-db `
     -e POSTGRES_DB=expense_tracker `
     -e POSTGRES_USER=postgres `
     -e POSTGRES_PASSWORD=postgres `
     -p 5432:5432 `
     -d postgres:14
   ```

2. **Apply migrations**:
   ```powershell
   cd backend
   dotnet ef database update
   ```

---

### 🔴 CORS Error

**Symptoms:**
- "Access-Control-Allow-Origin" error
- "CORS policy" error in console

**Solution:**

**Already fixed!** ✅ The backend is configured to allow CORS from:
- http://localhost:3000
- http://localhost:5173
- http://localhost:5174

If still seeing the error:
1. Clear browser cache
2. Restart backend
3. Make sure backend is running on port 5068

---

### 🔴 White Screen / Blank Page

**Symptoms:**
- Frontend shows nothing
- White/blank screen
- No errors in console

**Solution:**

1. **Check if frontend is running**:
   - Should see: `Local: http://localhost:3000`

2. **Restart frontend**:
   ```powershell
   cd frontend
   npm run dev
   ```

3. **Clear cache**:
   - Hard refresh: Ctrl+Shift+R
   - Or open in incognito window

---

### 🔴 Login/Register Not Working

**Symptoms:**
- Button click does nothing
- Form doesn't submit
- No error message

**Checklist:**

- [ ] Backend is running (check: http://localhost:5068/health)
- [ ] No console errors (press F12)
- [ ] Filled all required fields
- [ ] Email format is valid
- [ ] Password is at least 6 characters
- [ ] Passwords match (for registration)

**Debug Steps:**

1. Open browser console (F12)
2. Go to Network tab
3. Try to login
4. Look for failed requests
5. Check error message

---

### 🔴 Dashboard Shows No Data

**Symptoms:**
- Dashboard loads but empty
- No transactions shown
- Charts are empty

**This is Normal!**

The mock backend provides sample data automatically.

**If using Real Backend:**
- You need to add expenses first
- Go to "Add Expense" to create some data

---

### 🔴 .NET Version Error

**Symptoms:**
- "You must install or update .NET"
- "Framework not found"

**Solution:**

**Already fixed!** ✅ The project now uses .NET 9.0 (which you have)

If still seeing error:
```powershell
cd backend
dotnet restore
dotnet build
dotnet run
```

---

### 🔴 Can't Access Dashboard After Login

**Symptoms:**
- Login succeeds but redirects to login again
- Stuck in login loop
- Dashboard won't load

**Solution:**

1. **Clear localStorage**:
   ```javascript
   localStorage.clear()
   ```

2. **Check browser console** (F12) for errors

3. **Try incognito mode**

4. **Register a fresh account**

---

## 🆘 Still Having Issues?

### Quick Checklist:

1. **Backend Running?**
   - Test: http://localhost:5068/health
   - Should see: `{"status":"OK"}`

2. **Frontend Running?**
   - Test: http://localhost:3000
   - Should see: Air Pay landing page

3. **Registered Account?**
   - Go to: /register
   - Create new account
   - Login with same credentials

4. **Browser Console Clean?**
   - Press F12
   - Check for red errors
   - Screenshot and review

### Nuclear Option: Fresh Start

If nothing works, try this:

```powershell
# 1. Stop everything (Ctrl+C in all terminals)

# 2. Clear browser data
# In browser: localStorage.clear()

# 3. Fresh install frontend
cd frontend
rm -rf node_modules
npm install
npm run dev

# 4. Fresh start mock backend
cd ../backend-mock
rm -rf node_modules
npm install
npm start

# 5. Open incognito window
# Go to: http://localhost:3000
# Register new account
# Login
```

---

## 📊 System Status Check

Run these commands to verify everything:

```powershell
# Check Node.js
node --version
# Should show: v18.x.x or higher

# Check npm
npm --version
# Should show: 9.x.x or higher

# Check .NET
dotnet --version
# Should show: 9.0.x

# Check backend health
curl http://localhost:5068/health
# Should show: {"status":"OK"}

# Check frontend
curl http://localhost:3000
# Should return HTML
```

---

**Most issues are solved by:**
1. ✅ Making sure backend is running
2. ✅ Clearing localStorage
3. ✅ Registering a fresh account
4. ✅ Logging in with correct credentials

Try those first! 🚀
