import { DatabaseReservation, SeatingPreference } from "@/types/reservation";
import { supabase } from "../supabase";

export const getReservationsByDate = async (date: string) => {
  const { data, error } = await supabase
    .from("reservations")
    .select("reservation_time, seating_preference")
    .eq("reservation_date", date)
    .in("status", ["pending", "confirmed"]);

  const transformedData = data?.map((reservation) => ({
    ...reservation,
    reservation_time: reservation.reservation_time.substring(0, 5),
  }));

  return { data: transformedData, error };
};

export const getReservationsByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("user_id", userId)
    .in("status", ["pending", "confirmed"]);

  const transformedData = data?.map((reservation) => ({
    ...reservation,
    reservation_time: reservation.reservation_time.substring(0, 5),
  }));

  return { data: transformedData, error };
};

export const getReservationsById = async (id: string) => {
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("id", id);

  const transformedData = data?.map((reservation) => ({
    ...reservation,
    reservation_time: reservation.reservation_time.substring(0, 5),
  }));

  return { data: transformedData, error };
};

export const createReservation = async (
  userId: string | null,
  reservationDate: string,
  reservationTime: string,
  numberOfGuests: number,
  seatingPreference: SeatingPreference,
  specialRequests: string | null,
  guestInfo?: { name: string; email: string; phone: string } | null
) => {
  const insertData: any = {
    reservation_date: reservationDate,
    reservation_time: reservationTime,
    number_of_guests: numberOfGuests,
    seating_preference: seatingPreference,
    special_requests: specialRequests,
    status: "pending",
  };

  if (userId) {
    insertData.user_id = userId;
  }

  if (guestInfo) {
    insertData.guest_name = guestInfo.name;
    insertData.guest_email = guestInfo.email;
    insertData.guest_phone = guestInfo.phone;
  }

  const { data, error } = await supabase
    .from("reservations")
    .insert(insertData)
    .select()
    .single();

  return { data, error };
};

export const linkReservationToUser = async (
  reservationId: number,
  userId: string
) => {
  const { data, error } = await supabase
    .from("reservations")
    .update({ user_id: userId })
    .eq("id", reservationId)
    .select()
    .single();

  if (error) {
    console.error("Error linking reservation to user: ", error);
  }

  return { data, error };
};
 export const updateReservation = async (
    reservationId: string,
    updates: Partial<Omit<DatabaseReservation, "id" | "created_at" | "updated_at">>
  ) => {
    const { data, error } = await supabase
      .from("reservations")
      .update(updates)
      .eq("id", reservationId)
      .select()
      .single();

    return { data, error };
  };