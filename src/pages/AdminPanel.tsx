import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lock, Users, Activity, MapPin, Calendar, Eye, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserAnalytics {
  user_id: string;
  email: string;
  display_name: string | null;
  created_at: string;
  total_visits: number;
  last_visit: string;
  locations: string[];
  pages_visited: any[];
  places_viewed: any[];
  searches: any[];
}

export default function AdminPanel() {
  const [users, setUsers] = useState<UserAnalytics[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserAnalytics | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check admin authorization
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please log in first");
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase.rpc('has_role', { 
        _user_id: user.id, 
        _role: 'admin' 
      });
      
      if (error || !data) {
        toast.error("Access denied: Admin privileges required");
        setIsAuthorized(false);
        setLoading(false);
        return;
      }
      
      setIsAuthorized(true);
      setLoading(false);
      fetchUserAnalytics();
    };
    
    checkAuth();
  }, []);

  const fetchUserAnalytics = async () => {
    try {
      // Fetch all profiles with their activity logs
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch activity logs for all users
      const { data: activities, error: activitiesError } = await supabase
        .from("user_activity_log")
        .select("*")
        .order("timestamp", { ascending: false });

      if (activitiesError) throw activitiesError;

      // Aggregate data by user
      const userMap = new Map<string, UserAnalytics>();

      profiles?.forEach((profile) => {
        const userActivities = activities?.filter((a) => a.user_id === profile.id) || [];
        
        const pageVisits = userActivities.filter((a) => a.activity_type === "page_visit");
        const placeViews = userActivities.filter((a) => a.activity_type === "place_view");
        const searches = userActivities.filter((a) => a.activity_type === "search");
        
        // Extract unique locations from activity data
        const locations = new Set<string>();
        userActivities.forEach((activity) => {
          const data = activity.activity_data as any;
          if (data?.location) {
            locations.add(data.location);
          }
          if (data?.country) {
            locations.add(data.country);
          }
          if (data?.city) {
            locations.add(`${data.city}, ${data.country || ""}`);
          }
        });

        userMap.set(profile.id, {
          user_id: profile.id,
          email: profile.email || "No email",
          display_name: profile.display_name,
          created_at: profile.created_at,
          total_visits: pageVisits.length,
          last_visit: userActivities[0]?.timestamp || profile.created_at,
          locations: Array.from(locations),
          pages_visited: pageVisits.map((a) => a.activity_data),
          places_viewed: placeViews.map((a) => a.activity_data),
          searches: searches.map((a) => a.activity_data),
        });
      });

      setUsers(Array.from(userMap.values()));
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="text-center p-8">
        <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Access Denied</h3>
        <p className="text-muted-foreground">You need admin privileges to view this panel.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Total Visits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {users.reduce((sum, u) => sum + u.total_visits, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Places Viewed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {users.reduce((sum, u) => sum + u.places_viewed.length, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Searches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {users.reduce((sum, u) => sum + u.searches.length, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>Click a user to view detailed analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Visits</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Locations</TableHead>
                  </TableRow>
                </TableHeader>
                 <TableBody>
                   {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow
                        key={user.user_id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedUser(user)}
                      >
                        <TableCell className="font-medium">
                          {user.display_name || "Anonymous"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{user.total_visits}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(user.last_visit).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.locations.slice(0, 2).map((loc, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                <MapPin className="w-3 h-3 mr-1" />
                                {loc}
                              </Badge>
                            ))}
                            {user.locations.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{user.locations.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* User Details Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>User Details</CardTitle>
            <CardDescription>
              {selectedUser ? "Detailed activity breakdown" : "Select a user to view details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedUser ? (
              <ScrollArea className="h-[600px]">
                <div className="space-y-6">
                  {/* User Info */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">
                      {selectedUser.display_name || "Anonymous User"}
                    </h3>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(selectedUser.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <Tabs defaultValue="visits" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="visits">Visits</TabsTrigger>
                      <TabsTrigger value="places">Places</TabsTrigger>
                      <TabsTrigger value="searches">Searches</TabsTrigger>
                    </TabsList>

                    <TabsContent value="visits" className="space-y-3">
                      <div className="text-sm font-medium">
                        Total: {selectedUser.total_visits} visits
                      </div>
                      {selectedUser.pages_visited.map((page, i) => (
                        <Card key={i} className="p-3">
                          <div className="text-sm font-medium">{page.path || "/"}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(page.timestamp).toLocaleString()}
                          </div>
                        </Card>
                      ))}
                    </TabsContent>

                    <TabsContent value="places" className="space-y-3">
                      <div className="text-sm font-medium">
                        Total: {selectedUser.places_viewed.length} places viewed
                      </div>
                      {selectedUser.places_viewed.map((place, i) => (
                        <Card key={i} className="p-3">
                          <div className="text-sm font-medium">{place.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {place.types?.join(", ")}
                          </div>
                          {place.price_level && (
                            <Badge variant="outline" className="mt-1">
                              {"$".repeat(place.price_level)}
                            </Badge>
                          )}
                        </Card>
                      ))}
                    </TabsContent>

                    <TabsContent value="searches" className="space-y-3">
                      <div className="text-sm font-medium">
                        Total: {selectedUser.searches.length} searches
                      </div>
                      {selectedUser.searches.map((search, i) => (
                        <Card key={i} className="p-3">
                          <div className="text-sm font-medium">"{search.query}"</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(search.timestamp).toLocaleString()}
                          </div>
                          {search.filters && (
                            <div className="mt-1 text-xs">
                              Radius: {search.filters.radius}mi
                            </div>
                          )}
                        </Card>
                      ))}
                    </TabsContent>
                  </Tabs>

                  {/* Locations */}
                  {selectedUser.locations.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Locations
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedUser.locations.map((loc, i) => (
                          <Badge key={i} variant="secondary">
                            {loc}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            ) : (
              <div className="h-[600px] flex items-center justify-center text-muted-foreground">
                Select a user from the table
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
