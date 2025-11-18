import PrimaryButton from "@/component/PrimaryButton";
import TimeSlot from "@/component/TimeSlot";
import {
  getTimeSlotAvailability,
  getVisibleTimeSlots,
  SeatingTimeSlots,
} from "@/lib/reservations/reservations";
import { SeatingPreference } from "@/types/reservation";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert, ImageBackground, StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const Reservation = () => {
  //"2" because dropdown values are strings
  const [numberOfGuests, setNumberOfGuests] = useState("2");
  // initialise inside useState otherwise it will run every render, which is not efficient.
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  // having two separate states for time, one for dropdown time and the other for timeslot time
  const [selectedTime, setSelectedTime] = useState("19:00");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedSeatingPreference, setSelectedSeatingPreference] = useState<
    "indoor" | "outdoor" | null
  >(null);
  const [slotAvailability, setSlotAvailability] = useState<SeatingTimeSlots>({
    indoorAvailability: {},
    outdoorAvailability: {},
  });
  const visibleSlots = getVisibleTimeSlots(selectedTime);

  useFocusEffect(
    useCallback(() => {
      const fetchAvailability = async () => {
        const availability = await getTimeSlotAvailability(selectedDate);
        setSlotAvailability(availability);
      };
      fetchAvailability();
      setSelectedTimeSlot(null);
    }, [selectedDate])
  );

  const handleTimeSlotPress = (
    time: string,
    seatingPref: SeatingPreference,
    isAvailable: boolean
  ) => {
    if (!isAvailable) return;

    setSelectedTimeSlot(time);
    setSelectedSeatingPreference(seatingPref);
  };

  // Generate next 7 days for date picker
  const getNextSevenDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split("T")[0];
      const label = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      days.push({ label, value: dateString });
    }
    return days;
  }, []);
  
  const handleContinue = () => {
    if (!selectedSeatingPreference || !selectedTimeSlot) {
      Alert.alert(
        "Selection Required",
        "Please select a time slot and seating preference before continuing."
      );
      return;
    }
    router.push({
      pathname: "/reservation/contact",
      params: {
        selectedDate,
        selectedTimeSlot,
        numberOfGuests,
        selectedSeatingPreference,
      },
    });
  };

  return (
    <ImageBackground
      source={require("@/assets/images/lemon-background.png")}
      resizeMode="center"
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Reservation</Text>
          <View style={styles.dropdownSection}>
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Party</Text>
              <Dropdown
                data={[
                  { label: "1", value: "1" },
                  { label: "2", value: "2" },
                  { label: "3", value: "3" },
                  { label: "4", value: "4" },
                  { label: "5", value: "5" },
                  { label: "6", value: "6" },
                  { label: "7", value: "7" },
                  { label: "8", value: "8" },
                  { label: "9", value: "9" },
                ]}
                value={numberOfGuests}
                onChange={(item) => setNumberOfGuests(item.value)}
                labelField="label"
                placeholder={numberOfGuests}
                valueField="value"
                style={styles.dropdownBox}
                placeholderStyle={styles.dropdown}
                itemTextStyle={styles.dropdown}
                selectedTextStyle={styles.dropdown}
              />
            </View>
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Date</Text>
              <Dropdown
                data={getNextSevenDays}
                value={selectedDate}
                onChange={(item) => setSelectedDate(item.value)}
                labelField="label"
                placeholder={new Date(selectedDate).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                  }
                )}
                valueField="value"
                style={[styles.dropdownBox, { width: 110 }]}
                placeholderStyle={styles.dropdown}
                itemTextStyle={styles.dropdown}
                selectedTextStyle={styles.dropdown}
              />
            </View>
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Time</Text>
              <Dropdown
                data={[
                  { label: "17:00", value: "17:00" },
                  { label: "17:30", value: "17:30" },
                  { label: "18:00", value: "18:00" },
                  { label: "18:30", value: "18:30" },
                  { label: "19:00", value: "19:00" },
                  { label: "19:30", value: "19:30" },
                  { label: "20:00", value: "20:00" },
                  { label: "20:30", value: "20:30" },
                  { label: "21:00", value: "21:00" },
                ]}
                value={selectedTime}
                onChange={(item) => setSelectedTime(item.value)}
                labelField="label"
                placeholder={selectedTime}
                valueField="value"
                style={[styles.dropdownBox, { width: 85 }]}
                placeholderStyle={styles.dropdown}
                itemTextStyle={styles.dropdown}
                selectedTextStyle={styles.dropdown}
              />
            </View>
          </View>
          <View>
            <Text style={styles.subtitle}>Please choose a time below:</Text>
            <View>
              <Text style={styles.seatingLabel}>INDOOR SEATING</Text>
            </View>
            <View style={styles.seatingContainer}>
              {visibleSlots.map((slot) => {
                const isAvailable =
                  slotAvailability.indoorAvailability[slot] ?? true;
                const isSelected =
                  selectedTimeSlot === slot &&
                  selectedSeatingPreference === "indoor";

                return (
                  <TimeSlot
                    key={`indoor-${slot}`}
                    time={slot}
                    isAvailable={isAvailable}
                    isSelected={isSelected}
                    onPress={() =>
                      handleTimeSlotPress(slot, "indoor", isAvailable)
                    }
                  />
                );
              })}
            </View>
            <View>
              <Text style={styles.seatingLabel}>OUTDOOR SEATING</Text>
              <View style={styles.seatingContainer}>
                {visibleSlots.map((slot) => {
                  const isAvailable =
                    slotAvailability.outdoorAvailability[slot] ?? true;
                  const isSelected =
                    selectedTimeSlot === slot &&
                    selectedSeatingPreference === "outdoor";

                  return (
                    <TimeSlot
                      key={`outdoor-${slot}`}
                      time={slot}
                      isAvailable={isAvailable}
                      isSelected={isSelected}
                      onPress={() =>
                        handleTimeSlotPress(slot, "outdoor", isAvailable)
                      }
                    />
                  );
                })}
              </View>
            </View>
          </View>
          <View style={{ marginVertical: 20 }}>
            <View style={styles.infoContainer}>
              <View style={[styles.infoBox]}></View>
              <Text style={styles.infoLabel}>Available</Text>
            </View>
            <View style={styles.infoContainer}>
              <View
                style={[styles.infoBox, { backgroundColor: "#8b8b8bff" }]}
              ></View>
              <Text style={styles.infoLabel}>Unavailable</Text>
            </View>
            <Text style={[styles.subtitle, { fontSize: 13 }]}>
              Group booking (10+ pax) please call us directly for arrangement
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <PrimaryButton label={"Continue"} onClick={handleContinue} />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "#edefeef8",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontFamily: "Karla-Bold",
    fontSize: 18,
    marginBottom: 10,
  },
  dropdownSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  dropdownContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    paddingVertical: 10,
  },
  dropdownBox: {
    width: 60,
    height: 40,
    borderColor: "#8b8b8bff",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  dropdownLabel: {
    fontFamily: "Karla-SemiBold",
    paddingBottom: 5,
    color: "#474747ff",
  },
  dropdown: {
    justifyContent: "center",
    fontFamily: "Karla-SemiBold",
    color: "#474747ff",
    fontSize: 14,
  },
  subtitle: {
    fontFamily: "Karla-SemiBold",
    paddingTop: 10,
    color: "#474747ff",
    marginTop: 15,
    marginBottom: 5,
  },
  seatingContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  seatingLabel: {
    fontFamily: "Karla-Bold",
    fontSize: 18,
    color: "#474747ff",
    paddingVertical: 10,
  },
  timeSlot: {
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRadius: 5,
  },
  timeSlotLabel: {
    fontFamily: "Karla-SemiBold",
  },
  infoContainer: {
    flexDirection: "row",
    marginVertical: 5,
  },
  infoBox: {
    borderWidth: 1,
    borderRadius: 5,
    height: 30,
    width: 60,
    borderColor: "#8b8b8bff",
  },
  infoLabel: {
    fontFamily: "Karla-SemiBold",
    color: "#474747ff",
    paddingHorizontal: 10,
    alignSelf: "center",
  },
  buttonContainer: {
    paddingVertical: 10,
  },
});

export default Reservation;
