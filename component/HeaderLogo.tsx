import { router } from "expo-router";
import { } from "react";
import { Image, Pressable, StyleSheet } from "react-native";

const HeaderLogo = () => {
  return (
    <Pressable onPress={() => router.dismissTo('/home')}>
      <Image
        style={styles.image}
        source={require("../assets/images/Logo.png")}
        accessibilityLabel="app header logo"
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 40,
    width: 185,
    resizeMode: "contain",
  },
});

export default HeaderLogo;
