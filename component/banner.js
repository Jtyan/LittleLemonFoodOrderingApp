import { StyleSheet, Text, View } from "react-native";

const Banner = () => {
  return (
    <>
      <View style={styles.backgroundContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Little Lemon</Text>
          <Text style={styles.subtitle}>Chicago</Text>
          <Text style={styles.paragraph}>
            We are a family owned Mediterranean restaurant, focused on
            traditional recipes served with a modern twist.
          </Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    backgroundColor: "#495E57",
  },
  container: {
    margin: 20,
  },
  title: {
    fontSize: 80,
    lineHeight: 69,
    includeFontPadding: false,
    fontFamily: "MarkaziText-Regular",
    fontWeight: "500",
    color: "#F4CE14",
  },
  subtitle: {
    fontSize: 40,
    includeFontPadding: false,
    fontWeight: "500",
    alignSelf: "start",
    color: "#EDEFEE",
  },
  paragraph: {
    paddingTop: 10,
    width: 200,
    fontSize: 16,
    color: "#EDEFEE",
  },
});

export default Banner;
