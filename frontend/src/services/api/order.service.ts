/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getOrders(): Promise<any[]> {
  throw new Error("Not implemented");
}
export async function getOrdersBySupplier(supplierId: string): Promise<any[]> {
  throw new Error("Not implemented");
}
export async function getOrderById(id: string): Promise<any | null> {
  throw new Error("Not implemented");
}
export async function updateOrderStatus(id: string, status: string): Promise<boolean> {
  throw new Error("Not implemented");
}
