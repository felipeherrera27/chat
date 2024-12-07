import { apartments } from '../data/apartments';
import { QuickOption } from '../types';
import { useBookingStore } from '../store/bookingStore';
import { v4 as uuidv4 } from 'uuid';

const MAIN_MENU_OPTIONS: QuickOption[] = [
  { text: "Ver apartamentos", value: "1" },
  { text: "Consultar precios", value: "2" },
  { text: "Hacer reserva", value: "3" },
  { text: "Ver mis reservas", value: "4" },
  { text: "Hablar con asesor", value: "5" }
];

const BACK_OPTION: QuickOption = { text: "⬅️ Volver al menú principal", value: "menu" };

export const getInitialMessage = () => ({
  text: `Bienvenido al sistema de reservas de apartamentos. ¿Cómo puedo ayudarte?

1. Ver apartamentos disponibles
2. Consultar precios
3. Hacer reserva
4. Ver mis reservas
5. Hablar con asesor

Por favor, selecciona una opción para continuar.`,
  options: MAIN_MENU_OPTIONS
});

const getApartmentDetails = (id: number) => {
  const store = useBookingStore.getState();
  const apt = store.apartments.find(a => a.id === id);
  if (!apt) return null;
  
  const availabilityStatus = apt.available ? '✅ Disponible' : '❌ No disponible';
  
  return {
    text: `📍 ${apt.name}

💰 Precio: $${apt.price.toLocaleString()} COP por noche
📝 Descripción: ${apt.description}
🔑 Estado: ${availabilityStatus}

¿Qué deseas hacer?

${apt.available ? '1. Reservar este apartamento' : ''}
2. Ver otro apartamento
3. Volver al menú principal`,
    options: [
      ...(apt.available ? [{ text: "Reservar este apartamento", value: `reserve_${apt.id}` }] : []),
      { text: "Ver otros apartamentos", value: "1" },
      { text: "Volver al menú", value: "menu" }
    ]
  };
};

// Booking state interface
interface BookingState {
  apartmentId?: number;
  name?: string;
  email?: string;
  phone?: string;
  checkIn?: string;
  checkOut?: string;
}

// Global booking state
let currentBooking: BookingState = {};

const handleBookingStep = (aptId: number) => ({
  text: `Para reservar el apartamento, necesitamos algunos datos:

1. Nombre completo
2. Email
3. Teléfono
4. Fecha de entrada
5. Fecha de salida

Por favor, ingresa tu nombre completo para comenzar:`,
  options: [{ text: "Cancelar reserva", value: "menu" }],
  nextStep: `booking_name_${aptId}`
});

