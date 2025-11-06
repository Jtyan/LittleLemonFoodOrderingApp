import { UserProfile } from "@/types/userProfile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";


const useGetUserProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const refetch = useCallback(async() => {
    setIsLoading(true)
    setIsError(false)
    try{
        const profile = await AsyncStorage.getItem("userProfile");
        if(profile) {
        setProfile(JSON.parse(profile) as UserProfile);
        } else {
            setProfile(null)
        }
      } catch (e) {
        console.error("Hook: Unable to get User Profile", e);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    refetch()
  }, [refetch]);

  return { isLoading, isError, profile, refetch};
};

export default useGetUserProfile;
