import { getUserProfile } from "@/lib/auth/auth";
import { UserProfile } from "@/types/userProfile";
import { useCallback, useEffect, useState } from "react";

const useGetUserProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const userProfile = await getUserProfile();
      setProfile(userProfile);
    } catch (e) {
      console.error("Hook: Unable to get User Profile", e);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { isLoading, isError, profile, refetch };
};

export default useGetUserProfile;
