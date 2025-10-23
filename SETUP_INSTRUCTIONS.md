# V1 Places - Setup Instructions

## 🔑 Google Maps API Key Configuration

Before deploying this application, you need to configure your Google Maps API key securely.

### Step 1: Get Your Google Maps API Key

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Places API
   - Maps JavaScript API
   - Geocoding API
4. Go to "Credentials" and create an API key
5. **Important**: Restrict your API key to prevent unauthorized usage:
   - Set HTTP referrer restrictions (your domain)
   - Enable only the APIs you need
   - Set usage quotas

### Step 2: Configure the API Key in the App

You have two options:

#### Option A: Using Browser Console (Recommended for testing)

1. Open the app in your browser
2. Open Developer Tools (F12)
3. Go to Console tab
4. Run this command:
   ```javascript
   localStorage.setItem('gm_api_key_secure', 'YOUR_ACTUAL_API_KEY_HERE');
   ```
5. Refresh the page
6. Enter the secret code: `tlcinokc`

#### Option B: Using the API Key Manager (Recommended for deployment)

1. Import the apiKeyManager in your initialization code:
   ```javascript
   import { apiKeyManager } from '@/lib/apiKeyManager';
   ```
2. Initialize the key:
   ```javascript
   apiKeyManager.initializeAPIKey('YOUR_ACTUAL_API_KEY_HERE');
   ```

### Step 3: Access Control

The app uses a secret code (`tlcinokc`) as an access control mechanism. Users must enter this code to unlock the Google Maps functionality.

To change the secret code:
1. Open `src/components/APIKeyDialog.tsx`
2. Find line 31: `const secretCode = 'tlcinokc';`
3. Change it to your desired code

### Security Best Practices

✅ **DO:**
- Restrict your API key in Google Cloud Console
- Set up billing alerts
- Monitor usage regularly
- Use different API keys for development and production
- Keep the secret code private

❌ **DON'T:**
- Commit API keys to version control
- Share your API key publicly
- Use the same key across multiple apps
- Leave API keys unrestricted

### Testing

After setup:
1. Open the app
2. Click "Configure" or wait for the API key dialog
3. Enter secret code: `tlcinokc`
4. Try searching for places

### Troubleshooting

**"API key not configured" error:**
- Check that you've set the key in localStorage
- Verify the key is stored under 'gm_api_key_secure'
- Make sure you're using a valid Google Maps API key

**"Invalid secret code" error:**
- The secret code is: `tlcinokc` (all lowercase)
- Check for typos

**Places not loading:**
- Verify your API key has Places API enabled
- Check browser console for API errors
- Ensure your API key isn't restricted from your current domain

## 📱 App Features

- 🔍 Search for date spots (restaurants, activities)
- 📍 Location-based discovery
- ❤️ Favorites system
- 📋 Date plan builder
- 🎯 Advanced filtering and sorting
- 🎨 Beautiful romantic theme

## 🆕 Version History

Check the "Updates" button in the header to see the full changelog with all new features and improvements!

---

Made with 💖 for TLC & Felicia
