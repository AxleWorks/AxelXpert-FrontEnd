# Cloudinary Upload Preset Setup - REQUIRED

## ⚠️ URGENT: Upload Preset Configuration Required

If you're getting this error:
```
Transformation parameter is not allowed when using unsigned upload
```

You need to create the upload preset in your Cloudinary console **before testing the upload feature**.

## Quick Setup Steps:

### 1. Login to Cloudinary
- Go to: https://console.cloudinary.com
- Login with your account

### 2. Create Upload Preset
- Settings → Upload tab
- Scroll to "Upload presets"
- Click "Add upload preset"

### 3. Configure Preset
```
Preset name: profile_photos
Signing mode: Unsigned
Folder: profile_photos
Use filename: false
Unique filename: true
```

### 4. ⚠️ CRITICAL: Add Transformation
Under "Incoming Transformation":
```
Width: 400
Height: 400
Crop: fill
Gravity: face
Quality: auto
Format: auto
```

### 5. Save Preset
Click "Save" button

## Why This Is Required

For **unsigned uploads** (client-side), Cloudinary requires:
- All transformations to be pre-configured in upload presets
- No transformation parameters in the upload request
- Only specific parameters are allowed in the upload call

## Test Upload

After creating the preset:
1. Restart your dev server: `npm run dev`
2. Go to Settings page
3. Try uploading a profile photo
4. Should work without errors

## Alternative: Use Signed Uploads

If you prefer server-side control:
1. Implement signed uploads on your backend
2. Generate signatures server-side
3. Pass transformation parameters in the request

But unsigned uploads are simpler for profile photos.

---

**Status**: Upload preset `profile_photos` must be created in Cloudinary console before the upload feature will work.