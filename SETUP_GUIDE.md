# Setup Guide for New Environment

This guide helps you set up Hand2Hand on a new laptop after cloning from Git.

## Prerequisites

Before starting, ensure you have installed:
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - Either:
  - Local installation - [Download here](https://www.mongodb.com/try/download/community)
  - MongoDB Atlas (cloud) - [Sign up here](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download here](https://git-scm.com/)

## Step-by-Step Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd hand2hand
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env
```

**Edit the `.env` file** with your actual configuration:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/hand2hand  # Or your MongoDB Atlas URL
JWT_SECRET=your_random_secret_key_here         # Generate a strong random string
JWT_EXPIRE=30d
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com                # Your Gmail address
EMAIL_PASSWORD=your_app_password               # Gmail App Password (not regular password)
```

**Important Notes:**
- For `JWT_SECRET`: Generate a random string (e.g., using `openssl rand -base64 32`)
- For `EMAIL_PASSWORD`: Use Gmail App Password, not your regular password
  - Enable 2FA on your Gmail account
  - Go to: Google Account → Security → 2-Step Verification → App passwords
  - Create an app password and use it here

```bash
# Start the backend server
npm start

# Or for development with auto-reload
npm run dev
```

### 3. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file if you have custom API URL
echo "REACT_APP_API_URL=http://localhost:5000" > .env

# Start the frontend
npm start
```

The frontend will run on `http://localhost:3000`

### 4. Admin Panel Setup

Open another terminal:

```bash
# Navigate to admin directory
cd admin

# Install dependencies
npm install

# Create .env file if needed
echo "REACT_APP_API_URL=http://localhost:5000" > .env

# Start the admin panel
npm start
```

The admin panel will prompt you for a different port (usually 3001).

### 5. Seed Test Data (Optional)

If you want test users for development:

```bash
cd backend
npm run seed
```

This creates test users. Check `TEST_CREDENTIALS.md` for login details.

## Common Issues & Solutions

### Issue 1: "Cannot connect to MongoDB"
**Solution:**
- Ensure MongoDB is running: `mongod` (or check MongoDB Compass)
- Verify `MONGO_URI` in `.env` is correct
- For MongoDB Atlas, ensure your IP is whitelisted

### Issue 2: "Port 5000 already in use"
**Solution:**
- Change `PORT` in backend `.env` to another port (e.g., 5001)
- Update `REACT_APP_API_URL` in frontend/admin `.env` files

### Issue 3: "Module not found" errors
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: Email not sending
**Solution:**
- Verify `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`
- Use Gmail App Password (not regular password)
- Ensure "Less secure app access" is OFF (use App Passwords instead)

### Issue 5: CORS errors
**Solution:**
- Ensure backend is running before starting frontend/admin
- Check that API URLs match between frontend/backend

## Verification Checklist

After setup, verify everything works:

- [ ] Backend runs without errors: `http://localhost:5000/api/health`
- [ ] Frontend loads: `http://localhost:3000`
- [ ] Admin panel loads: `http://localhost:3001` (or assigned port)
- [ ] Can register new user
- [ ] Can login
- [ ] MongoDB shows data in `hand2hand` database

## Environment Variables Summary

### Backend `.env` (REQUIRED)
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/hand2hand
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### Frontend `.env` (Optional)
```env
REACT_APP_API_URL=http://localhost:5000
```

### Admin `.env` (Optional)
```env
REACT_APP_API_URL=http://localhost:5000
```

## Quick Start Commands

After initial setup, use these commands to start the application:

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm start

# Terminal 3 - Admin (if needed)
cd admin && npm start
```

## Security Notes

- **Never commit `.env` files** to Git (they are now in `.gitignore`)
- **Change default JWT_SECRET** in production
- **Use strong passwords** for admin accounts
- **Keep dependencies updated**: `npm audit fix`

## Need Help?

- Check `README.md` for feature documentation
- Check `TEST_CREDENTIALS.md` for test user credentials
- Review `QUICKSTART.md` for quick setup overview
- Review `FEATURES.md` for detailed feature list

---

**Last Updated:** February 2026
