declare module 'react-native-razorpay' {
  export type RazorpayOptions = {
    key: string;
    amount: number | string;
    currency?: string;
    name?: string;
    description?: string;
    image?: string;
    order_id?: string;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    notes?: Record<string, string>;
    theme?: {
      color?: string;
      hide_topbar?: boolean;
    };
    modal?: {
      backdropclose?: boolean;
      escape?: boolean;
      handleback?: boolean;
      confirm_close?: boolean;
      animation?: boolean;
    };
  };

  export type PaymentSuccessData = {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
    [key: string]: unknown;
  };

  export type PaymentErrorData = {
    code?: number;
    description?: string;
    reason?: string;
    metadata?: {
      order_id?: string;
      payment_id?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };

  export default class RazorpayCheckout {
    static open(options: RazorpayOptions): Promise<PaymentSuccessData>;
  }
}
