import { Pressable, StyleSheet, Text, View } from "react-native";

type TimeSlotProps = {
  time: string;
  isSelected: boolean;
  isAvailable: boolean;
  onPress: () => void;
};

const TimeSlot = ({
  time,
  isAvailable,
  isSelected,
  onPress,
}: TimeSlotProps) => {
  return (
    <Pressable onPress={onPress} disabled={!isAvailable}>
      <View
        style={[
          styles.container,
          !isAvailable && styles.timeSlotUnavailable,
          isSelected && styles.timeSlotSelected,
        ]}
      >
        <Text
          style={[
            styles.label,
            isSelected && { color: "#ffffff" },
            !isAvailable && { color: "#ffffff" },
          ]}
        >
          {time}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    width: 80,
    justifyContent: 'center',
    borderColor: "#8b8b8bff",
    marginVertical: 5,
    marginHorizontal: 10
  },
  timeSlotUnavailable: {
    backgroundColor: "#8b8b8bff",
    borderColor: "#8b8b8bff",
  },
  timeSlotSelected: {
    backgroundColor: "#495e57ff",
    borderColor: "#495e57ff",
  },
  label: {
    fontFamily: "Karla-SemiBold",
    color: "#474747ff",
    alignSelf: "center",
  },
});

export default TimeSlot;
