import type { FC } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  name: string;
  onClick: () => void;
  isDisabled?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  fontColor?: string;
};

const SecondaryButton: FC<Props> = ({
  name,
  onClick,
  isDisabled = false,
  backgroundColor = "#495E57",
  borderColor = "#495E57",
  fontColor = "#EDEFEE",
}) => {
  return (
    <>
      <View
        style={[
          styles.button,
          { backgroundColor: isDisabled ? "#8b8b8bff" : backgroundColor },
          { borderColor: isDisabled ? "#8b8b8bff" : borderColor },
        ]}
      >
        <Pressable onPress={onClick} disabled={isDisabled}>
          <Text style={[styles.buttonText, { color: fontColor }]}>{name}</Text>
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
    borderRadius: 5,
    alignItems: "center",
    margin: 10,
    padding: 10,
    paddingHorizontal: 10,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Karla-Regular",
    fontWeight: "600",
  },
});

export default SecondaryButton;
