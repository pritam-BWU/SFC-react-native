import { MembershipPlanId, MembershipTypeId } from '../data/membershipData';

export type PaymentOrder = {
  id: number;
  receipt: string;
  gateway_order_id: string;
  subscription_plan: number;
  subscription_plan_name: string;
  provider_name: string;
  amount: string;
  currency: string;
  status: string;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CreatePaymentOrderRequest = {
  membership_type: MembershipTypeId;
  plan_id: MembershipPlanId;
  referral_code?: string;
};

export type CreatePaymentOrderResponse = {
  message: string;
  order: PaymentOrder;
  razorpay_key_id: string;
  amount_in_paise: number;
  gateway_order_id: string;
  receipt: string;
};

export type ConfirmPaymentRequest = {
  payment_order_id: number;
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  raw_payload?: Record<string, unknown>;
};

export type PaymentTransaction = {
  id: number;
  receipt: string;
  gateway_payment_id: string;
  amount: string;
  currency: string;
  status: string;
  payment_method: string;
  gateway_status: string;
  paid_at: string | null;
  created_at: string;
};

export type ConfirmPaymentResponse = {
  message: string;
  order: PaymentOrder;
  transaction: PaymentTransaction;
};
