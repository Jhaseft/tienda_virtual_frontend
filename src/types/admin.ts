export type AdminOrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface AdminOrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  size?: string | null;
  colorName?: string | null;
}

export interface AdminOrder {
  id: string;
  orderSeq: number;
  status: AdminOrderStatus;
  total: number;
  subtotal: number;
  shippingCost: number;
  deliveryAddress?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  paymentMethod: string;
  client: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    phoneNumber?: string | null;
    email?: string | null;
    avatarUrl?: string | null;
  };
  items: AdminOrderItem[];
}

export interface AdminCustomer {
  clientId: string;
  name: string;
  phoneNumber?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  totalOrders: number;
  totalSpent: number;
  lastOrderAt?: string | Date | null;
}

export type StockStatus = "OK" | "LOW" | "OUT";

export interface InventoryItem {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  imageUrl?: string | null;
  stockStatus: StockStatus;
  isAvailable: boolean;
  isVisible: boolean;
}

export interface AdminStats {
  period: "today" | "week" | "month" | "year";
  from: string;
  to: string;
  totalSales: number;
  totalOrders: number;
  newClients: number;
  averageTicket: number;
  topProducts: Array<{
    productId: string;
    name: string;
    quantity: number;
  }>;
}

export interface StorePaymentMethod {
  id: string;
  storeId: string;
  type: "QR" | "YAPE" | "TIGO_MONEY" | "EFECTIVO" | "TRANSFERENCIA";
  bankName?: string | null;
  accountHolder?: string | null;
  accountNumber?: string | null;
  qrImageUrl?: string | null;
  qrImagePublicId?: string | null;
}

export type SocialNetwork =
  | "FACEBOOK"
  | "INSTAGRAM"
  | "TIKTOK"
  | "YOUTUBE"
  | "TWITTER"
  | "WHATSAPP"
  | "WEBSITE"

export interface StoreSocialLink {
  id: string;
  network: SocialNetwork;
  url: string;
}

export interface StoreSettings {
  id: string;
  name: string;
  description?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  city?: string | null;
  logoUrl?: string | null;
  logoPublicId?: string | null;
  qrImageUrl?: string | null;
  qrImagePublicId?: string | null;
  owner: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    notificationsEnabled: boolean;
  };
  paymentMethods: StorePaymentMethod[];
  socialLinks: StoreSocialLink[];
}

export interface UpdateStoreSettingsPayload {
  name?: string;
  description?: string;
  whatsapp?: string;
  address?: string;
  city?: string;
  logoUrl?: string;
  logoPublicId?: string;
  notificationsEnabled?: boolean;
}

export interface UpdatePaymentMethodPayload {
  id?: string;
  type: StorePaymentMethod["type"];
  bankName?: string;
  accountHolder?: string;
  accountNumber?: string;
  qrImageUrl?: string;
  qrImagePublicId?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DashboardStats {
  ownerName: string | null;
  storeName: string | null;
  storeId: string;
  salesToday: { total: number; count: number };
  totalProducts: number;
  totalOrders: number;
  lowStockCount: number;
  totalCustomers: number;
}
