import * as React from 'react';
import { orderService } from '@/services';
import { OrdersClient } from '@/components/supplier/OrdersClient';

export default async function OrdersPage() {
  const supplierId = 's1'; 
  const orders = await orderService.getOrdersBySupplier(supplierId);

  return <OrdersClient initialOrders={orders} />;
}
