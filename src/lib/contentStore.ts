// Client-side content management with versioning
interface ContentVersion {
  version: number;
  timestamp: number;
  content: Record<string, any>;
}

const STORAGE_KEY = 'tlc_content_store';
const MAX_VERSIONS = 10;

export const contentStore = {
  // Get current content
  get: (): Record<string, any> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return {};
      
      const versions: ContentVersion[] = JSON.parse(stored);
      return versions.length > 0 ? versions[0].content : {};
    } catch (error) {
      console.error('Error reading content store:', error);
      return {};
    }
  },

  // Save content with versioning
  set: (content: Record<string, any>): void => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const versions: ContentVersion[] = stored ? JSON.parse(stored) : [];
      
      const newVersion: ContentVersion = {
        version: versions.length > 0 ? versions[0].version + 1 : 1,
        timestamp: Date.now(),
        content
      };
      
      versions.unshift(newVersion);
      
      // Keep only last MAX_VERSIONS
      const trimmed = versions.slice(0, MAX_VERSIONS);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch (error) {
      console.error('Error saving to content store:', error);
    }
  },

  // Get specific field
  getField: (key: string): any => {
    const content = contentStore.get();
    return content[key];
  },

  // Set specific field
  setField: (key: string, value: any): void => {
    const content = contentStore.get();
    content[key] = value;
    contentStore.set(content);
  },

  // Get version history
  getHistory: (): ContentVersion[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  // Restore specific version
  restore: (version: number): boolean => {
    try {
      const versions = contentStore.getHistory();
      const targetVersion = versions.find(v => v.version === version);
      
      if (!targetVersion) return false;
      
      contentStore.set(targetVersion.content);
      return true;
    } catch {
      return false;
    }
  },

  // Clear all content
  clear: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Export content as JSON
  export: (): string => {
    return JSON.stringify(contentStore.get(), null, 2);
  },

  // Import content from JSON
  import: (jsonString: string): boolean => {
    try {
      const content = JSON.parse(jsonString);
      contentStore.set(content);
      return true;
    } catch {
      return false;
    }
  }
};
