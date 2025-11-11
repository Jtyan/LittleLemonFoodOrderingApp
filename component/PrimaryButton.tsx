import type { FC } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
  onClick: () => void;
  isDisabled?: boolean;
};

const PrimaryButton: FC<Props> = ({ label, onClick, isDisabled = false }) => {
  return (
    <>
      <View
        style={[
          styles.button,
          { backgroundColor: isDisabled ? "#8b8b8bff" : "#F4CE14" },
          { borderColor: isDisabled ? "#8b8b8bff" : "#F4CE14" },
        ]}
      >
        <Pressable onPress={onClick} disabled={isDisabled}>
          <Text style={[styles.buttonText, {color: isDisabled ? "#EDEFEE" : "#202020ff"}]}>{label}</Text>
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
    borderRadius: 8,
    alignItems: "center",
    padding: 10,
    paddingHorizontal: 30,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Karla-Regular",
    fontWeight: "600",

  },
});

export default PrimaryButton;
