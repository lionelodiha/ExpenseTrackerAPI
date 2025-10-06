# 🔐 How to Login - Fix 401 Unauthorized Error

## ✅ Backend is Running!

Good news: Your backend is working! The 401 error means you just need to **register and login**.

---

## 🚀 Quick Fix - Follow These Steps:

### Step 1: Clear Old Data

Open your browser **Developer Tools**:
- Press `F12` or `Ctrl+Shift+I` (Windows)
- Go to the **Console** tab
- Type this and press Enter:

```javascript
localStorage.clear()
```

Then **refresh the page** (F5)

### Step 2: Go to Home Page

Navigate to: http://localhost:3000

You should see the landing page with "Air Pay"

### Step 3: Register a New Account

1. Click **"Create account"** button (or go to http://localhost:3000/register)

2. Fill in the form:
   - **Full Name**: Your Name (e.g., "John Doe")
   - **Email**: any email (e.g., "test@example.com")
   - **Password**: at least 6 characters (e.g., "password123")
   - **Confirm Password**: same password

3. Check the Terms of Service checkbox

4. Click **"Create Account"**

### Step 4: Login

After registration, you'll be redirected to the login page.

1. Enter your credentials:
   - **Email**: test@example.com (the one you just registered)
   - **Password**: password123 (the one you just used)

2. Click **"Sign In"**

### Step 5: Success! 🎉

You should now see your beautiful Air Pay dashboard with:
- ✅ Balance card
- ✅ Spending statistics
- ✅ Recent transactions
- ✅ Expense charts

---

## 🐛 Still Getting 401 Error?

### If Using Mock Backend:

The mock backend stores data in memory. If you restarted it, all users were deleted.

**Solution**: Register a new account again (it only takes 30 seconds!)

### If Using Real .NET Backend:

**Option 1: Register a new account**
- Go to http://localhost:3000/register
- Create a new account with a different email

**Option 2: Check database**
If you want to use an existing account, make sure:
1. PostgreSQL is running
2. The user exists in the database
3. The password is correct

---

## 🔍 What's Happening?

When you login:
1. Backend verifies your email/password
2. Backend creates a JWT token
3. Frontend saves the token to localStorage
4. Frontend sends the token with every request
5. Backend checks the token (401 if missing/invalid)

The **401 Unauthorized** error means:
- ❌ No token (not logged in)
- ❌ Invalid token
- ❌ Expired token

**Solution**: Login to get a fresh token!

---

## 📝 Test Credentials

If using **Mock Backend**, you can use:

**First Time:**
- Register with ANY email/password
- Then login with those same credentials

**Example:**
- Email: `admin@airpay.com`
- Password: `admin123456`

(Register these first, then login)

---

## ✅ Verification Checklist

Make sure:
- [ ] Backend is running on http://localhost:5068
- [ ] Frontend is running on http://localhost:3000
- [ ] You cleared localStorage
- [ ] You registered a NEW account
- [ ] You're using the SAME email/password to login

---

## 🎯 Quick Test

1. **Open a new incognito/private window**
2. Go to: http://localhost:3000
3. Click "Create account"
4. Register with: 
   - Name: Test User
   - Email: newuser@test.com
   - Password: test123456
5. Login with the same email/password
6. **You should see the dashboard!** ✅

---

**The 401 error will go away once you register and login properly!** 🚀
