import { DatabaseReservation, Reservation } from "@/types/reservation";
import {
  getReservationsByDate
} from "./api";
import { MAX_INDOOR_TABLES, MAX_OUTDOOR_TABLES, TIME_SLOTS } from "./utils";

// transform DatabaseReservation to Reservation
export const TransformDbReservationToReservation = (
  data: DatabaseReservation
): Reservation => {
  return {
    id: data.id,
    userId: data.user_id,
    reservationDate: data.reservation_date,
    reservationTime: data.reservation_time,
    numberOfGuests: data.number_of_guests,
    seatingPreference: data.seating_preference,
    specialRequests: data.special_requests,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    guestName: data.guest_name,
    guestEmail: data.guest_email,
    guestPhone: data.guest_phone,
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

  const { data, error } = await getReservationsByDate(date);

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

  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const isToday = date === today;

  TIME_SLOTS.forEach((slot) => {
    const indoorBookings = indoorCount[slot] || 0;
    const outdoorBookings = outdoorCount[slot] || 0;

    let isSlotAvailable = true;
    if (isToday) {
      const [hours, minutes] = slot.split(":").map(Number);
      const slotTime = new Date();
      slotTime.setHours(hours, minutes, 0, 0);

      if (slotTime <= now) {
        isSlotAvailable = false;
      }
    }

    indoorAvailability[slot] =
      indoorBookings < MAX_INDOOR_TABLES && isSlotAvailable;
    outdoorAvailability[slot] =
      outdoorBookings < MAX_OUTDOOR_TABLES && isSlotAvailable;
  });

  return { indoorAvailability, outdoorAvailability };
};