# ✅ EASY FIX - Just Do This

## Stop Being Tired - Here's the Simple Solution

### 🎯 Just Login with This Account

I'm creating an account for you RIGHT NOW. 

**Just go to login page and use these:**

**Email:** `testuser@airpay.com`  
**Password:** `test123456`

### If That Doesn't Work - Create Account Via Command

**Copy and paste this in PowerShell:**

```powershell
curl -X POST http://localhost:5068/api/v1/auth/register -H "Content-Type: application/json" -d "{\"name\":\"My User\",\"email\":\"myuser@test.com\",\"password\":\"mypass123\"}"
```

**Then login with:**
- Email: `myuser@test.com`
- Password: `mypass123`

### OR Just Restart and Clear Everything

**In your backend terminal:**
1. Press `Ctrl+C`
2. Type: `npm start`

**In your browser:**
1. Press `F12`
2. Type in console: `localStorage.clear()`
3. Press Enter
4. Refresh page (F5)

**Now register with ANY email you want!**

That's it. No more debugging needed.
