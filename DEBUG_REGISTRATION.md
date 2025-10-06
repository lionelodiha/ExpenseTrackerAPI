# 🐛 Debug Registration Issue

## Let's Find the Exact Error

### Step 1: Open Browser Console

1. **Press F12** to open Developer Tools
2. **Go to Console tab**
3. **Clear the console** (click the 🚫 icon)

### Step 2: Try to Register

Fill in the form with:
- **Name**: Test User
- **Email**: newemail123@test.com
- **Password**: password123
- **Confirm**: password123

Click "Create Account"

### Step 3: Check Console

In the console, you should see logs like:
```
Register response: {...}
```

**Copy and paste the console output here** or tell me what error you see.

---

## Common Issues and Quick Fixes

### Issue 1: "User with this email already exists"

**✅ Solution:** Use a COMPLETELY different email

Try one of these:
- `random123@airpay.test`
- `newuser456@example.com`  
- `testing789@demo.com`

### Issue 2: "Password must be at least 6 characters"

**✅ Solution:** Use a longer password (6+ characters)

Example: `password123`

### Issue 3: "Email is required" or "Invalid email format"

**✅ Solution:** Make sure email is in correct format

Example: `user@example.com` (must have @ and domain)

### Issue 4: "Name is required"

**✅ Solution:** Fill in the name field

Example: `John Doe`

---

## Quick Test - Use These Exact Values

Copy and paste these into the registration form:

```
Name: Debug User
Email: debuguser_2025_10_06@test.com
Password: debugpass123
Confirm Password: debugpass123
```

**These should work 100%** because the email is unique (has today's date).

---

## If Still Not Working

### Check 1: Is Backend Running?

Open: http://localhost:5068/health

Should see: `{"status":"OK",...}`

### Check 2: Test Backend Directly

Open PowerShell and run:

```powershell
curl -X POST http://localhost:5068/api/v1/auth/register `
  -H "Content-Type: application/json" `
  -d '{"name":"Test","email":"test999@test.com","password":"test123456"}'
```

What response do you get?

---

## Network Tab Check

1. **Press F12**
2. **Go to Network tab**
3. **Try to register**
4. **Click on the failed request** (should be red)
5. **Click Response tab**

**What does the response say?**

---

## Common Response Messages

| Response | Meaning | Fix |
|----------|---------|-----|
| "User with this email already exists" | Email taken | Use different email |
| "Email is required" | Empty field | Fill email field |
| "Invalid email format" | Bad email | Use user@example.com format |
| "Password must be at least 6 characters" | Short password | Use 6+ chars |
| "Name is required" | Empty name | Fill name field |

---

## Emergency Fix: Restart Everything

If nothing works, try this:

### 1. Stop Backend
Go to terminal where backend is running, press `Ctrl+C`

### 2. Clear All Data (Mock Backend Only)
```powershell
cd backend-mock
rm -rf node_modules
npm install
npm start
```

### 3. Clear Browser Data
In browser console (F12):
```javascript
localStorage.clear()
sessionStorage.clear()
```
Then refresh page (F5)

### 4. Try Register with Fresh Email
```
Name: Fresh User
Email: freshstart_123456@test.com
Password: freshpass123
Confirm: freshpass123
```

---

**Tell me what you see in the Console or Network tab and I'll help you fix it!** 🔧
