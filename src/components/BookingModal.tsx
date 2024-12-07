import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { BookingPDF } from './BookingPDF';
import { useBookingStore } from '../store/bookingStore';

interface BookingModalProps {
  bookingId: string;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ bookingId, onClose }) => {
  const { getBooking, apartments } = useBookingStore();
  const booking = getBooking(bookingId);
  
  if (!booking) return null;
  
  const apartment = apartments.find(apt => apt.id === booking.apartmentId);
  if (!apartment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Detalles de la Reserva</h2>
        
        <div className="space-y-4 mb-6">
          <div>
            <h3 className="font-semibold">Apartamento</h3>
            <p>{apartment.name}</p>
          </div>
          
          <div>
            <h3 className="font-semibold">Cliente</h3>
            <p>{booking.name}</p>
            <p>{booking.email}</p>
            <p>{booking.phone}</p>
          </div>
          
          <div>
            <h3 className="font-semibold">Fechas</h3>
            <p>Check-in: {new Date(booking.checkIn).toLocaleDateString()}</p>
            <p>Check-out: {new Date(booking.checkOut).toLocaleDateString()}</p>
          </div>
          
          <div>
            <h3 className="font-semibold">Total</h3>
            <p>${booking.totalPrice.toLocaleString()} COP</p>
          </div>
        </div>
        
        <div className="flex justify-end gap-4">
          <PDFDownloadLink
            document={<BookingPDF booking={booking} apartment={apartment} />}
            fileName={`reserva-${bookingId}.pdf`}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Descargar Factura
          </PDFDownloadLink>
          
          <button
            onClick={onClose}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};