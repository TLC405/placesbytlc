import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  Users, 
  BarChart3, 
  Terminal, 
  Settings, 
  Download,
  Code,
  ChevronLeft,
  Activity,
  Eye,
  Sparkles,
  MessageSquare,
  Wifi,
  FileCode,
  Rocket
} from "lucide-react";
import { CommandStation } from "@/components/admin/CommandStation";
import { UserAnalyticsDashboard } from "@/components/admin/UserAnalyticsDashboard";
import { UserProfileViewer } from "@/components/admin/UserProfileViewer";
import { CodeExportSystem } from "@/components/admin/CodeExportSystem";
import { SMSNotificationPanel } from "@/components/admin/SMSNotificationPanel";
import { AIPromptInterface } from "@/components/admin/AIPromptInterface";
import { WiFiAnalyzer } from "@/components/admin/WiFiAnalyzer";
import { AppReadinessChecklist } from "@/components/admin/AppReadinessChecklist";
import { FileUploadManager } from "@/components/FileUploadManager";
import { RecentUpdates } from "@/components/RecentUpdates";

interface UserAnalytics {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
  visit_count?: number;
  last_visit?: string;
  locations_visited?: string[];
  pages_visited?: string[];
  places_viewed?: string[];
  searches_made?: string[];
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<UserAnalytics[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [allActivities, setAllActivities] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [codeUnlocked, setCodeUnlocked] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [showCodeDialog, setShowCodeDialog] = useState(true);

  // Setup realtime subscription for analytics
  useEffect(() => {
    if (!codeUnlocked) return;

    const channel = supabase
      .channel('admin-analytics-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => fetchUserAnalytics()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_activity_log' },
        () => fetchUserAnalytics()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_analytics' },
        () => fetchUserAnalytics()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [codeUnlocked]);

  // Check admin access on mount
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        if (!currentUser) {
          toast.error("Please log in to access admin panel");
          navigate('/');
          return;
        }

        setUser(currentUser);

        // Check if user has admin role
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', currentUser.id);
        
        const hasAdminRole = roles?.some(r => r.role === 'admin');
        
        if (!hasAdminRole) {
          toast.error("Admin access required");
          navigate('/');
          return;
        }

        setIsAdmin(true);
        
        // Check if code was already entered in this session
        const sessionCode = sessionStorage.getItem('admin_code_unlocked');
        if (sessionCode === 'true') {
          setCodeUnlocked(true);
          setShowCodeDialog(false);
          fetchUserAnalytics();
        }
      } catch (error) {
        console.error("Admin access check failed:", error);
        toast.error("Failed to verify admin access");
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [navigate]);

  const handleCodeSubmit = () => {
    if (codeInput === "1309") {
      setCodeUnlocked(true);
      setShowCodeDialog(false);
      sessionStorage.setItem('admin_code_unlocked', 'true');
      fetchUserAnalytics();
      toast.success("Access granted");
    } else {
      toast.error("Incorrect code");
      setCodeInput("");
    }
  };

  const fetchUserAnalytics = async () => {
    try {
      console.log('Fetching admin portal data...');
      const { data, error } = await supabase.functions.invoke('admin-portal-data', {
        body: {}
      });
      
      if (error) {
        console.error('Edge function error:', error);
        toast.error('Failed to load analytics data');
        return;
      }

      if (!data) {
        console.warn('No data returned from edge function');
        setUsers([]);
        return;
      }

      console.log('Admin portal data received:', data);

      const profiles = data?.profiles || [];
      const activities = data?.activities || [];
      const analytics = data?.analytics || [];
      
      // Store all activities for UserProfileViewer
      setAllActivities(activities);

      console.log(`Loaded ${profiles.length} profiles, ${activities.length} activities, ${analytics.length} analytics`);

      const userMap = new Map<string, UserAnalytics>();

      profiles.forEach((profile: any) => {
        const userActivities = activities.filter((a: any) => a.user_id === profile.id);
        const userAnalytics = analytics.find((a: any) => a.user_id === profile.id);

        const pageVisits = userActivities.filter((a: any) => a.activity_type === 'page_visit');
        const placeViews = userActivities.filter((a: any) => a.activity_type === 'place_view');
        const searches = userActivities.filter((a: any) => a.activity_type === 'search');

        const locations = new Set<string>();
        userActivities.forEach((activity: any) => {
          const d = activity.activity_data as any;
          if (d?.location?.city && d?.location?.country_name) {
            locations.add(`${d.location.city}, ${d.location.country_name}`);
          } else if (d?.location?.country_name) {
            locations.add(d.location.country_name);
          }
        });

        userMap.set(profile.id, {
          id: profile.id,
          email: profile.email || 'Unknown',
          display_name: profile.display_name || 'Anonymous',
          created_at: profile.created_at,
          visit_count: userAnalytics?.total_sessions || pageVisits.length,
          last_visit: userActivities[0]?.timestamp || profile.created_at,
          locations_visited: Array.from(locations),
          pages_visited: pageVisits.map((a: any) => a.activity_data),
          places_viewed: placeViews.map((a: any) => a.activity_data),
          searches_made: searches.map((a: any) => a.activity_data),
        });
      });

      const userList = Array.from(userMap.values());
      console.log('Processed user list:', userList.length, 'users');
      setUsers(userList);
      
      if (userList.length === 0) {
        toast.info('No user data found yet. Users will appear as they use the app.');
      } else {
        toast.success(`Loaded ${userList.length} users`);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics: ' + (error as Error).message);
    }
  };

  const handleDownloadSource = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('download-source');
      
      if (error) throw error;
      
      // Create README file
      const readme = data?.readme || 'INPERSON.TLC Source Code';
      const readmeBlob = new Blob([readme], { type: 'text/markdown' });
      const readmeUrl = URL.createObjectURL(readmeBlob);
      
      // Download README
      const readmeLink = document.createElement('a');
      readmeLink.href = readmeUrl;
      readmeLink.download = 'INPERSON-TLC-README.md';
      document.body.appendChild(readmeLink);
      readmeLink.click();
      document.body.removeChild(readmeLink);
      URL.revokeObjectURL(readmeUrl);
      
      // Open GitHub download in new tab
      if (data?.download_url) {
        window.open(data.download_url, '_blank');
      }
      
      toast.success("📦 Source code package downloaded! Check your downloads folder for README.md and the ZIP file.");
    } catch (error: any) {
      console.error("Download error:", error);
      toast.error(error.message || "Failed to download source");
    }
  };

