import Loading from "@/component/Loading";
import PageLayout from "@/component/PageLayout";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { getReservationsByUserId } from "@/lib/reservations/api";
import { capitaliseWord } from "@/utils/capitaliseWords";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

const ReservationManage = () => {
  const [reservationDetails, setReservationDetails] = useState({
    id: 0,
    userId: null,
    guestName: null,
    guestEmail: null,
    guestPhone: null,
    reservationDate: "",
    reservationTime: "",
    numberOfGuests: 0,
    seatingPreference: "indoor",
    specialRequests: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const {
    profile,
    isLoading: isUserProfileLoading,
  } = useGetUserProfile();

  useEffect(() => {
    (async () => {
        if (profile) {
          const { data, error } = await getReservationsByUserId(
            profile.userId
          );
        console.log("Data: ", data)
          if (data) {
            setReservationDetails({
              id: data[0].id,
              userId: data[0].userId,
              guestName: data[0].guest_name,
              guestEmail: data[0].guest_email,
              guestPhone: data[0].guest_phone,
              reservationDate: data[0].reservation_date,
              reservationTime: data[0].reservation_time,
              numberOfGuests: data[0].number_of_guests,
              seatingPreference: data[0].seating_preference,
              specialRequests: data[0].special_requests,
            });
          }
          if (error) {
            Alert.alert("Erro","Failed to get reservation details by user id");
          }
        }
    })();
  }, [profile]);
  console.log("ReservationDetails: ", reservationDetails)

  if (isUserProfileLoading || !profile) {
    return <Loading />;
  }
  return (
    <PageLayout>
      <View>
        <Text style={styles.title}>Your Reservation</Text>
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
              <Text style={styles.text}>Party of {reservationDetails.numberOfGuests}</Text>
              <Text style={styles.text}>
                {capitaliseWord(reservationDetails.seatingPreference.toString())} Seating
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Entypo style={styles.icon} name="calendar" size={35} />
            <View>
              <Text style={styles.text}>
                {new Date(reservationDetails.reservationDate).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                })}
              </Text>
              <Text style={styles.text}>{reservationDetails.reservationTime}</Text>
            </View>
          </View>
        </View>
      </View>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
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
});

export default ReservationManage;
