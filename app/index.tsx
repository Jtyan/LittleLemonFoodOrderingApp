import useGetUserProfile from "@/hooks/useGetUserProfile";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

const Index = () => {
  const { isLoading, isError, profile } = useGetUserProfile();

  useEffect(() => {
    if (isLoading || isError) return
    if (profile) {
      router.replace("/home");
    } else {
      router.replace("/onboarding");
    }
  }, [isLoading, isError, profile]);

  console.log(isLoading, isError, profile);
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View>
        <Text>Oops, something went wrong!</Text>
        <Pressable onPress={() => router.replace("/")}>
          <Text>Refresh</Text>
        </Pressable>
      </View>
    );
  }
  return null;
};

export default Index;
