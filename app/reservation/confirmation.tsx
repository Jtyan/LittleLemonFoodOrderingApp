import Loading from "@/component/Loading";
import PageLayout from "@/component/PageLayout";
import PrimaryButton from "@/component/PrimaryButton";
import SecondaryButton from "@/component/SecondaryButton";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { capitaliseWord } from "@/utils/capitaliseWords";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router, useLocalSearchParams } from "expo-router";
import { Linking, Platform, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

const RESTAURANT_LOCATION = {
  latitude: 53.341560228677785,
  longitude: -6.259321767670715,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const ReservationConfirmation = () => {
  const {
    id: reservationId,
    selectedDate,
    selectedTimeSlot,
    numberOfGuests,
    selectedSeatingPreference,
    specialRequest,
    name,
    email,
    phoneNumber,
  } = useLocalSearchParams();
  const { profile, isLoading } = useGetUserProfile();

  if (isLoading) {
    return <Loading />;
  }

  const date = selectedDate.toString();
  return (
    <PageLayout>
      <Text
        style={[
          styles.title,
          { alignSelf: "center", marginTop: 0, marginBottom: 20 }]}>Reservation Confirmed!</Text>
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
              {capitaliseWord(selectedSeatingPreference.toString())} Seating
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
        <Text style={[styles.title, { paddingTop: 20 }]}>
          Your Contact Information
        </Text>
        <View>
          <Text style={[styles.text, styles.InfoText]}>Name: {name}</Text>
          <Text style={[styles.text, styles.InfoText]}>
            Phone Number: {phoneNumber}
          </Text>
          <Text style={[styles.text, styles.InfoText]}>Email: {email}</Text>
          <Text style={[styles.text, styles.InfoText]}>
            Special Request: {specialRequest ? specialRequest : "None"}
          </Text>
        </View>
      </View>
      {profile && (
        <View style={styles.buttonContainer}>
          <SecondaryButton
            name="Modify Reservation"
            onClick={() => router.push("/reservation/manage")}
          />
          <SecondaryButton
            name="Cancel Reservation"
            onClick={() => router.push("/home")}
          />
        </View>
      )}
      {!profile && (
      <View style={styles.container}>
        <Text style={styles.subtitle}>
          Sign up to manage your reservation easily.
        </Text>
        <PrimaryButton
          label="Sign up"
          onClick={() =>
            router.replace({
              pathname: "/signUp",
              params: {
                reservationId
              },
            })
          }
        />
      </View>
      )}
      <View>
        <Text style={styles.title}>Where we are:</Text>
        <MapView
          style={styles.map}
          initialRegion={RESTAURANT_LOCATION}
          provider={PROVIDER_GOOGLE}
        >
          <Marker
            coordinate={RESTAURANT_LOCATION}
            title="Little Lemon Restaurant"
            description="We're looking forward to seeing you!"
          />
        </MapView>
        <SecondaryButton
          name="Get Directions"
          onClick={() => {
            const url = Platform.select({
              ios: `maps://app?daddr=${RESTAURANT_LOCATION.latitude},${RESTAURANT_LOCATION.longitude}`,
              android: `google.navigation:q=${RESTAURANT_LOCATION.latitude},${RESTAURANT_LOCATION.longitude}`,
            });
            if (url) {
              Linking.openURL(url);
            }
          }}
        />
      </View>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    alignItems: 'center'
  },
  title: {
    fontFamily: "Karla-Bold",
    fontSize: 18,
    marginTop: 20,
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
  InfoText: {
    paddingVertical: 5,
  },
  subtitle: {
    fontFamily: "Karla-SemiBold",
    paddingTop: 10,
    color: "#474747ff",
    marginTop: 15,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 10,
    justifyContent: "space-around",
  },
  map: {
    width: "100%",
    height: 250,
    marginTop: 10,
    borderRadius: 8,
  },
});

export default ReservationConfirmation;
