import { apiRequest } from "./client";
import type {
  ShippingZone,
  CreateShippingZonePayload,
  UpdateShippingZonePayload,
} from "@/types/shippingZone";

type ApiParams = { token: string };

// Endpoint para gestionar las zonas de envío de la tienda. Permite obtener, crear, actualizar y eliminar zonas de envío asociadas a la tienda del usuario autenticado.
export function getShippingZones({ token }: ApiParams): Promise<ShippingZone[]> {
  return apiRequest<ShippingZone[]>("/stores/me/shipping-zones", {
    method: "GET",
    token,
  });
}

// endpoint para crear una nueva zona de envío. Requiere un objeto con la información de la zona a crear, incluyendo ciudad, tipo de transporte, costo de envío y rango de horas estimadas de entrega. Devuelve la zona de envío creada con su ID asignado.
export function createShippingZone(
  dto: CreateShippingZonePayload,
  { token }: ApiParams,
): Promise<ShippingZone> {
  return apiRequest<ShippingZone>("/stores/me/shipping-zones", {
    method: "POST",
    body: dto,
    token,
  });
}

// endpoint para actualizar una zona de envío existente. Requiere el ID de la zona a actualizar y un objeto con los campos a modificar. Devuelve la zona de envío actualizada.
export function updateShippingZone(
  id: string,
  dto: UpdateShippingZonePayload,
  { token }: ApiParams,
): Promise<ShippingZone> {
  return apiRequest<ShippingZone>(`/stores/me/shipping-zones/${id}`, {
    method: "PATCH",
    body: dto,
    token,
  });
}

// endpoint para eliminar una zona de envío existente. Requiere el ID de la zona a eliminar.
export function deleteShippingZone(
  id: string,
  { token }: ApiParams,
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/stores/me/shipping-zones/${id}`, {
    method: "DELETE",
    token,
  });
}
