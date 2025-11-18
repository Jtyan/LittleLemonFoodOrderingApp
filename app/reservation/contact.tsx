import Loading from "@/component/Loading";
import PrimaryButton from "@/component/PrimaryButton";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { createReservation } from "@/lib/reservations/api";
import { SeatingPreference } from "@/types/reservation";
import { capitaliseWord } from "@/utils/capitaliseWords";
import { validateEmail, validatePhoneNumber } from "@/utils/isInputValid";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { MaskedTextInput } from "react-native-mask-text";

const ReservationContact = () => {
  const { profile, isLoading: getUserLoading } = useGetUserProfile();
  const [isLoading, setIsLoading] = useState(false);
  const {
    selectedDate,
    selectedSeatingPreference,
    selectedTimeSlot,
    numberOfGuests,
  } = useLocalSearchParams();

  const date = Array.isArray(selectedDate)
    ? selectedDate[0]
    : (selectedDate as string);
  const time = Array.isArray(selectedTimeSlot)
    ? selectedTimeSlot[0]
    : (selectedTimeSlot as string);
  const partyNum = parseInt(
    Array.isArray(numberOfGuests)
      ? numberOfGuests[0]
      : (numberOfGuests as string)
  );

  if (getUserLoading && !profile) {
    return <Loading />;
  }

  const handleSubmit = async ({
    name,
    email,
    phoneNumber,
    specialRequest,
  }: any) => {
    if (!profile && (!name || !email || !phoneNumber)) {
      Alert.alert("Required", "Please fill in your contact information");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Required", "Please enter a valid email address");
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert("Required", "Please enter a valid phone number");
      return;
    }

    if (isNaN(partyNum) || partyNum < 1 || partyNum > 9) {
      Alert.alert("Error", "Invalid number of guests");
      return;
    }
    const selectedDateTime = new Date(`${selectedDate}T${selectedTimeSlot}`);
    const now = new Date();

    if (selectedDateTime < now) {
      Alert.alert("Invalid Time", "Cannot book a time in the past");
      return;
    }
    try {
      setIsLoading(true);

      const guestInfo = {
        name,
        phone: phoneNumber,
        email,
      };

      const { data, error } = await createReservation(
        profile?.userId || null,
        date,
        time,
        partyNum,
        selectedSeatingPreference as SeatingPreference,
        specialRequest,
        guestInfo
      );

      setIsLoading(false);

      if (error) {
        throw new Error("Failed to confirm Reservation.", error);
      }

      router.replace({
        pathname: "/reservation/confirmation",
        params: {
          selectedDate,
          selectedTimeSlot,
          numberOfGuests,
          selectedSeatingPreference,
          specialRequest,
          name,
          email,
          phoneNumber,
        },
      });
    } catch (error) {
      Alert.alert("Error", "Failed to confirm reservation. Please try again.");
      console.error("Create reservation error:", error);
      return;
    }
  };

  return (
    <Formik
      initialValues={{
        name: profile ? `${profile?.firstName} ${profile?.lastName}` : "",
        phoneNumber: profile?.phoneNumber || "",
        email: profile?.email || "",
        specialRequest: "",
      }}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({
        setFieldValue,
        handleSubmit,
        values: { name, phoneNumber, email, specialRequest },
      }) => (
        <>
          <KeyboardAwareScrollView
            style={styles.background}
            contentContainerStyle={styles.scrollContent}
            enableOnAndroid={true}
            extraScrollHeight={50}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <ImageBackground
              source={require("@/assets/images/lemon-background.png")}
              resizeMode="center"
              style={styles.background}
            >
              <View style={styles.overlay}>
                <Text style={styles.title}>Reservation</Text>
                <View
                  style={[
                    styles.reservationInfoContainer,
                    { justifyContent: "space-between", paddingEnd: 20 },
                  ]}
                >
                  <View style={styles.reservationInfoContainer}>
                    <MaterialCommunityIcons
                      style={styles.icon}
                      name="silverware-fork-knife"
                      size={35}
                    />
                    <View>
                      <Text style={styles.text}>Party of {numberOfGuests}</Text>
                      <Text style={styles.text}>
                        {capitaliseWord(selectedSeatingPreference.toString())}{" "}
                        Seating
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Entypo style={styles.icon} name="calendar" size={35} />
                    <View>
                      <Text style={styles.text}>
                        {new Date(date).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                        })}
                      </Text>
                      <Text style={styles.text}>{selectedTimeSlot}</Text>
                    </View>
                  </View>
                </View>
                <View>
                  <Text style={styles.subtitle}>
                    Please fill in your contact info:{" "}
                  </Text>
                  <View style={styles.formContainer}>
                    <Text style={styles.textLabel}>*Name:</Text>
                    <TextInput
                      style={styles.textInput}
                      value={name}
                      onChangeText={(text) => setFieldValue("name", text)}
                    />
                  </View>
                  <View style={styles.formContainer}>
                    <Text style={styles.textLabel}>*Phone Number:</Text>
                    <MaskedTextInput
                      style={styles.textInput}
                      mask="+(999) 999-9999"
                      value={phoneNumber}
                      keyboardType="numeric"
                      onChangeText={(text, rawText) =>
                        setFieldValue("phoneNumber", rawText)
                      }
                    />
                  </View>
                  <View style={styles.formContainer}>
                    <Text style={styles.textLabel}>*Email:</Text>
                    <TextInput
                      style={styles.textInput}
                      value={email}
                      onChangeText={(text) => setFieldValue("email", text)}
                    />
                  </View>
                  <View style={styles.formContainer}>
                    <Text style={styles.textLabel}>
                      Special Request (optional):
                    </Text>
                    <TextInput
                      style={[styles.textInput, { height: 150 }]}
                      value={specialRequest}
                      multiline
                      scrollEnabled
                      textAlignVertical="top"
                      onChangeText={(text) =>
                        setFieldValue("specialRequest", text)
                      }
                    />
                  </View>
                </View>
                <View style={styles.buttonContainer}>
                  {isLoading ? (
                    <View style={{ justifyContent: "center" }}>
                      <Loading />
                    </View>
                  ) : (
                    <PrimaryButton
                      label="Confirm Reservation"
                      onClick={handleSubmit}
                      isDisabled={isLoading}
                    />
                  )}
                </View>
              </View>
            </ImageBackground>
          </KeyboardAwareScrollView>
        </>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  title: {
    fontFamily: "Karla-Bold",
    fontSize: 18,
    marginBottom: 10,
  },
  reservationInfoContainer: {
    flexDirection: "row",
  },
  icon: {
    alignSelf: "center",
    color: "#474747ff",
    marginEnd: 5,
  },
  text: {
    fontFamily: "Karla-SemiBold",
    color: "#474747ff",
  },
  subtitle: {
    fontFamily: "Karla-SemiBold",
    paddingTop: 10,
    color: "#474747ff",
    marginTop: 15,
    marginBottom: 5,
  },
  formContainer: {
    marginVertical: 10,
  },
  textLabel: {
    marginBottom: 5,
    fontFamily: "Karla-Regular",
  },
  textInput: {
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: "#8b8b8bff",
    fontFamily: "Karla-Regular",
    color: "#474747ff",
  },
  buttonContainer: {
    paddingVertical: 10,
  },
});

export default ReservationContact;
