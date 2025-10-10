# Cloudinary Setup Guide for AxelXpert

This guide will help you configure Cloudinary for the profile photo upload feature.

## Step 1: Cloudinary Account Setup

Your Cloudinary credentials are already configured:
- **Cloud Name**: `dumsebwgb`
- **API Key**: `674861584934777`
- **API Secret**: `Atb2i7vnkA__xnSOR1zCpHVNKww`

## Step 2: Create Upload Preset

1. **Log in to Cloudinary Console**
   - Go to [https://console.cloudinary.com](https://console.cloudinary.com)
   - Log in with your account

2. **Navigate to Settings**
   - Click on the gear icon (Settings) in the top navigation
   - Go to the "Upload" tab

3. **Create Upload Preset**
   - Scroll down to "Upload presets"
   - Click "Add upload preset"
   - Configure the preset with these settings:

   ```
   Preset name: profile_photos
   Signing mode: Unsigned (for client-side uploads)
   ```

4. **Configure Upload Settings**
   ```
   Folder: profile_photos
   Use filename: false
   Unique filename: true
   Overwrite: false
   ```

5. **⚠️ IMPORTANT: Add Transformations in Upload Preset**
   Since we're using unsigned uploads, transformations must be configured in the preset:
   
   **Incoming Transformation:**
   ```
   Width: 400
   Height: 400
   Crop: fill
   Gravity: face
   Quality: auto
   Format: auto
   ```
   
   **Optional Eager Transformations for different sizes:**
   ```
   - Width: 200, Height: 200, Crop: fill, Gravity: face
   - Width: 100, Height: 100, Crop: fill, Gravity: face
   ```

6. **Security Settings** (Optional but recommended)
   ```
   Resource type: image
   Allowed formats: jpg,png,gif,webp
   Max file size: 10000000 (10MB)
   ```

7. **Save the preset**
   - Click "Save"

## Step 3: Backend API Endpoints

Your backend needs to support these endpoints:

### 1. Update Profile Image
```http
PUT /api/users/{id}/profile-image
Content-Type: application/json

Body:
{
  "profileImageUrl": "https://res.cloudinary.com/dumsebwgb/image/upload/v1234567890/profile_photos/user_123/abc123.jpg",
  "cloudinaryPublicId": "profile_photos/user_123/abc123"
}

Response:
{
  "id": 123,
  "username": "johndoe",
  "email": "john@example.com",
  "profileImageUrl": "https://res.cloudinary.com/dumsebwgb/image/upload/v1234567890/profile_photos/user_123/abc123.jpg",
  "cloudinaryPublicId": "profile_photos/user_123/abc123"
}
```

### 2. Delete Profile Image
```http
DELETE /api/users/{id}/profile-image

Response:
{
  "id": 123,
  "username": "johndoe",
  "email": "john@example.com",
  "profileImageUrl": null,
  "cloudinaryPublicId": null
}
```

## Step 4: Database Schema

Add these fields to your User table:

```sql
-- For SQL databases
ALTER TABLE users 
ADD COLUMN profile_image_url VARCHAR(500) NULL,
ADD COLUMN cloudinary_public_id VARCHAR(300) NULL;
```

```java
// For JPA Entity
@Entity
public class User {
    // ... existing fields
    
    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;
    
    @Column(name = "cloudinary_public_id", length = 300)
    private String cloudinaryPublicId;
    
    // ... getters and setters
}
```

## Step 5: Backend Implementation Example

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @PutMapping("/{id}/profile-image")
    public ResponseEntity<UserDTO> updateProfileImage(@PathVariable Long id, @RequestBody UpdateProfileImageRequest request) {
        Optional<User> userOpt = userService.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userOpt.get();
        user.setProfileImageUrl(request.getProfileImageUrl());
        user.setCloudinaryPublicId(request.getCloudinaryPublicId());
        
        User savedUser = userService.save(user);
        return ResponseEntity.ok(userMapper.toDTO(savedUser));
    }
    
    @DeleteMapping("/{id}/profile-image")
    public ResponseEntity<UserDTO> deleteProfileImage(@PathVariable Long id) {
        Optional<User> userOpt = userService.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userOpt.get();
        user.setProfileImageUrl(null);
        user.setCloudinaryPublicId(null);
        
        User savedUser = userService.save(user);
        return ResponseEntity.ok(userMapper.toDTO(savedUser));
    }
}

// Request DTO
public class UpdateProfileImageRequest {
    private String profileImageUrl;
    private String cloudinaryPublicId;
    
    // getters and setters
}
```

## Step 6: Testing the Feature

1. **Start your backend server**
2. **Start the frontend**: `npm run dev`
3. **Navigate to Settings page**
4. **Test upload functionality**:
   - Click the camera icon
   - Select an image file
   - Verify upload progress
   - Check that image appears in header
5. **Test delete functionality**:
   - Click the edit icon (3 dots) on existing photo
   - Select "Delete Photo"
   - Verify photo is removed

## Step 7: Production Considerations

### Security
- Enable signed uploads for production
- Add server-side file validation
- Implement rate limiting for uploads
- Add malware scanning

### Performance
- Use Cloudinary's auto-optimization features
- Implement lazy loading for images
- Consider using responsive images
- Enable browser caching

### Monitoring
- Set up Cloudinary usage alerts
- Monitor upload success/failure rates
- Track storage usage

## Troubleshooting

### Common Issues

1. **Upload fails with "Invalid signature"**
   - Check that upload preset is set to "Unsigned"
   - Verify cloud name is correct

2. **Images not displaying**
   - Check that URLs are publicly accessible
   - Verify CORS settings in Cloudinary

3. **Delete operation fails**
   - Ensure API secret is correct
   - Check signature generation logic

4. **Large file uploads timeout**
   - Increase server timeout settings
   - Consider chunked uploads for very large files

### Debug Mode
Enable debug logging by adding to localStorage:
```javascript
localStorage.setItem('debug', 'cloudinary');
```

## Support Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Upload API Reference](https://cloudinary.com/documentation/image_upload_api_reference)
- [Admin API Reference](https://cloudinary.com/documentation/admin_api)
- [Transformation Reference](https://cloudinary.com/documentation/image_transformation_reference)

---

**Note**: The `.env` file is already configured with your Cloudinary credentials. Make sure to keep these credentials secure and never commit them to version control in production.