import useGetUserProfile from "@/hooks/useGetUserProfile";
import { signOut } from "@/lib/auth/auth";
import { getInitials } from "@/utils/getInitials";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ProfileHeader = () => {
  const { profile } = useGetUserProfile();
  const { firstName, lastName, profilePhoto } = profile || {};
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLogout = async () => {
    setMenuVisible(false);
    try {
      const { error } = await signOut();
      if (error) {
        Alert.alert("Error", "Failed to log out. Please try again");
        console.error("Failed to log out", error);
      } else {
        Alert.alert("Success", "Logged out successfully.")
        router.replace("/home");
      }
    } catch (error) {
      console.error("Failed to log out", error);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  const handleMenuItemPress = (action: () => void) => {
    setMenuVisible(false);
    action();
  };

  const renderAvatar = () => {
    if (profilePhoto) {
      return <Image source={{ uri: profilePhoto }} style={styles.avatarImage} />;
    }
    return (
      <View style={styles.headerAvatarPlaceholder}>
        <Text style={styles.headerAvatarPlaceholderText}>
          {getInitials(firstName, lastName)}
        </Text>
      </View>
    );
  };

  if (profile) {
    return (
      <View>
        <Pressable onPress={() => setMenuVisible(true)}>
          {renderAvatar()}
        </Pressable>
        <Modal
          visible={menuVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setMenuVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setMenuVisible(false)}
          >
            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() =>
                  handleMenuItemPress(() => router.navigate("/reservation/manage"))
                }
              >
                <Text style={styles.menuItemText}>My reservations</Text>
              </TouchableOpacity>
              <View style={styles.menuDivider} />
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() =>
                  handleMenuItemPress(() => router.navigate("/profile"))
                }
              >
                <Text style={styles.menuItemText}>Profile settings</Text>
              </TouchableOpacity>
              <View style={styles.menuDivider} />
              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <Text style={[styles.menuItemText, styles.logoutText]}>
                  Log out
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      </View>
    );
  } else {
    return (
      <Pressable onPress={() => router.navigate("/signIn")}>
        <Image
          source={require("../assets/images/add-user.png")}
          style={styles.addUserIcon}
          accessibilityLabel="Signup/Login"
        />
      </Pressable>
    );
  }
};

const styles = StyleSheet.create({
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: "#495E57",
    alignItems: "center",
    justifyContent: "center",
  },
  headerAvatarPlaceholderText: {
    fontSize: 20,
    fontFamily: "Karla-Regular",
    color: "#EDEFEE",
  },
  addUserIcon: {
    width: 30,
    height: 30,
    tintColor: "#495E57",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 60,
    paddingRight: 10,
  },
  dropdownContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    minWidth: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: "Karla-Regular",
    color: "#495E57",
  },
  logoutText: {
    color: "#EE9972",
    fontFamily: "Karla-SemiBold",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#EDEFEE",
  },
});

export default ProfileHeader;
