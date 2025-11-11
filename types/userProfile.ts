// Database profile type (matches Supabase table)
export type DatabaseProfile = {
  id: number;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  profile_photo: string | null;
  phone_number: string | null;
  email_notifications: {
    orderStatuses: boolean;
    passwordChanges: boolean;
    specialOffers: boolean;
    newsletter: boolean;
  };
  created_at: string;
  updated_at: string;
};

// App-level profile type (camelCase for use in components)
export type UserProfile = {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  profilePhoto: string | null;
  email: string;
  phoneNumber: string;
  emailNotifications: {
    orderStatuses: boolean;
    passwordChanges: boolean;
    specialOffers: boolean;
    newsletter: boolean;
  };
};