export const handleUserInput = (input: string, currentStep: string) => {
  const store = useBookingStore.getState();
  
  // Handle menu return from any step
  if (input.toLowerCase() === 'menu') {
    currentBooking = {}; // Clear booking state
    return {
      response: getInitialMessage(),
      nextStep: 'initial'
    };
  }

  // Handle booking steps
  if (currentStep.startsWith('booking_')) {
    const [step, ...params] = currentStep.split('_');
    
    if (currentStep.startsWith('booking_name_')) {
      const aptId = parseInt(params[1]);
      currentBooking = { apartmentId: aptId, name: input };
      return {
        response: {
          text: "Por favor, ingresa tu correo electrónico:",
          options: [{ text: "Cancelar reserva", value: "menu" }]
        },
        nextStep: `booking_email_${aptId}`
      };
    }
    
    if (currentStep.startsWith('booking_email_')) {
      const aptId = parseInt(params[1]);
      currentBooking.email = input;
      return {
        response: {
          text: "Por favor, ingresa tu número de teléfono:",
          options: [{ text: "Cancelar reserva", value: "menu" }]
        },
        nextStep: `booking_phone_${aptId}`
      };
    }
    
    if (currentStep.startsWith('booking_phone_')) {
      const aptId = parseInt(params[1]);
      currentBooking.phone = input;
      return {
        response: {
          text: "Por favor, ingresa la fecha de entrada (DD/MM/YYYY):",
          options: [{ text: "Cancelar reserva", value: "menu" }]
        },
        nextStep: `booking_checkin_${aptId}`
      };
    }
    
    if (currentStep.startsWith('booking_checkin_')) {
      const aptId = parseInt(params[1]);
      currentBooking.checkIn = input;
      return {
        response: {
          text: "Por favor, ingresa la fecha de salida (DD/MM/YYYY):",
          options: [{ text: "Cancelar reserva", value: "menu" }]
        },
        nextStep: `booking_checkout_${aptId}`
      };
    }
    
    if (currentStep.startsWith('booking_checkout_')) {
      const aptId = parseInt(params[1]);
      currentBooking.checkOut = input;
      
      // Create booking
      const apartment = store.apartments.find(a => a.id === aptId);
      if (!apartment) {
        return {
          response: {
            text: "Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.",
            options: [BACK_OPTION]
          },
          nextStep: 'initial'
        };
      }
      
      const booking = {
        id: uuidv4(),
        apartmentId: aptId,
        name: currentBooking.name!,
        email: currentBooking.email!,
        phone: currentBooking.phone!,
        checkIn: currentBooking.checkIn!,
        checkOut: currentBooking.checkOut!,
        totalPrice: apartment.price,
        timestamp: new Date()
      };
      
      store.addBooking(booking);
      currentBooking = {}; // Clear booking state
      
      return {
        response: {
          text: `¡Reserva confirmada! 

Detalles de la reserva:
🏢 ${apartment.name}
👤 ${booking.name}
📅 Check-in: ${booking.checkIn}
📅 Check-out: ${booking.checkOut}
💰 Total: $${booking.totalPrice.toLocaleString()} COP

Puedes ver los detalles de tu reserva y descargar la factura en la opción "Ver mis reservas" del menú principal.`,
          options: [BACK_OPTION]
        },
        nextStep: 'initial'
      };
    }
  }

  // Handle initial menu
  if (currentStep === 'initial') {
    switch (input) {
      case '1':
        return {
          response: {
            text: store.apartments.map((apt, index) => 
              `${index + 1}. ${apt.name} - ${apt.description} ${apt.available ? '✅' : '❌'}`
            ).join('\n\n') + '\n\nSelecciona un número para ver más detalles.',
            options: [
              ...store.apartments.map((apt, index) => ({
                text: `${index + 1}. ${apt.name} ${apt.available ? '✅' : '❌'}`,
                value: `${index + 1}`
              })),
              BACK_OPTION
            ]
          },
          nextStep: 'viewing_apartments'
        };
      case '2':
        return {
          response: {
            text: store.apartments.map((apt) => 
              `${apt.name}: $${apt.price.toLocaleString()} COP por noche ${apt.available ? '✅' : '❌'}`
            ).join('\n'),
            options: [BACK_OPTION]
          },
          nextStep: 'initial'
        };
      case '3':
        const availableApts = store.apartments.filter(apt => apt.available);
        return {
          response: {
            text: availableApts.length > 0 
              ? 'Selecciona el apartamento que deseas reservar:'
              : 'Lo sentimos, no hay apartamentos disponibles en este momento.',
            options: [
              ...availableApts.map((apt, index) => ({
                text: `${index + 1}. ${apt.name} - $${apt.price.toLocaleString()} COP`,
                value: `reserve_${apt.id}`
              })),
              BACK_OPTION
            ]
          },
          nextStep: 'booking'
        };
      case '4':
        const bookings = store.bookings;
        if (bookings.length === 0) {
          return {
            response: {
              text: 'No tienes reservas activas.',
              options: [BACK_OPTION]
            },
            nextStep: 'initial'
          };
        }
        return {
          response: {
            text: 'Tus reservas:\n\n' + bookings.map((booking, index) => {
              const apt = store.apartments.find(a => a.id === booking.apartmentId);
              return `${index + 1}. ${apt?.name} - ${booking.checkIn} al ${booking.checkOut}`;
            }).join('\n'),
            options: [
              ...bookings.map((booking, index) => ({
                text: `Ver reserva ${index + 1}`,
                value: `view_booking_${booking.id}`
              })),
              BACK_OPTION
            ]
          },
          nextStep: 'viewing_bookings'
        };
      case '5':
        return {
          response: {
            text: 'Un asesor se pondrá en contacto contigo pronto. Por favor, déjanos tu número de teléfono:',
            options: [BACK_OPTION]
          },
          nextStep: 'contact'
        };
      default:
        return {
          response: {
            text: 'Por favor, selecciona una opción válida (1-5)',
            options: MAIN_MENU_OPTIONS
          },
          nextStep: 'initial'
        };
    }
  }

  // Handle apartment viewing
  if (currentStep === 'viewing_apartments') {
    const aptIndex = parseInt(input) - 1;
    const apartment = store.apartments[aptIndex];
    
    if (apartment) {
      const details = getApartmentDetails(apartment.id);
      return {
        response: details || {
          text: 'Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.',
          options: [BACK_OPTION]
        },
        nextStep: `viewing_apartment_${apartment.id}`
      };
    }
  }

  // Handle apartment selection for booking
  if (currentStep === 'booking') {
    if (input.startsWith('reserve_')) {
      const aptId = parseInt(input.split('_')[1]);
      const apartment = store.apartments.find(a => a.id === aptId);
      
      if (apartment && apartment.available) {
        const bookingResponse = handleBookingStep(aptId);
        return {
          response: bookingResponse,
          nextStep: bookingResponse.nextStep
        };
      }
    }
  }

  // Handle viewing specific apartment
  if (currentStep.startsWith('viewing_apartment_')) {
    const aptId = parseInt(currentStep.split('_')[2]);
    
    if (input === '1') {
      const bookingResponse = handleBookingStep(aptId);
      return {
        response: bookingResponse,
        nextStep: bookingResponse.nextStep
      };
    } else if (input === '2') {
      return handleUserInput('1', 'initial');
    } else if (input === '3') {
      return handleUserInput('menu', 'initial');
    }
  }

  // Handle viewing specific booking
  if (currentStep === 'viewing_bookings' && input.startsWith('view_booking_')) {
    const bookingId = input.split('_')[2];
    const booking = store.getBooking(bookingId);
    const apartment = booking ? store.apartments.find(a => a.id === booking.apartmentId) : null;
    
    if (booking && apartment) {
      return {
        response: {
          text: `Detalles de la reserva:

🏢 ${apartment.name}
👤 ${booking.name}
📧 ${booking.email}
📱 ${booking.phone}
📅 Check-in: ${booking.checkIn}
📅 Check-out: ${booking.checkOut}
💰 Total: $${booking.totalPrice.toLocaleString()} COP`,
          options: [BACK_OPTION]
        },
        nextStep: 'initial'
      };
    }
  }

  return {
    response: {
      text: 'Lo siento, no entiendo. ¿Puedo ayudarte con algo más?',
      options: MAIN_MENU_OPTIONS
    },
    nextStep: 'initial'
  };
};