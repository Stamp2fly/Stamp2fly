const normalizeCard = (cardNumber) => String(cardNumber || '').replace(/\s+/g, '');

const maskCard = (cardNumber) => {
  const clean = normalizeCard(cardNumber);
  if (clean.length < 4) {
    return '****';
  }
  return `**** **** **** ${clean.slice(-4)}`;
};

// Adapter-like interface so real providers (Stripe/Razorpay/etc.) can replace dummy logic later.
export const processPayment = async ({ amount, currency, cardNumber, cardHolderName, provider = 'dummy' }) => {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const cleanCard = normalizeCard(cardNumber);

  if (!cleanCard || cleanCard.length < 12) {
    return {
      success: false,
      error: 'Invalid card number',
    };
  }

  return {
    success: true,
    provider,
    transactionId: `DUMMY-${Date.now()}`,
    amount: Number(amount) || 0,
    currency,
    cardLast4: cleanCard.slice(-4),
    cardMasked: maskCard(cleanCard),
    cardHolderName: cardHolderName || '',
    paidAt: new Date().toISOString(),
    status: 'captured',
  };
};
