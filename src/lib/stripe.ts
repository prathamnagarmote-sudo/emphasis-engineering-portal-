import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_4eC39HqLyjWDarjtT1zdp7dc', {
  apiVersion: '2024-12-18.acacia' as any,
  appInfo: {
    name: 'Emphasis Engineering Portal',
    version: '0.1.0',
  },
});
