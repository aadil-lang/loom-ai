/* eslint-disable @typescript-eslint/no-explicit-any */

// In a real app, this would fetch from a database.
// For now, we return static mock data representing the currently logged-in buyer.

export async function getBuyerProfile(): Promise<any> {
  return {
    id: "b1",
    name: "Acme Apparel Inc.",
    contactName: "Jane Doe",
    email: "procurement@acmeapparel.com",
    phone: "+1 (555) 019-2834",
    industry: "Fashion Retail",
    businessType: "Manufacturer",
    preferredCategories: ["Cotton", "Silk"],
    budgetRange: "$10k - $50k",
    typicalOrderQuantity: "1,000 - 5,000 meters"
  };
}

export async function getBuyerOrders(): Promise<any[]> {
  // We can reuse the mock order service, but filter for a specific buyer.
  // We'll dynamically import to avoid circular dependencies if any arise.
  const { getOrders } = await import('./order.service');
  const allOrders = await getOrders();
  // Return just a subset as a mock
  return allOrders.slice(0, 15);
}

export async function getSavedSuppliers(): Promise<any[]> {
  const { getSuppliers } = await import('./supplier.service');
  const allSuppliers = await getSuppliers();
  // Return first 3 as saved
  return allSuppliers.slice(0, 3);
}
