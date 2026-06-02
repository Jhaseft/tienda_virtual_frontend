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

export interface CreateProductPayload {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId?: string;
  isVisible?: boolean;
  isAvailable?: boolean;
}

export interface ProductOptionPayload {
  sizes?: { size: string }[];
  colors?: { name: string; hexCode?: string }[];
}

export interface ProductPhoto {
  id: string;
  url: string;
  publicId: string;
  order: number;
}

export interface UpdateProductPayload {
  name?: string
  description?: string
  price?: number
  stock?: number
  categoryId?: string | null
  isVisible?: boolean
  isAvailable?: boolean
}

export async function updateProduct(
  productId: string,
  payload: UpdateProductPayload,
  { token }: ApiParams
) {
  return apiRequest<Awaited<ReturnType<typeof getAdminProductById>>>(
    `/products/admin/${productId}`,
    { method: "PATCH", token, body: payload }
  )
}

export async function getAdminProductById(
  productId: string,
  { token }: ApiParams
) {
  return apiRequest<{
    id: string
    name: string
    description: string | null
    price: number
    stock: number
    isAvailable: boolean
    isVisible: boolean
    photos: { id: string; url: string; order: number }[]
    sizes: { id: string; size: string; stock: number }[]
    colors: { id: string; name: string; hexCode: string | null; stock: number }[]
    category: { id: string; name: string } | null
    store: { id: string; name: string; logoUrl: string | null; whatsapp: string | null; city: string | null }
  }>(`/products/admin/${productId}`, { token })
}

export async function deleteProduct(
  productId: string,
  { token }: ApiParams
): Promise<void> {
  await apiRequest(`/products/admin/${productId}`, { method: "DELETE", token })
}

export async function createProduct(
  payload: CreateProductPayload,
  { token }: ApiParams
): Promise<InventoryItem> {
  const response = await apiRequest<BackendInventoryItem>("/products/admin", {
    method: "POST",
    token,
    body: payload,
  });
  return mapInventoryItem(response);
}

export async function setProductOptions(
  productId: string,
  payload: ProductOptionPayload,
  { token }: ApiParams
): Promise<void> {
  await apiRequest(`/products/admin/${productId}/options`, {
    method: "POST",
    token,
    body: payload,
  });
}

export async function uploadProductPhoto(
  file: File,
  productId: string,
  { token }: ApiParams
): Promise<ProductPhoto> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("productId", productId);
  return apiRequest<ProductPhoto>("/uploads/product-photo", {
    method: "POST",
    token,
    body: formData,
  });
}

export async function deleteProductPhoto(
  photoId: string,
  { token }: ApiParams
): Promise<void> {
  await apiRequest(`/uploads/product-photo/${photoId}`, {
    method: "DELETE",
    token,
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
