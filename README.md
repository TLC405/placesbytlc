# INPERSON.TLC 💖

A romantic date planning app designed to help couples discover amazing experiences together!

## ✨ Features

- 🔍 **Smart Search**: Find restaurants, activities, and experiences
- 📍 **Location-Based**: Search near you or pick from preset OKC locations
- ❤️ **Favorites**: Save your favorite spots
- 📋 **Date Planner**: Build the perfect date itinerary
- 🎯 **Advanced Filtering**: Sort by rating, reviews, or distance
- 🎨 **Beautiful Design**: Romantic theme with smooth animations
- 🔐 **Secure**: Protected with access control
- 👻 **Boo Mode**: Link with partner for shared adventures (coming soon)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Google Maps API key (with Places API enabled)

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Step 3: Install dependencies
npm i

# Step 4: Start the development server
npm run dev
```

### 🔑 Configuration

**IMPORTANT**: Before using the app, you need to configure the Google Maps API key.

See [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) for detailed instructions.

**Quick setup:**
1. Open browser console (F12)
2. Run: `localStorage.setItem('gm_api_key_secure', 'YOUR_API_KEY')`
3. Refresh the app
4. Enter secret code: `tlcinokc`

## 📱 How to Use

1. **Enter access code** at Command Center (WARLORD or ADMIN mode)
2. **Search** for date ideas using the search bar or category buttons
3. **Pick a location** from the presets or use your current location
4. **Browse results** and click on places to see details
5. **Add to Plan** to build your perfect date

## 🛠️ Tech Stack

This project is built with:

- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **React** - UI framework
- **Tailwind CSS** - Styling
- **shadcn-ui** - UI components
- **Google Maps API** - Places data
- **React Router** - Navigation
- **Sonner** - Toast notifications

## 📋 Security Features

- ✅ Input validation on all search queries (max 200 chars)
- ✅ Secure API key storage with access control
- ✅ XSS protection via React
- ✅ Proper URL encoding for external links
- ✅ No sensitive data logged to console

## 🆕 Version History

Click the "Updates" button in the app header to see the full changelog!

**Latest Version: 1.5.0**
- 🔒 Enhanced security with input validation
- 📝 Added comprehensive version changelog
- 🎨 Improved UI animations and transitions
- ⚡ Performance optimizations across the app

## 🚀 Deployment

### Via Lovable

Simply open [Lovable](https://lovable.dev/projects/ee2e66a7-1043-4b77-86a2-af77f947ef61) and click on Share -> Publish.

### Via GitHub

You can edit this code:
- **Use Lovable**: Visit the [Lovable Project](https://lovable.dev/projects/ee2e66a7-1043-4b77-86a2-af77f947ef61)
- **Use your IDE**: Clone this repo and push changes
- **Use GitHub**: Edit files directly or use GitHub Codespaces

### Custom Domain

To connect a custom domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain)

## 📄 License

This project is private and made with love for an amazing experience 💕

---

Made with 💖 for INPERSON.TLC

**Project URL**: https://lovable.dev/projects/ee2e66a7-1043-4b77-86a2-af77f947ef61
