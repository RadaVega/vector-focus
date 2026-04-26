import React from 'react';

interface PaymentFormProps {
  orderId?: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ orderId }) => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Payment Form</h2>
      <p>Order ID: {orderId || 'N/A'}</p>
      <p>Payment integration will be added soon.</p>
    </div>
  );
};

export default PaymentForm;
