import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Booking } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: 120,
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
  },
});

interface BookingPDFProps {
  booking: Booking;
  apartment: Apartment;
}

export const BookingPDF: React.FC<BookingPDFProps> = ({ booking, apartment }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Factura de Reserva</Text>
        <Text>Fecha: {format(booking.timestamp, 'PPP', { locale: es })}</Text>
      </View>

      <View style={styles.section}>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>Detalles del Cliente</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.value}>{booking.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{booking.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Teléfono:</Text>
          <Text style={styles.value}>{booking.phone}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>Detalles de la Reserva</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Apartamento:</Text>
          <Text style={styles.value}>{apartment.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Check-in:</Text>
          <Text style={styles.value}>{format(new Date(booking.checkIn), 'PPP', { locale: es })}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Check-out:</Text>
          <Text style={styles.value}>{format(new Date(booking.checkOut), 'PPP', { locale: es })}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>Resumen de Pago</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Precio por noche:</Text>
          <Text style={styles.value}>${apartment.price.toLocaleString()} COP</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total:</Text>
          <Text style={styles.value}>${booking.totalPrice.toLocaleString()} COP</Text>
        </View>
      </View>
    </Page>
  </Document>
);