# AxelXpert Frontend Troubleshooting Guide

## 🚨 Frontend Won't Start? Follow These Steps:

### Step 1: Check Prerequisites
```powershell
# Check Node.js version (should be 20.19+ or 22.12+)
node --version

# Check npm version
npm --version
```

### Step 2: Navigate to Project Directory
```powershell
cd "E:\Software Projects Sineth\Sineth's Projects\AxelXpert\AxelXpert-FrontEnd"
```

### Step 3: Clean Install Dependencies
```powershell
# Remove existing node_modules and lock file
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue

# Clear npm cache
npm cache clean --force

# Fresh install
npm install
```

### Step 4: Start Development Server
```powershell
npm run dev
```

## 🔧 Common Issues & Solutions

### Issue 1: Node Version Incompatibility
**Error**: "You are using Node.js X.X.X. Vite requires Node.js version 20.19+ or 22.12+"

**Solution**: 
- Download and install Node.js 20.19+ or 22.12+ from [nodejs.org](https://nodejs.org/)
- Restart your terminal after installation

### Issue 2: Port Already in Use
**Error**: "Port 5173 is already in use"

**Solution**:
```powershell
# Kill process using port 5173
netstat -ano | findstr :5173
# Note the PID and kill it
taskkill /PID <PID_NUMBER> /F

# Or start on different port
npm run dev -- --port 3000
```

### Issue 3: Module Import Errors
**Error**: "The requested module does not provide an export named..."

**Solution**:
```powershell
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

### Issue 4: Permission Errors
**Error**: "EACCES: permission denied"

**Solution**:
- Run PowerShell as Administrator
- Or use: `npm config set prefix "C:\Users\%USERNAME%\AppData\Roaming\npm"`

### Issue 5: Network/Proxy Issues
**Solution**:
```powershell
# Clear npm cache
npm cache clean --force

# Set registry to default
npm config set registry https://registry.npmjs.org/

# Retry installation
npm install
```

## 🚀 Quick Fix Script

Copy and paste this entire block into PowerShell:

```powershell
# Navigate to project
cd "E:\Software Projects Sineth\Sineth's Projects\AxelXpert\AxelXpert-FrontEnd"

# Clean everything
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm cache clean --force

# Fresh install
npm install

# Start development server
npm run dev
```

## 📱 Alternative: Use Yarn

If npm continues to have issues:

```powershell
# Install yarn globally
npm install -g yarn

# Use yarn instead
yarn install
yarn dev
```

## 🔍 Debug Mode

If still having issues, run with debug information:

```powershell
# Enable debug mode
$env:DEBUG="vite:*"
npm run dev

# Or with verbose logging
npm run dev --verbose
```

## 📞 Get Help

If none of these work:

1. **Check the terminal output** for specific error messages
2. **Copy the exact error** and search for solutions
3. **Try different port**: `npm run dev -- --port 3000`
4. **Check firewall/antivirus** settings
5. **Restart computer** if all else fails

## ✅ Success Indicators

When working correctly, you should see:
```
VITE v7.1.7  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

Then open: http://localhost:5173/

---

**Need more help?** Run these commands and share the output:
```powershell
node --version
npm --version
npm run dev
```
