import { SeatingPreference } from "@/types/reservation";
import { supabase } from "../supabase";

export const useGetReservationsByDate = async(date: string) => {
  const { data, error } = await supabase
    .from("reservations")
    .select("reservation_time, seating_preference")
    .eq("reservation_date", date)
    .in("status", ["pending", "confirmed"]);

    return {data, error}
};

export const createReservation = async (
  userId: string,
  reservationDate: string,
  reservationTime: string,
  numberOfGuests: number,
  seatingPreference: SeatingPreference,
  specialRequests: string
) => {
  const { data, error } = await supabase
    .from("reservations")
    .insert({
      user_id: userId,
      reservation_date: reservationDate,
      reservation_time: reservationTime,
      number_of_guests: numberOfGuests,
      seating_preference: seatingPreference,
      special_requests: specialRequests,
      status: "pending",
    })
    .select()
    .single();

  return { data, error };
};
