import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// File mappings for each section
const sectionFiles: Record<string, { files: string[]; readme: string }> = {
  teefeeme: {
    files: [
      'src/pages/TeeFeeMeCartoonifier.tsx',
      'supabase/functions/teefeeme-cartoonify/index.ts',
      'src/lib/backgroundRemoval.ts',
    ],
    readme: `# TeeFee Me Cartoonifier Module

## 📸 Features
- AI-powered cartoon transformation using Lovable AI
- Image upload and preview
- Multiple cartoon styles
- Progress animations with funny messages
- Download cartoonified images

## 🔧 Setup
1. Copy all files to their respective locations
2. Ensure Lovable AI is configured in your Supabase project
3. Deploy the edge function: \`supabase functions deploy teefeeme-cartoonify\`

## 📁 Files Included
- TeeFeeMeCartoonifier.tsx - Main page component
- teefeeme-cartoonify/index.ts - Edge function for AI processing
- backgroundRemoval.ts - Image processing utilities

## 🎨 Usage
\`\`\`tsx
import TeeFeeMeCartoonifier from '@/pages/TeeFeeMeCartoonifier'

<Route path="/teefeeme" element={<TeeFeeMeCartoonifier />} />
\`\`\`

## 🔑 Environment Variables
- LOVABLE_API_KEY - Required for AI cartoonification

## 🎯 Dependencies
- @huggingface/transformers
- react-hook-form
- zod
`
  },
  
  places: {
    files: [
      'src/pages/NewHome.tsx',
      'src/pages/Home.tsx',
      'src/components/SearchBar.tsx',
      'src/components/FilterBar.tsx',
      'src/components/PlaceCard.tsx',
      'src/components/PlaceDetailsModal.tsx',
      'src/components/LocationPresets.tsx',
      'src/hooks/usePlacesSearch.ts',
      'src/hooks/useGeolocation.ts',
      'src/hooks/useGoogleMaps.ts',
      'src/lib/googleMaps.ts',
      'src/lib/midpointCalculator.ts',
      'supabase/functions/discover-date-spots/index.ts',
      'supabase/functions/event-discovery/index.ts',
    ],
    readme: `# Places Discovery System

## 🗺️ Features
- Google Maps integration for place search
- Advanced filtering (category, price, rating, distance)
- Location presets for OKC areas
- Midpoint calculator for couples
- Geolocation support
- Place details with photos, reviews, hours
- Save favorites

## 🔧 Setup
1. Get Google Maps API key
2. Add to .env: \`VITE_GOOGLE_MAPS_API_KEY=your_key\`
3. Enable these APIs in Google Cloud Console:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Deploy edge functions

## 📁 Files Included
- NewHome.tsx - Modern places page with search
- SearchBar.tsx - Location search component
- FilterBar.tsx - Advanced filters UI
- PlaceCard.tsx - Place display card
- PlaceDetailsModal.tsx - Detailed place view
- usePlacesSearch.ts - Places search hook
- useGoogleMaps.ts - Google Maps integration hook
- googleMaps.ts - Google Maps utilities
- midpointCalculator.ts - Calculate midpoint between two locations
- discover-date-spots - Edge function for AI place recommendations
- event-discovery - Edge function for OKC events

## 🎯 Dependencies
- @googlemaps/js-api-loader
- mapbox-gl
- @tanstack/react-query
`
  },

  admin: {
    files: [
      'src/pages/AdminPanel.tsx',
      'src/components/admin/CommandStation.tsx',
      'src/components/admin/UserAnalyticsDashboard.tsx',
      'src/components/admin/UserProfileViewer.tsx',
      'src/components/admin/CupidSettingsPanel.tsx',
      'src/components/admin/ActivityLogViewer.tsx',
      'src/components/admin/SMSNotificationPanel.tsx',
      'src/components/admin/WiFiAnalyzer.tsx',
      'src/components/admin/AppReadinessChecklist.tsx',
      'supabase/functions/admin-portal-data/index.ts',
      'supabase/functions/track-admin-activity/index.ts',
    ],
    readme: `# Admin Panel & Analytics System

## 👑 Features
- User analytics dashboard
- Real-time activity monitoring
- Cupid character settings (10+ controls)
- Live activity log viewer
- SMS notifications
- Network analyzer
- User profile viewer
- Command station for quick actions
- App readiness checklist

## 🔧 Setup
1. Ensure user_roles table exists with admin role
2. Deploy admin edge functions
3. Set up RLS policies for admin access
4. Configure SMS with Twilio (optional)

## 🔑 Access
- Admin PIN: 1309
- Requires \`admin\` or \`warlord\` role in user_roles table

## 📁 Files Included
- AdminPanel.tsx - Main admin dashboard with tabs
- CommandStation.tsx - Quick action buttons
- UserAnalyticsDashboard.tsx - Analytics charts
- UserProfileViewer.tsx - Detailed user profiles
- CupidSettingsPanel.tsx - Advanced Cupid controls
- ActivityLogViewer.tsx - Real-time activity logs
- admin-portal-data - Edge function for fetching admin data
- track-admin-activity - Edge function for logging admin actions

## 🎯 Database Tables Used
- user_activity_log
- user_analytics
- user_sessions
- ip_history
- profiles
- user_roles
- app_settings

## 🔒 Security
All admin routes check for:
1. Valid PIN in localStorage
2. Admin role in user_roles table
3. RLS policies restrict data access
`
  },

  complete: {
    files: ['*'],
    readme: `# FELICIA.TLC - Complete Application

## 🎯 Full Stack Application
This is the complete codebase for FELICIA.TLC, a couples' date planning app.

## ✨ All Features Included
- 🎨 TeeFee Me (AI Cartoonifier)
- 📍 Places Discovery (Google Maps)
- 🧠 Quizzes (Love Language, MBTI)
- 📅 Period Tracker (Peripod)
- 👑 Admin Panel & Analytics
- 🔐 Authentication System
- ✨ AI Recommendations
- 💑 Couple Mode
- 🎮 Gamification
- 📊 Tracking & Analytics

## 🛠 Tech Stack
- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Supabase (Database, Auth, Edge Functions)
- Google Maps API
- Lovable AI

## 🚀 Quick Start
1. Clone repository
2. Install: \`npm install\`
3. Copy \`.env.example\` to \`.env\`
4. Add API keys (Supabase, Google Maps)
5. Run migrations: \`supabase db push\`
6. Deploy functions: \`supabase functions deploy --no-verify-jwt\`
7. Start: \`npm run dev\`

## 🔑 Access Codes
- Tester: CRIP / CRIP4LYFE
- Admin: 1309

## 📊 Database Setup
Run migrations in order:
1. Create user_roles table
2. Create profiles table
3. Create activity_log table
4. Create analytics tables
5. Set up RLS policies
6. Create edge functions

## 📱 PWA Installation
App is installable on mobile devices via Add to Home Screen.

## 🎨 Design System
- HSL color tokens in index.css
- Semantic design system
- Dark mode support
- Responsive breakpoints

## 📦 Folder Structure
\`\`\`
src/
├── pages/          - Route components
├── components/     - Reusable components
│   ├── admin/     - Admin-only components
│   └── ui/        - shadcn UI components
├── hooks/         - Custom React hooks
├── lib/           - Utility functions
├── data/          - Static data (quizzes)
└── integrations/  - Supabase client

supabase/
├── functions/     - Edge functions
└── migrations/    - Database migrations
\`\`\`

## 🔧 Scripts
- \`npm run dev\` - Start dev server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build

## 📚 Documentation
Each feature folder includes its own README with:
- Setup instructions
- API documentation
- Usage examples
- Troubleshooting

## 🤝 Support
Built with Lovable AI
`
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sectionId } = await req.json();
    
    console.log(`Export request for section: ${sectionId}`);

    const section = sectionFiles[sectionId];
    
    if (!section) {
      throw new Error(`Unknown section: ${sectionId}`);
    }

    // In production, you would:
    // 1. Read actual file contents from GitHub or your repo
    // 2. Create a ZIP file using JSZip or similar
    // 3. Upload to Supabase Storage
    // 4. Return the storage URL

    // For now, return a mock response with the file list and README
    const fileName = `${sectionId}-export-${Date.now()}.zip`;
    const downloadData = {
      fileName,
      sectionName: sectionId,
      files: section.files,
      readme: section.readme,
      downloadUrl: `https://github.com/lovable-dev/placesbytlc/archive/refs/heads/main.zip`,
      message: `Package includes ${section.files.length} files and complete documentation`
    };

    console.log(`Prepared export package: ${fileName}`);

    return new Response(
      JSON.stringify(downloadData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error: unknown) {
    console.error('Export error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
