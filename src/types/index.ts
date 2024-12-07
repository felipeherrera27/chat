export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  options?: QuickOption[];
}

export interface QuickOption {
  text: string;
  value: string;
}

export interface Apartment {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  available: boolean;
}

export interface Booking {
  id: string;
  apartmentId: number;
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  timestamp: Date;
}