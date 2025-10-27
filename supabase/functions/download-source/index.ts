import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const README_CONTENT = `# FELICIA.TLC - Places Discovery App

## 🎯 Overview
FELICIA.TLC is a comprehensive web application for discovering, planning, and exploring date spots in Oklahoma City. Built with modern technologies and designed for an exceptional user experience.

## ✨ Core Features

### 📍 Place Discovery
- **Smart Search**: AI-powered place recommendations with Google Maps integration
- **Geolocation**: Find places near you or calculate midpoints between two locations
- **Advanced Filters**: Filter by category, price range, rating, distance, and more
- **Location Presets**: Quick access to popular OKC areas

### 💕 Relationship Features
- **Love Language Quiz**: Discover your love language with interactive quiz
- **MBTI Personality Test**: Find your personality type and compatibility
- **Period Tracker**: Thoughtful partner tool for tracking cycles
- **Date Planning**: Save and organize favorite places for future dates

### 🎨 Creative Tools
- **Cartoon Generator**: Create fun cartoon avatars with AI
- **OKC Legend Forge**: Interactive map with adventure categories (locked with code 666)
- **Couple Mode**: Shared planning features for partners

### 📊 Admin & Analytics
- **Admin Portal**: Comprehensive user analytics dashboard (code: 1309)
- **Session Tracking**: Real-time user behavior monitoring
- **Activity Logs**: Detailed user interaction tracking
- **User Profiles**: View user engagement and patterns

## 🛠 Technical Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful component library
- **Radix UI** - Accessible primitives
- **Lucide Icons** - Consistent iconography

### Backend & Services
- **Supabase** - PostgreSQL database & authentication
- **Edge Functions** - Serverless backend logic
- **Google Maps API** - Places discovery & geolocation
- **Mapbox GL JS** - Interactive map rendering

### Progressive Web App
- **vite-plugin-pwa** - PWA capabilities
- **Workbox** - Service worker management
- **Web App Manifest** - Installable on mobile devices

## 🎮 User Interface Features
- **Dark Mode**: Beautiful themes optimized for any lighting
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Animated UI**: Smooth transitions and micro-interactions
- **Loading States**: Professional loading screens with animations
- **Toast Notifications**: Real-time feedback for user actions

## 🔐 Security & Privacy
- **Secure Authentication**: Email/password with Supabase Auth
- **Row Level Security**: Database policies for data protection
- **Session Management**: Secure session tracking with fingerprinting
- **Admin Access Control**: Multi-level access codes (666, 1309)

## 📱 Installation
The app is installable as a PWA:
1. Visit the website on your mobile device
2. Tap Share → Add to Home Screen (iOS) or Install App (Android)
3. Launch from your home screen like a native app

## 🚀 Features by Role

### Regular Users
- Browse and search date spots
- View place details and ratings
- Get directions via Google Maps
- Take personality quizzes
- Create cartoon avatars

### Testers (Code: 405)
- All user features
- Access to experimental features
- Advanced search capabilities
- Period tracker
- Couple mode planning

### Moderators & Admins
- User analytics dashboard
- Session monitoring
- Activity tracking
- Content management
- System administration

## 🎯 Algorithms & Logic

### Place Recommendation
- Score = w1*Rating + w2*Reviews - w3*Distance - w4*PriceLevel
- Factors: User preferences, location proximity, popularity

### Route Optimization (OKC Legend)
- Greedy nearest-neighbor with 2-opt refinement
- Time budget constraints
- Category diversity scoring

### Session Tracking
- Browser fingerprinting for anonymous tracking
- Real-time activity logging
- Engagement score calculation

## 📊 Database Schema

### Key Tables
- **profiles**: User profile data
- **user_roles**: Role-based access control
- **user_activity_log**: Activity tracking
- **user_analytics**: Aggregated analytics
- **user_sessions**: Session management
- **discovered_places**: Cached place data
- **couples**: Couple pairing system
- **shared_data**: Couple shared content

## 🔧 Configuration

### Environment Variables
- VITE_SUPABASE_URL
- VITE_SUPABASE_PUBLISHABLE_KEY
- VITE_GOOGLE_MAPS_API_KEY

### Access Codes
- **405**: Tester access
- **666**: OKC Legend Forge unlock
- **1309**: Admin portal access

## 🎨 Design System
- Semantic color tokens
- Consistent spacing and typography
- Gradient effects and animations
- Accessible contrast ratios
- Mobile-first responsive breakpoints

## 📈 Performance
- Code splitting for optimal loading
- Lazy loading of routes and images
- Optimized bundle size
- Service worker caching
- Fast API response times

## 🤝 Contributing
This is an open-source project. View the code at:
https://github.com/lovable-dev/placesbytlc

## 📄 License
Open Source

## 🎉 Built With Love
Created with Lovable AI - The world's first AI full-stack engineer
Designed for couples, adventurers, and romantics in Oklahoma City

---

**Queen Felicia's Royal Touch 👑**
Every feature crafted with care for the perfect date experience
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const projectUrl = Deno.env.get('SITE_URL') || 'https://placesbytlc.lovable.app';
    const repoUrl = 'https://github.com/lovable-dev/placesbytlc';
    const downloadUrl = `${repoUrl}/archive/refs/heads/main.zip`;

    return new Response(
      JSON.stringify({ 
        download_url: downloadUrl,
        code_viewer_url: `${projectUrl}/code`,
        repo_url: repoUrl,
        readme: README_CONTENT,
        message: 'Source code package ready - includes full README with features, UI/UX details, and algorithms'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error: unknown) {
    console.error('Error in download-source function:', error);
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
