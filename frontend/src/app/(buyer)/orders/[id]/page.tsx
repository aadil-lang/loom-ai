import * as React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, CheckCircle2, FileText, Download } from 'lucide-react';
import { orderService, productService } from '@/services';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const order = await orderService.getOrderById(params.id);
  
  if (!order) {
    notFound();
  }

  // Hydrate products for the order
  const hydratedProducts = await Promise.all(
    order.products.map(async (p: { productId: string; quantity: number } & Record<string, unknown>) => {
      const fullProduct = await productService.getProductById(p.productId);
      return { ...p, ...fullProduct };
    })
  );

  const timelineSteps = [
    { title: "Order Placed", date: order.date, icon: FileText, completed: true },
    { title: "Preparing", date: "Pending", icon: Package, completed: order.status === "Preparing" || order.status === "Ready for Dispatch" || order.status === "Completed" },
    { title: "Dispatched", date: "Pending", icon: Truck, completed: order.status === "Ready for Dispatch" || order.status === "Completed" },
    { title: "Delivered", date: "Pending", icon: CheckCircle2, completed: order.status === "Completed" },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4 md:p-8 w-full pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/orders">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">Order {order.id}</h1>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-muted-foreground mt-1">
              Placed on {new Date(order.date).toLocaleDateString()} with Supplier ID: {order.supplierId}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Invoice</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Items Ordered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {hydratedProducts.map((prod, idx) => (
                  <div key={idx} className="flex justify-between items-center py-4 border-b last:border-0 last:pb-0">
                    <div className="flex gap-4">
                      <div className="h-16 w-16 bg-slate-100 rounded-md overflow-hidden border">
                        <img src={prod.images?.[0] || "https://placehold.co/100"} alt="product" className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <Link href={`/product/${prod.id}`} className="font-semibold hover:underline text-blue-600">{prod.name}</Link>
                        <div className="text-sm text-muted-foreground">SKU: {prod.sku}</div>
                        <div className="text-sm mt-1">{prod.quantity} meters x ${prod.pricePerMeter}</div>
                      </div>
                    </div>
                    <div className="font-bold text-lg">
                      ${(prod.quantity * prod.pricePerMeter).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
              <CardDescription>Current progression of your order.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {timelineSteps.map((step, idx) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <step.icon className={`h-4 w-4 ${step.completed ? "text-blue-600" : "text-slate-300"}`} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-white shadow-sm">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className={`font-bold ${step.completed ? "text-slate-900" : "text-slate-400"}`}>{step.title}</div>
                        <time className={`text-xs font-medium ${step.completed ? "text-blue-600" : "text-slate-400"}`}>
                          {step.completed && step.date !== "Pending" ? new Date(step.date).toLocaleDateString() : step.date}
                        </time>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${order.totalValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping (Mock)</span>
                <span>$250.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Taxes</span>
                <span>$0.00</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${(order.totalValue + 250).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
