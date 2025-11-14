import React from 'react';
import CustomerBookingModal from './CustomerBookingModal';

// Simple wrapper/alias for CustomerBookingModal
const BookingModal = (props) => {
  return <CustomerBookingModal {...props} />;
};

export default BookingModal;
