import { apiRequest } from "./client";

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type SubscriptionStatus =
  | "ACTIVE"
  | "TRIAL"
  | "TRIAL_EXPIRED"
  | "PENDING_PAYMENT";

export interface PlanDetail {
  id: string;
  name: string;
  price: number;
  priceBob: number;
  priceUsd: number;
}

export interface MySubscription {
  status: SubscriptionStatus;
  daysLeft: number;
  endDate?: string;
  trialEndsAt?: string;
  productsUsed: number;
  productsLimit: number;
  canCreateProducts: boolean;
  canAddPaymentMethods: boolean;
  hasAiAgent: boolean;
  hasAdvancedPayments: boolean;
  plan: PlanDetail | null;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  priceBob: number;
  priceUsd: number;
  maxProducts: number;
  description: string;
  canAddPaymentMethods: boolean;
  hasAiAgent: boolean;
  hasAdvancedPayments: boolean;
  sortOrder: number;
}

export interface QrPaymentInit {
  paymentId: string;
  qrId: string;
  qrImage: string | null;
  amount: number;
  currency: string;
  dueDate: string;
}

export interface QrPaymentStatus {
  paymentId: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
}

export interface StripePaymentInit {
  paymentId: string;
  clientSecret: string;
  customerId: string;
  amount: number;
  currency: string;
  planName: string;
}

// ── Funciones ─────────────────────────────────────────────────────────────────

export function getPlans(): Promise<Plan[]> {
  return apiRequest<Plan[]>("/plans");
}

export function getMySubscription(token: string): Promise<MySubscription> {
  return apiRequest<MySubscription>("/subscriptions/my", { token });
}

export function initQrPayment(
  token: string,
  planId: string
): Promise<QrPaymentInit> {
  return apiRequest<QrPaymentInit>("/subscriptions/qr/init", {
    method: "POST",
    token,
    body: { planId },
  });
}

export function getQrPaymentStatus(
  token: string,
  paymentId: string
): Promise<QrPaymentStatus> {
  return apiRequest<QrPaymentStatus>(`/subscriptions/qr/status/${paymentId}`, {
    token,
  });
}

export function initStripePayment(
  token: string,
  planId: string
): Promise<StripePaymentInit> {
  return apiRequest<StripePaymentInit>("/stripe/subscription/init", {
    method: "POST",
    token,
    body: { planId },
  });
}
