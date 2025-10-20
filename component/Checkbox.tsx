import { Checkbox } from "expo-checkbox";
import type { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
  isChecked: boolean;
  setChecked: () => void;
  isDisabled?: boolean;
};

const CheckBox: FC<Props> = ({ label, isChecked, setChecked, isDisabled }) => {
  return (
    <>
      <View style={styles.container}>
        <Checkbox style={styles.checkbox} value={isChecked}  onValueChange={setChecked}/>
        <Text style={styles.label}>{label}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkbox: {
   marginVertical: 5,
   marginEnd: 10
  },
  label: {
    fontFamily: 'Karla-Regular'
  },
});

export default CheckBox;
