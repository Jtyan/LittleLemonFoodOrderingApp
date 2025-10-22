import { Image, StyleSheet, Text, View } from "react-native";

type MenuItemProps = {
  name: string;
  price: string;
  description: string;
  image: string;
};

const MenuItem = ({ name, price, description, image }: MenuItemProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <Text style={styles.foodName}>{name}</Text>
        <Text style={styles.foodDescription} numberOfLines={2}>{description}</Text>
        <Text style={styles.foodPrice}>{price}</Text>
      </View>
      <Image style={styles.foodImage} source={{ uri: image }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  itemContainer: {
    flex: 1,
    marginEnd: 20
  },
  foodName: {
    fontSize: 18,
    fontFamily: "Karla-Bold",
  },
  foodDescription: {
    fontSize: 16,
    paddingVertical: 10,
    fontFamily: "Karla-Regular",
    color: "524F4F"
  },
  foodPrice: {
    fontSize: 18,
    fontFamily: "Karla-SemiBold",
    color: "#495E57"
  },
  foodImage: {
    width: 80,
    height: 80,
    resizeMode: "cover",
    alignSelf: "center",
    marginStart: 20
  },
});

export default MenuItem;
