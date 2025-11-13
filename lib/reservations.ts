import { DatabaseReservation, Reservation } from "@/types/reservation";
import { supabase } from "./supabase";

export const TIME_SLOTS = [
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
];

const MAX_INDOOR_TABLES = 1;
const MAX_OUTDOOR_TABLES = 1;

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

type SeatingTimeSlots = {
  indoor: Record<string, boolean>;
  outdoor: Record<string, boolean>;
};

export const getTimeSlotAvailability = async (
  date: string
): Promise<SeatingTimeSlots> => {
  let indoorCount: Record<string, number> = {};
  let outdoorCount: Record<string, number> = {};
  let indoor: Record<string, boolean> = {};
  let outdoor: Record<string, boolean> = {};

  const { data, error } = await supabase
    .from("reservations")
    .select("reservation_time, seating_preference")
    .eq("reservation_date", date)
    .in("status", ["pending", "confirmed"]);
  if (error) {
    console.error("Error getting timeslots availability", error);
    return { indoor, outdoor };
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
    indoor[slot] = indoorBookings < MAX_INDOOR_TABLES;
    outdoor[slot] = outdoorBookings < MAX_OUTDOOR_TABLES;
  });

  return { indoor, outdoor };
};
