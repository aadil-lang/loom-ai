import * as React from 'react';
import { buyerService } from '@/services';
import { BuyerOrdersClient } from '@/components/buyer/BuyerOrdersClient';

export default async function OrdersPage() {
  const orders = await buyerService.getBuyerOrders();

  return <BuyerOrdersClient initialOrders={orders} />;
}
