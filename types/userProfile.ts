export type UserProfile = {
  firstName: string;
  lastName: string;
  profilePhoto: string | null;
  email: string;
  phoneNumber: string;
  emailNotifications: {
    orderStatuses: boolean,
    passwordChanges: boolean,
    specialOffers: boolean,
    newsletter: boolean
  }
};