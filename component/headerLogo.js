import { } from "react";
import { Image, StyleSheet } from "react-native";

const HeaderLogo = () => {
  return (
    <Image
      style={styles.image}
      source={require("../assets/images/Logo.png")}
      accessibilityLabel="app header logo"
    />
  );
};

const styles = StyleSheet.create({
  image: {
    height: 40,
    width: 185,
    resizeMode: 'contain'
  },
});

export default HeaderLogo;
