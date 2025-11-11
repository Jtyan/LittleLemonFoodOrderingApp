import useGetUserProfile from "@/hooks/useGetUserProfile";
import { getInitials } from "@/utils/getInitials";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

const ProfileHeader = () => {
  const { profile } = useGetUserProfile()
  const {firstName, lastName, profilePhoto} = profile || {}
  
  if (profile && profilePhoto) {
    return (
      <Pressable onPress={() => router.navigate("/profile")}>
        <Image
          source={{ uri: profilePhoto }}
          style={{ width: 40, height: 40, borderRadius: 20 }}
        />
      </Pressable>
    );
  } else if (profile) {
    return (
      <Pressable onPress={() => router.navigate("/profile")}>
        <View style={styles.headerAvatarPlaceholder}>
          <Text style={styles.headerAvatarPlaceholderText}>
            {getInitials(firstName, lastName)}
          </Text>
        </View>
      </Pressable>
    );
  } else {
    return (
      <Pressable onPress={() => router.navigate("/signIn")}>
        <Image
          source={require("../assets/images/add-user.png")}
          style={{ width: 30, height: 30, tintColor: "#495E57" }}
          accessibilityLabel="Signup/Login"
        />
      </Pressable>
    );
  }
};

const styles = StyleSheet.create({
  headerAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: "#26abb4ff",
    alignItems: "center",
    justifyContent: "center",
  },
  headerAvatarPlaceholderText: {
    fontSize: 20,
    fontFamily: "Karla-Regular",
    color: "#EDEFEE",
  },
});

export default ProfileHeader
