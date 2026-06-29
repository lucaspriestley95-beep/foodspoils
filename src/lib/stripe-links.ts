export const STRIPE_LINKS = {
  monthly: 'https://buy.stripe.com/aFa9AT2cT95sdI6eBLg7e0f',
  annual: 'https://buy.stripe.com/bJeaEXeZF0yW9UwgJTg7e0g',
};
export function openCheckout(plan: 'monthly' | 'annual') {
  window.open(STRIPE_LINKS[plan], '_blank');
}  
