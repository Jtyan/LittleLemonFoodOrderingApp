
export type SeatingPreference = "indoor" | "outdoor" | "no_preference" | null;

export type Status = "pending" | "confirmed" | "cancelled" | "completed";

export type DatabaseReservation = {
  id: number;
  user_id: string;
  reservation_date: string;
  reservation_time: string;
  number_of_guests: number;
  seating_preference: SeatingPreference;
  special_requests: string | null;
  status: Status;
  created_at: string;
  updated_at: string;
};

export type Reservation = {
  id: number;
  userId: string;
  reservationDate: string;
  reservationTime: string;
  numberOfGuests: number;
  seatingPreference: SeatingPreference;
  specialRequests: string | null;
  status: Status;
  createdAt: string;
  updatedAt: string;
};
