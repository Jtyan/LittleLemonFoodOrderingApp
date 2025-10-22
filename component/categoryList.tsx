import { Dispatch, SetStateAction } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

type CategoryListProps = {
  category: string[];
  selection: boolean[];
  setFilterSelection: Dispatch<SetStateAction<boolean[]>>;
};

const CategoryList = ({
  category,
  selection,
  setFilterSelection,
}: CategoryListProps) => {
    
  const handlePress = (index: number) => {
    const newSelection = selection.map((item, i) =>
      i === index ? !item : item
    );
    setFilterSelection(newSelection);
  };

  const renderItem = ({ item, index }: { item: string; index: number }) => {
    const isSelected = selection[index];
    return (
      <Pressable onPress={() => handlePress(index)}>
        <View
          style={[
            styles.itemContainer,
            isSelected ? styles.itemSelected : styles.itemIdle,
          ]}
        >
          <Text style={[styles.label, isSelected ? styles.labelSelected : styles.labelIdle]}>{item}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <FlatList
      style={styles.container}
      data={category}
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
    marginVertical: 10,
    marginEnd: 10,
    padding: 8,
  },
  itemIdle: {
    backgroundColor: "#495e5725",
  },
  itemSelected: {
    backgroundColor: "#495e57",
  },
  label: {
    fontFamily: "Karla-ExtraBold",
    fontSize: 16,
  },
  labelSelected: {
    color: "#EDEFEE"
  },
    labelIdle: {
    color: "#495e57"
  },
});

export default CategoryList;
