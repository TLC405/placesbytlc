import { createContext, useContext, useState, type ReactNode } from "react";
import { INTAKE_KEY, PROFILE_KEY, readProfile, type LocalProfile } from "@/lib/profile";

interface ProfileContextValue {
  profile: LocalProfile;
  needsIntake: boolean;
  editing: boolean;
  saveProfile: (profile: LocalProfile) => void;
  skipIntake: () => void;
  editProfile: () => void;
}
const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);
export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState(readProfile);
  const [needsIntake, setNeedsIntake] = useState(() => localStorage.getItem(INTAKE_KEY) !== "true");
  const [editing, setEditing] = useState(false);
  const finish = () => { localStorage.setItem(INTAKE_KEY, "true"); setNeedsIntake(false); setEditing(false); };
  const saveProfile = (next: LocalProfile) => { localStorage.setItem(PROFILE_KEY, JSON.stringify(next)); setProfile(next); finish(); };
  return <ProfileContext.Provider value={{ profile, needsIntake, editing, saveProfile, skipIntake: finish, editProfile: () => setEditing(true) }}>{children}</ProfileContext.Provider>;
}
export function useProfile() {
  const value = useContext(ProfileContext);
  if (!value) throw new Error("ProfileProvider is required");
  return value;
}