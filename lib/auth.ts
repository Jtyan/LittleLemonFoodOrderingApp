import { supabase } from "./supabase";
import { DatabaseProfile, UserProfile } from "@/types/userProfile";

// Auth functions
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// Profile functions
export async function getUserProfile(): Promise<UserProfile | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  if (!data) return null;

  // Transform database profile to app profile (snake_case -> camelCase)
  const profile: UserProfile = {
    id: data.id,
    userId: data.user_id,
    firstName: data.first_name || "",
    lastName: data.last_name || "",
    profilePhoto: data.profile_photo,
    email: user.email || "",
    phoneNumber: data.phone_number || "",
    emailNotifications: data.email_notifications,
  };

  return profile;
}

export async function createProfile(
  userId: string,
  profileData: Partial<Omit<UserProfile, "id" | "userId" | "email">>
) {
  const dbProfile: Partial<DatabaseProfile> = {
    user_id: userId,
    first_name: profileData.firstName || "",
    last_name: profileData.lastName || "",
    profile_photo: profileData.profilePhoto || null,
    phone_number: profileData.phoneNumber || "",
    email_notifications: profileData.emailNotifications || {
      orderStatuses: false,
      passwordChanges: false,
      specialOffers: false,
      newsletter: false,
    },
  };

  const { data, error } = await supabase
    .from("profiles")
    .insert(dbProfile)
    .select()
    .single();

  return { data, error };
}

export async function updateProfile(
  profileData: Partial<Omit<UserProfile, "id" | "userId" | "email">>
) {
  const user = await getCurrentUser();
  if (!user) {
    return { data: null, error: new Error("No authenticated user") };
  }

  const dbProfile: Partial<DatabaseProfile> = {
    first_name: profileData.firstName,
    last_name: profileData.lastName,
    profile_photo: profileData.profilePhoto,
    phone_number: profileData.phoneNumber,
    email_notifications: profileData.emailNotifications,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("profiles")
    .update(dbProfile)
    .eq("user_id", user.id)
    .select()
    .single();

  return { data, error };
}

// Get current session
export async function getSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

// Listen to auth state changes
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback);
}