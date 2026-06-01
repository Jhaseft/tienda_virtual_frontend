import { apiRequest } from "./client";
import type {
  AdminCustomer,
  AdminOrder,
  AdminOrderStatus,
  AdminStats,
  DashboardStats,
  InventoryItem,
  PaginatedResponse,
  StoreSettings,
  UpdatePaymentMethodPayload,
  UpdateStoreSettingsPayload,
} from "@/types/admin";

type ApiParams = {
  token: string;
};

type OrderQueryParams = {
  status?: AdminOrderStatus;
  search?: string;
  page?: number;
  limit?: number;
};

type CustomerQueryParams = {
  search?: string;
  page?: number;
  limit?: number;
};

type InventoryQueryParams = {
  search?: string;
  page?: number;
  limit?: number;
};

export async function getAdminOrders(
  params: OrderQueryParams & ApiParams
): Promise<PaginatedResponse<AdminOrder>> {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.search) query.set("search", params.search);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const response = await apiRequest<PaginatedResponse<BackendOrder>>(
    `/orders/admin${query.toString() ? `?${query.toString()}` : ""}`,
    { token: params.token }
  );

  return {
    ...response,
    data: response.data.map(mapOrder),
  };
}

export async function getAdminOrderById(
  id: string,
  { token }: ApiParams
): Promise<AdminOrder> {
  const response = await apiRequest<BackendOrder>(`/orders/admin/${id}`, {
    token,
  });
  return mapOrder(response);
}

export async function updateAdminOrderStatus(
  id: string,
  status: AdminOrderStatus,
  { token }: ApiParams
): Promise<AdminOrder> {
  const response = await apiRequest<BackendOrder>(`/orders/admin/${id}/status`, {
    method: "PATCH",
    token,
    body: { status },
  });
  return mapOrder(response);
}

export async function getAdminCustomers(
  params: CustomerQueryParams & ApiParams
): Promise<PaginatedResponse<AdminCustomer>> {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  return apiRequest<PaginatedResponse<AdminCustomer>>(
    `/customers/admin${query.toString() ? `?${query.toString()}` : ""}`,
    { token: params.token }
  );
}

export async function getAdminInventory(
  params: InventoryQueryParams & ApiParams
): Promise<PaginatedResponse<InventoryItem>> {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  return apiRequest<PaginatedResponse<InventoryItem>>(
    `/products/admin/inventory${query.toString() ? `?${query.toString()}` : ""}`,
    { token: params.token }
  );
}

export async function updateProductStock(
  productId: string,
  stock: number,
  { token }: ApiParams
): Promise<InventoryItem> {
  const response = await apiRequest<BackendInventoryItem>(
    `/products/admin/${productId}/stock`,
    {
      method: "PATCH",
      token,
      body: { stock },
    }
  );
  return mapInventoryItem(response);
}

export async function getAdminStats(
  period: "today" | "week" | "month" | "year",
  { token }: ApiParams
): Promise<AdminStats> {
  return apiRequest<AdminStats>(`/stats/admin?period=${period}`, { token });
}

export async function getDashboardStats({ token }: ApiParams): Promise<DashboardStats> {
  return apiRequest<DashboardStats>("/stats/dashboard", { token });
}

export async function getStoreSettings({
  token,
}: ApiParams): Promise<StoreSettings> {
  return apiRequest<StoreSettings>("/stores/me", { token });
}

export async function updateStoreSettings(
  payload: UpdateStoreSettingsPayload,
  { token }: ApiParams
): Promise<StoreSettings> {
  return apiRequest<StoreSettings>("/stores/me", {
    method: "PATCH",
    token,
    body: payload,
  });
}

export async function updateStorePaymentMethod(
  payload: UpdatePaymentMethodPayload,
  { token }: ApiParams
) {
  return apiRequest("/stores/me/payment-method", {
    method: "PATCH",
    token,
    body: payload,
  });
}

export async function uploadStoreImage(
  file: File,
  type: "logo" | "qr",
  { token }: ApiParams
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  return apiRequest<{ type: "logo" | "qr"; url: string; publicId: string }>(
    "/uploads/store-image",
    {
      method: "POST",
      token,
      body: formData,
    }
  );
}

type BackendOrder = Omit<AdminOrder, "createdAt" | "updatedAt" | "items"> & {
  createdAt: string;
  updatedAt: string;
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    size?: string | null;
    colorName?: string | null;
    product: { id: string; name: string };
  }>;
};

type BackendInventoryItem = Omit<InventoryItem, "imageUrl"> & {
  photos?: Array<{ url: string }>;
  imageUrl?: string | null;
};

function mapOrder(order: BackendOrder): AdminOrder {
  return {
    ...order,
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      size: item.size,
      colorName: item.colorName,
    })),
  };
}

function mapInventoryItem(item: BackendInventoryItem): InventoryItem {
  return {
    ...item,
    imageUrl: item.imageUrl ?? item.photos?.[0]?.url ?? null,
  };
}
