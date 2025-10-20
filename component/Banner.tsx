import { Image, StyleSheet, Text, View } from "react-native";

const Banner = () => {
  return (
    <>
      <View style={styles.backgroundContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Little Lemon</Text>
          <Text style={styles.subtitle}>Chicago</Text>
          <View style={styles.paragraphContainer}>
            <Text style={styles.paragraph}>
              We are a family owned Mediterranean restaurant, focused on
              traditional recipes served with a modern twist.
            </Text>
            <Image style={styles.image} source={require("../assets/images/Hero image.png")}/>
          </View>
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
    fontSize: 72,
    lineHeight: 69,
    includeFontPadding: false,
    fontFamily: "MarkaziText-SemiBold",
    color: "#F4CE14",
  },
  subtitle: {
    fontSize: 44,
    includeFontPadding: false,
    marginTop: -10,
    fontFamily: "MarkaziText-Medium",
    color: "#EDEFEE",
  },
  paragraphContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -30
  },
  paragraph: {
    paddingTop: 10,
    width: 220,
    fontFamily: "Karla-Regular",
    fontSize: 17,
    color: "#EDEFEE",
    alignSelf: 'flex-end'
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 10
  }
});

export default Banner;
