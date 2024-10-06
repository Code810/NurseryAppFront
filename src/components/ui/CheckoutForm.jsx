import React from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import { getPaymentCheachkEndpoint } from '@/api';

const CheckoutForm = ({ amount, authToken, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
     
      const { data } = await axios.post(
        getPaymentCheachkEndpoint(), 
        {
          amount,
          currency: 'usd',
        },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const { clientSecret } = data;

      
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (paymentResult.error) {
        console.error(paymentResult.error.message);
        alert('Payment failed: ' + paymentResult.error.message);
      } else if (paymentResult.paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentResult.paymentIntent.id);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Failed to process payment');
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#a0aec0',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border p-4 rounded-md shadow-md">
        <h3 className="text-lg font-semibold mb-2">Ödəniş məbləği</h3>
        <p className="text-gray-700">Ümumi dəyər: ${amount.toFixed(2)}</p>
      </div>

      <div className="border p-4 rounded-md shadow-md">
        <label className="block mb-2 font-semibold">Kart məlumatları</label>
        <CardElement options={cardElementOptions} className="p-2 border rounded-md" />
      </div>

      <button
        type="submit"
        disabled={!stripe}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition-all"
      >
        Ödənişi tamamla
      </button>
    </form>
  );
};

export default CheckoutForm;
