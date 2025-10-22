import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

const categories = ["Starters", "Mains", "Desserts", "Drinks", "Specials"];

const renderItem = ({ item }: { item: string }) => {
  return (
    <Pressable>
      <View
        style={{
          alignItems: "center",
          borderRadius: 15,
          backgroundColor: "#495e5725",
          marginVertical: 10,
          marginEnd: 10,
          padding: 8,
        }}
      >
        <Text style={styles.label}>{item}</Text>
      </View>
    </Pressable>
  );
};

const CategoryList = () => {
  return (
    <FlatList
      style={styles.container}
      data={categories}
      horizontal
      keyExtractor={(item) => item}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {},
  itemContainer: {
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: "#495e5725",
    marginVertical: 10,
    marginEnd: 10,
    padding: 8,
  },
  label: {
    fontFamily: "Karla-ExtraBold",
    fontSize: 16,
    color: "#495e57",
  },
});

export default CategoryList;
