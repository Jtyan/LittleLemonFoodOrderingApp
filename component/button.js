import { } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const Button = ({ name, onClick, isDisabled}) => {
  return (
    <>
      <View style={[styles.button , {backgroundColor: isDisabled ? '#8b8b8bff' : '#F4CE14'}, {borderColor: isDisabled ? '#8b8b8bff' : '#F4CE14'}]}>
        <Pressable onPress={onClick} disabled={isDisabled}>
          <Text style={styles.buttonText}>{name}</Text>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  button: {
    borderWidth: 1,
    borderRadius: 16,
    alignItems: "center",
    padding: 10,
    paddingHorizontal: 30,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Karla-Regular',
    fontWeight: '600'
  }
});

export default Button;