  const handleDownloadAIPrompt = async () => {
    try {
      const promptText = `# INPERSON.TLC - Complete App Blueprint for AI Reconstruction

## App Overview
**Name**: INPERSON.TLC — Your Personalized Love Journey
**Purpose**: Oklahoma City date spot discovery platform with AI-powered recommendations
**Stack**: React 18 + Vite + TypeScript + Tailwind CSS + Supabase (Lovable Cloud)
**Theme**: Romantic, playful, feminine aesthetic with pink/purple gradients

## Core Features

### 1. Authentication System
- **Code Gate**: Entry requires case-insensitive code "crip" (military/tactical theme)
- **Admin Code**: "1309" for admin access
- **User Auth**: Email/password signup and login via Supabase Auth
- **Tester Code**: "405" grants tester role with extra features
- Auto-confirm email enabled for faster testing

### 2. Main Tabs
- **Home**: Place discovery with search, filters, map integration
- **Saved**: User's favorited places (auth required)
- **Quizzes**: Love Language & MBTI personality tests
- **Account**: User profile, theme toggle, logout

### 3. Place Discovery
- Google Maps integration for location search
- Filter by: distance, price level ($-$$$), rating, open now
- Quick chips: Outdoors, Indoors, Rain-safe, Low-energy, First date
- Real-time search with debouncing
- Save favorites to Supabase
- Place details modal with full information

### 4. AI Features (Tester Access)
- **Cupid AI**: Date planning with 3-stop itineraries
- **AI Recommendations**: Personalized place suggestions based on user activity
- **Event Discovery**: Oklahoma City events scraping and caching
- **Cartoon Editor (TeeFeeMee)**: Upload photos, apply Ren & Stimpy and other cartoon styles

### 5. Couple Mode Features
- **Pairing System**: Generate unique pairing codes
- **Shared Data**: Couple preferences and favorites
- **Period Tracker**: For couples (code "666" to access)
- **Midpoint Calculator**: Find meetup spots between partners

### 6. Admin Portal (Code: 1309)
- **Dashboard**: User analytics, session tracking, engagement metrics
- **Command Station**: Feature management and app settings
- **User Analytics**: Real-time user activity monitoring
- **Source Download**: Export entire codebase with README
- **AI Prompt Download**: This comprehensive blueprint
- **SMS Debug Panel**: Test messaging features
- **Updates Management**: Track and publish app updates

### 7. Gamification
- User engagement tracking
- Activity logging (page visits, searches, place views)
- Session duration metrics
- IP history and location tracking

## Database Schema (Supabase)

### Tables
1. **profiles**: User info (display_name, avatar_url, email, gender)
2. **user_roles**: Role assignment (user, tester, admin)
3. **user_activity_log**: Activity tracking (activity_type, activity_data)
4. **user_analytics**: Aggregated stats (sessions, time_spent, engagement_score)
5. **user_sessions**: Session tracking (ip_address, device_info, duration)
6. **ip_history**: IP tracking (location_data, visit_count)
7. **user_preferences**: Learned preferences (place types, price levels)
8. **ai_recommendations**: AI-generated suggestions
9. **couples**: Pairing data (partner_1_id, partner_2_id, pairing_code)
10. **shared_data**: Couple shared preferences
11. **discovered_places**: Cached place data from Google
12. **okc_events_cache**: Local events database
13. **app_updates**: Version history and changelog
14. **custom_themes**: Theme configurations
15. **app_settings**: Global app settings
16. **sms_usage**: SMS sending logs
17. **phone_rate_limits**: Rate limiting for SMS

### Edge Functions
1. **admin-portal-data**: Fetch analytics for admin panel
2. **track-activity**: Log user activity
3. **ai-recommender**: Generate AI recommendations
4. **discover-date-spots**: Find and cache places
5. **event-discovery**: Scrape OKC events
6. **download-source**: Package and download codebase
7. **period-tracker-setup**: Initialize period tracking
8. **session-tracker**: Manage user sessions
9. **teefeeme-cartoonify**: AI image transformation using Lovable AI

## Visual Design

### Color Palette
- Primary: Pink to purple gradients (hsl values in index.css)
- Accent: Rose/purple combinations
- Background: Light/dark mode support
- Code Gate: Military green (#1a3d1a), tactical orange (#ff6b00)

### Components
- Floating hearts animation
- Gradient cards with backdrop blur
- Animated loading states
- Toast notifications (Sonner)
- Responsive mobile-first design
- Dark mode toggle in header

### Typography
- Headers: Bold, gradient text
- Body: Clean sans-serif
- Code elements: Monospace
- Icons: Lucide React

## Key User Flows

1. **New User**:
   - Enter code "crip" → Navigate to homepage → Browse places → Sign up to save favorites

2. **Tester**:
   - Enter code "crip" → Sign up with code "405" → Access Cupid AI, Cartoon Editor, Event Discovery

3. **Admin**:
   - Enter code "1309" → Redirected to admin panel → View realtime analytics, download source

4. **Couple**:
   - Create couple pairing → Share code with partner → Partner enters code → Access shared features

## Environment Variables
\`\`\`
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_PROJECT_ID
VITE_GOOGLE_MAPS_KEY
LOVABLE_API_KEY (auto-provided)
\`\`\`

## API Integrations
- **Google Maps**: Places API, Geocoding, Maps embed
- **Lovable AI**: google/gemini-2.5-flash for recommendations and image generation
- **Supabase**: Auth, Database, Edge Functions, Realtime

## Security Features
- Row Level Security (RLS) on all tables
- User-specific data access policies
- Admin role verification
- Code-based feature gating
- Session-based access control
- Rate limiting on SMS features

## Performance Optimizations
- Lazy loading for maps and heavy components
- Debounced search inputs
- Optimistic UI updates for favorites
- Image lazy loading
- Route-based code splitting
- Service worker for offline support

## Testing Access Codes
- App Access: "crip" (case-insensitive)
- Admin Panel: "1309"
- Tester Features: "405" (during signup)
- Period Tracker: "666"

## Deployment
- Platform: Lovable Cloud (auto-deployment)
- Build: Vite production build
- Database: Supabase (managed by Lovable Cloud)
- CDN: Auto-configured
- SSL: Auto-enabled

## File Structure
\`\`\`
src/
├── components/
│   ├── ui/ (shadcn components)
│   ├── admin/ (admin-specific)
│   ├── CodeGate.tsx (access control)
│   ├── AuthPanel.tsx (login/signup)
│   ├── Header.tsx (navigation)
│   ├── PlaceCard.tsx (place display)
│   └── ... (30+ components)
├── pages/
│   ├── Home.tsx
│   ├── AdminPanel.tsx
│   ├── CoupleMode.tsx
│   ├── Quizzes.tsx
│   └── ... (10+ pages)
├── hooks/
│   ├── useGeolocation.ts
│   ├── useGoogleMaps.ts
│   ├── usePlacesSearch.ts
│   └── useSessionTracker.ts
├── lib/
│   ├── supabase.ts (client)
│   ├── googleMaps.ts
│   ├── utils.ts
│   └── storage.ts
├── data/
│   ├── loveLanguageQuiz.ts
│   └── mbtiQuiz.ts
├── index.css (design system)
└── main.tsx
\`\`\`

## Implementation Notes
- All colors use HSL semantic tokens from index.css
- Never use direct color values in components
- Always use Lovable AI for AI features (don't ask for API keys)
- Realtime subscriptions for live data updates
- Mobile-first responsive design
- Accessibility: ARIA labels, focus states, keyboard navigation
- Error boundaries catch and display friendly errors
- Toast notifications for user feedback

## Future Enhancements (Planned)
- Photo galleries for places
- Advanced AI recommendations
- Social sharing features
- Calendar integration
- Push notifications
- More cartoon styles
- Event RSVP system

---
This blueprint provides everything needed to reconstruct the INPERSON.TLC app identically using AI tools like Claude, ChatGPT, or Lovable.`;

      const blob = new Blob([promptText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'INPERSON-TLC-AI-Prompt.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("📝 AI Prompt downloaded! Use this to rebuild the app with any AI tool.");
    } catch (error: any) {
      console.error("Download error:", error);
      toast.error(error.message || "Failed to download AI prompt");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  if (!codeUnlocked) {
    return (
      <Dialog open={showCodeDialog} onOpenChange={() => navigate('/')}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Admin Access Code Required</DialogTitle>
            <DialogDescription>
              Enter the access code to unlock the admin panel
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              type="password"
              placeholder="Enter code"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCodeSubmit()}
              className="text-center text-2xl tracking-widest"
              maxLength={4}
            />
            <Button onClick={handleCodeSubmit} className="w-full">
              Unlock
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Three main sections only
  const tabItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'management', label: 'Management', icon: Settings },
    { id: 'developer', label: 'Developer', icon: Code },
  ];

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.last_visit).length;
  const totalSessions = users.reduce((sum, u) => sum + (u.visit_count || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Admin Portal
                </h1>
                <p className="text-sm text-muted-foreground">
                  Logged in as {user?.email}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="gap-2">
              <Users className="h-3 w-3" />
              {totalUsers} Users
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            {tabItems.map((item) => {
              const Icon = item.icon;
              return (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="gap-2 text-lg py-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* App Readiness Checklist */}
            <AppReadinessChecklist />
            
            {/* Quick Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Total Users</span>
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
                <div className="text-3xl font-bold">{totalUsers}</div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Active Users</span>
                  <Users className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-3xl font-bold">{activeUsers}</div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Total Sessions</span>
                  <BarChart3 className="h-4 w-4 text-purple-500" />
                </div>
                <div className="text-3xl font-bold">{totalSessions}</div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Avg. Session</span>
                  <BarChart3 className="h-4 w-4 text-orange-500" />
                </div>
                <div className="text-3xl font-bold">
                  {totalUsers > 0 ? Math.round(totalSessions / totalUsers) : 0}
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-2">
                {users.slice(0, 10).map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{user.display_name || user.email}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.last_visit
                          ? `Last active: ${new Date(user.last_visit).toLocaleDateString()}`
                          : 'Never visited'}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {user.visit_count || 0} visits
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="management" className="space-y-6">
            {/* Command Station */}
            <CommandStation />
            
            {/* User Management */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">User List</h3>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{user.display_name || 'Anonymous'}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Joined: {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{user.visit_count || 0} visits</p>
                        <p className="text-xs text-muted-foreground">
                          {user.last_visit
                            ? `Last: ${new Date(user.last_visit).toLocaleDateString()}`
                            : 'Never visited'}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedUserId(user.id);
                          setProfileDialogOpen(true);
                        }}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
            {/* Analytics Dashboard */}
            <UserAnalyticsDashboard />
            
            {/* SMS Panel */}
            <SMSNotificationPanel />
            
            {/* Recent Updates */}
            <RecentUpdates />
          </TabsContent>

          <TabsContent value="developer" className="space-y-6">
            {/* AI Prompt Interface */}
            <AIPromptInterface />
            
            {/* WiFi Analyzer */}
            <WiFiAnalyzer />
            
            {/* Code Export & Tools */}
            <CodeExportSystem />
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Developer Tools</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="font-medium">Download Source Code</p>
                    <p className="text-sm text-muted-foreground">
                      Export the entire codebase as a ZIP file
                    </p>
                  </div>
                  <Button onClick={handleDownloadSource} className="gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="font-medium">Download AI Prompt</p>
                    <p className="text-sm text-muted-foreground">
                      Complete app blueprint for AI reconstruction
                    </p>
                  </div>
                  <Button onClick={handleDownloadAIPrompt} className="gap-2">
                    <Code className="h-4 w-4" />
                    Download
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="font-medium">Code Browser</p>
                    <p className="text-sm text-muted-foreground">
                      View and browse the codebase
                    </p>
                  </div>
                  <Button onClick={() => navigate('/code')} variant="outline" className="gap-2">
                    <Code className="h-4 w-4" />
                    Open Browser
                  </Button>
                </div>

                <div className="p-4 rounded-lg border border-border">
                  <h4 className="font-medium mb-4">File Upload Manager</h4>
                  <FileUploadManager />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* User Profile Viewer Dialog */}
      {selectedUserId && (
        <UserProfileViewer
          userId={selectedUserId}
          activities={allActivities}
          open={profileDialogOpen}
          onOpenChange={setProfileDialogOpen}
        />
      )}
    </div>
  );
};

export default AdminPanel;
