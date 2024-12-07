import { create } from 'zustand';
import { Booking, Apartment } from '../types';
import { apartments as initialApartments } from '../data/apartments';

interface BookingStore {
  apartments: Apartment[];
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  getBooking: (id: string) => Booking | undefined;
  updateApartmentAvailability: (apartmentId: number, available: boolean) => void;
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  apartments: initialApartments.map(apt => ({ ...apt, available: true })),
  bookings: [],
  addBooking: (booking) => {
    set((state) => ({
      bookings: [...state.bookings, booking],
    }));
    get().updateApartmentAvailability(booking.apartmentId, false);
  },
  getBooking: (id) => {
    return get().bookings.find(booking => booking.id === id);
  },
  updateApartmentAvailability: (apartmentId, available) => {
    set((state) => ({
      apartments: state.apartments.map(apt =>
        apt.id === apartmentId ? { ...apt, available } : apt
      ),
    }));
  },
}));