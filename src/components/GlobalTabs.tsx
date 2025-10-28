import { useState, useEffect, ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useUserRole } from '@/hooks/useUserRole';
import { trackEvent } from '@/utils/analytics';

export interface GlobalTab {
  id: string;
  label: string;
  icon: ReactNode;
  component: ReactNode;
  requiredResource?: string;
}

interface GlobalTabsProps {
  tabs: GlobalTab[];
}

export const GlobalTabs = ({ tabs }: GlobalTabsProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { role } = useUserRole();
  
  // Filter tabs based on role permissions - show all tabs for now
  const visibleTabs = tabs;
  
  const [activeTab, setActiveTab] = useState(
    searchParams.get('tab') || visibleTabs[0]?.id || ''
  );
  
  // Sync with URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && visibleTabs.find(t => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams, visibleTabs]);
  
  const handleTabChange = (tabId: string) => {
    const previousTab = activeTab;
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
    
    // Track analytics
    trackEvent('tab_switch', { 
      from: previousTab, 
      to: tabId,
      tab_name: tabId 
    });
  };
  
  // Keyboard navigation (Ctrl+1-9 for tabs)
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        const index = parseInt(e.key) - 1;
        if (visibleTabs[index]) {
          handleTabChange(visibleTabs[index].id);
        }
      }
    };
    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [visibleTabs, activeTab]);
  
  if (visibleTabs.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No tabs available for your role.
      </div>
    );
  }
  
  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
        {visibleTabs.map((tab, index) => (
          <TabsTrigger 
            key={tab.id} 
            value={tab.id} 
            className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            {tab.icon}
            <span>{tab.label}</span>
            {index < 9 && (
              <span className="text-xs text-muted-foreground ml-1">
                (Ctrl+{index + 1})
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {visibleTabs.map(tab => (
        <TabsContent key={tab.id} value={tab.id} className="mt-6">
          {tab.component}
        </TabsContent>
      ))}
    </Tabs>
  );
};
