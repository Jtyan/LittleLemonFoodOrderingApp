import { FC, ReactNode } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";

type PageLayoutProps = {
  children: ReactNode;
};

const PageLayout: FC<PageLayoutProps> = ({ children }) => {
  return (
    <ImageBackground
      source={require("../assets/images/lemon-background.png")}
      resizeMode="center"
      style={styles.container}
    >
      <View style={styles.overlay}>{children}</View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "#edefeef8",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

export default PageLayout;
