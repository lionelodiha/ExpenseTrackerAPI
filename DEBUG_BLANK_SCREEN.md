# 🔍 DEBUG BLANK SCREEN - FOLLOW THESE STEPS

The blank screen could be caused by several issues. Let's debug together!

---

## 🚨 **STEP 1: Pull Latest Code**

```powershell
git pull origin cursor/fix-branch-code-and-implement-web-design-e1fc
```

---

## 🔍 **STEP 2: Check Browser Console**

This is **CRITICAL** - I added console logs to help us debug!

### **How to Open Console:**
1. Press **F12** on your keyboard
2. Click the **"Console"** tab at the top
3. Keep it open while testing

### **Refresh the Page:**
- Press **Ctrl+Shift+R** (hard refresh)

### **What to Look For:**

You should see console messages like:
```
Fetching dashboard summary...
Dashboard response: {...}
```

---

## 📸 **STEP 3: Screenshot Your Console**

**Please send me a screenshot of the entire console tab showing:**
- Any **red error messages**
- The console logs I added
- Any other messages

---

## 🌐 **STEP 4: Check Network Tab**

1. Press **F12**
2. Click **"Network"** tab
3. Refresh page (**Ctrl+Shift+R**)
4. Look for:
   - `login` or `register` request
   - `dashboard/summary` request

### **Check Each Request:**

**Click on** `/api/v1/dashboard/summary`:
- What's the **Status Code**? (Should be 200)
- Click **"Response"** tab - What does it show?
- **Screenshot this too!**

---

## 🖥️ **STEP 5: Verify Backend is Running**

### **Check Backend Terminal:**

You should see:
```
Mock backend server running on http://localhost:5068
```

### **If NOT running:**

```powershell
cd backend-mock
npm start
```

**You should see:**
```
> backend-mock@1.0.0 start
> node server.js

Mock backend server running on http://localhost:5068
```

---

## 🎨 **STEP 6: Verify Frontend is Running**

### **Check Frontend Terminal:**

You should see:
```
VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

### **If NOT running:**

```powershell
cd frontend
npm run dev
```

---

## 🧪 **STEP 7: Test Backend Directly**

Open this URL in your browser:
```
http://localhost:5068/
```

**You should see:**
```json
{"message":"Expense Tracker Mock API is running!"}
```

**If you see this** ✅ → Backend is working!  
**If you get an error** ❌ → Backend is not running!

---

## 🔑 **STEP 8: Check if You're Logged In**

### **Open Browser Console (F12) and type:**

```javascript
localStorage.getItem('token')
```

**Press Enter**

### **Results:**

**If you see:** `"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."` ✅ → You're logged in

**If you see:** `null` ❌ → You're NOT logged in!

### **If NOT logged in:**

1. Clear localStorage:
   ```javascript
   localStorage.clear()
   ```
2. Refresh page
3. Register new account
4. Login

---

## 📋 **STEP 9: Check Complete Setup**

Run these checks and tell me the results:

| Check | Command | Expected Result |
|-------|---------|----------------|
| **Backend running?** | Check terminal | `Mock backend server running...` |
| **Frontend running?** | Check terminal | `Local: http://localhost:5173/` |
| **Backend responds?** | Visit `http://localhost:5068/` | `{"message":"Expense Tracker Mock API is running!"}` |
| **Token exists?** | `localStorage.getItem('token')` in console | Long string starting with `eyJ...` |
| **Console errors?** | F12 → Console tab | No red errors |

---

## 🚀 **STEP 10: Fresh Clean Start**

If still blank, try this complete reset:

### **1. Stop Everything:**
- Close all terminals (Ctrl+C on each)
- Close browser

### **2. Pull Latest Code:**
```powershell
git pull origin cursor/fix-branch-code-and-implement-web-design-e1fc
```

### **3. Start Backend:**
```powershell
cd backend-mock
npm start
```

**Wait for:** `Mock backend server running on http://localhost:5068`

### **4. Start Frontend (NEW TERMINAL):**
```powershell
cd frontend
npm run dev
```

**Wait for:** `Local: http://localhost:5173/`

### **5. Open Browser:**
- Go to: `http://localhost:5173`
- Press **F12** (open console)
- Press **Ctrl+Shift+Delete**

### **6. Clear Everything:**
- Check **"Cookies and other site data"**
- Check **"Cached images and files"**
- Click **"Clear data"**

### **7. Close and Reopen Browser:**
- Completely close browser
- Open new browser window
- Go to: `http://localhost:5173`
- Press **F12** to see console

### **8. Register New Account:**
```
Name: Test User
Email: debug@test.com
Password: Password123
```

### **9. Watch Console:**

You should see:
```
Fetching dashboard summary...
Dashboard response: {success: true, data: {...}}
```

---

## 📸 **WHAT I NEED FROM YOU:**

Please send me screenshots of:

1. ✅ **Browser Console** (F12 → Console tab) - showing any errors
2. ✅ **Network Tab** (F12 → Network → dashboard/summary → Response)
3. ✅ **Frontend Terminal** (showing npm run dev output)
4. ✅ **Backend Terminal** (showing npm start output)
5. ✅ **The blank screen** itself

---

## 🎯 **Quick Checklist**

Before you send screenshots, verify:

- [ ] I pulled the latest code
- [ ] Backend terminal shows "Mock backend server running on http://localhost:5068"
- [ ] Frontend terminal shows "Local: http://localhost:5173/"
- [ ] http://localhost:5068/ shows API message in browser
- [ ] I cleared localStorage and cache
- [ ] I registered a new account
- [ ] F12 console is open
- [ ] I have screenshots ready

---

## 💡 **Common Issues:**

### **Issue 1: Port Already in Use**

**Error:** `EADDRINUSE`

**Fix:**
```powershell
# Find process using port 5068
netstat -ano | findstr :5068

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Restart backend
cd backend-mock
npm start
```

### **Issue 2: CORS Error**

**Console shows:** `Access to fetch... has been blocked by CORS`

**Fix:** Make sure backend is running and you're accessing `http://localhost:5173` (not a different port)

### **Issue 3: 401 Unauthorized**

**Console shows:** `POST http://localhost:5068/api/v1/dashboard/summary 401`

**Fix:**
```javascript
// In browser console
localStorage.clear()
// Then refresh and register new account
```

### **Issue 4: Connection Refused**

**Console shows:** `net::ERR_CONNECTION_REFUSED`

**Fix:** Backend is not running! Start it:
```powershell
cd backend-mock
npm start
```

---

## 🆘 **STILL STUCK?**

Send me:
1. All 5 screenshots mentioned above
2. What you see in browser console
3. What step you're stuck on

---

**LET'S DEBUG THIS TOGETHER!** 🔍🐛
