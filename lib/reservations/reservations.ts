import { DatabaseReservation, Reservation } from "@/types/reservation";
import { useGetReservationsByDate } from "./api";
import { MAX_INDOOR_TABLES, MAX_OUTDOOR_TABLES, TIME_SLOTS } from "./utils";

// transform DatabaseReservation to Reservation
export const TransformDbReservationToReservation = (
  data: DatabaseReservation
): Reservation => {
  return {
    id: data.id,
    userId: data.user_id,
    reservationDate: data.reservation_date || "",
    reservationTime: data.reservation_time || "",
    numberOfGuests: data.number_of_guests || 0,
    seatingPreference: data.seating_preference,
    specialRequests: data.special_requests || null,
    status: data.status || "pending",
    createdAt: data.created_at || "",
    updatedAt: data.updated_at || "",
    guest_name: data.guest_name || null,
    guest_email: data.guest_email || null,
    guest_phone: data.guest_phone || null,
  };
};

export const getVisibleTimeSlots = (selectedTime: string): string[] => {
  const selectedIndex = TIME_SLOTS.indexOf(selectedTime);
  let startIndex = selectedIndex - 2;
  let endIndex = selectedIndex + 4;

  if (startIndex < 0) {
    startIndex = 0;
    endIndex = Math.min(TIME_SLOTS.length, 6);
  }

  if (endIndex > TIME_SLOTS.length) {
    startIndex = Math.max(TIME_SLOTS.length - 6, 0);
    endIndex = TIME_SLOTS.length;
  }

  return TIME_SLOTS.slice(startIndex, endIndex);
};

type TimeBookingCount = Record<string, number>;
type TimeAvailability = Record<string, boolean>;

export type SeatingTimeSlots = {
  indoorAvailability: TimeAvailability;
  outdoorAvailability: TimeAvailability;
};

export const getTimeSlotAvailability = async (
  date: string
): Promise<SeatingTimeSlots> => {
  let indoorCount: TimeBookingCount = {};
  let outdoorCount: TimeBookingCount = {};
  let indoorAvailability: TimeAvailability = {};
  let outdoorAvailability: TimeAvailability = {};

  const { data, error } = await useGetReservationsByDate(date);

  if (error || !data) {
    console.error("Error getting reservations, ", error);
    return { indoorAvailability, outdoorAvailability };
  }

  data.forEach((reservation) => {
    const time = reservation.reservation_time;
    const seatingPreference = reservation.seating_preference;

    if (seatingPreference === "indoor") {
      indoorCount[time] = (indoorCount[time] || 0) + 1;
    } else if (seatingPreference === "outdoor") {
      outdoorCount[time] = (outdoorCount[time] || 0) + 1;
    }
  });

  TIME_SLOTS.forEach((slot) => {
    const indoorBookings = indoorCount[slot] || 0;
    const outdoorBookings = outdoorCount[slot] || 0;
    indoorAvailability[slot] = indoorBookings < MAX_INDOOR_TABLES;
    outdoorAvailability[slot] = outdoorBookings < MAX_OUTDOOR_TABLES;
  });

  return { indoorAvailability, outdoorAvailability };
};
