"use client"

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef, DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Eye, Download } from 'lucide-react';

/* eslint-disable @typescript-eslint/no-explicit-any */

export function OrdersClient({ initialOrders }: { initialOrders: any[] }) {
  const router = useRouter();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: (item) => <div className="font-medium text-blue-600">{item.id}</div>
    },
    {
      accessorKey: "date",
      header: "Date",
      sortable: true,
      cell: (item) => new Date(item.date).toLocaleDateString()
    },
    {
      accessorKey: "buyerName",
      header: "Buyer",
      sortable: true,
      cell: (item) => <div className="font-medium">{item.buyerName}</div>
    },
    {
      accessorKey: "totalValue",
      header: "Total Value",
      sortable: true,
      cell: (item) => <div className="font-semibold">${item.totalValue.toLocaleString()}</div>
    },
    {
      accessorKey: "status",
      header: "Status",
      sortable: true,
      cell: (item) => <StatusBadge status={item.status} />
    },
    {
      accessorKey: "actions",
      header: "",
      cell: (item) => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); alert("Downloading invoice mock..."); }}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm" onClick={() => router.push(`/supplier/orders/${item.id}`)}>
            <Eye className="mr-2 h-4 w-4" /> View
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage and track your incoming purchase orders.</p>
        </div>
      </div>

      <DataTable 
        data={initialOrders} 
        columns={columns} 
        searchKey="buyerName" 
        searchPlaceholder="Search by buyer name..." 
        pageSize={12}
        onRowClick={(item) => router.push(`/supplier/orders/${item.id}`)}
      />
    </div>
  );
}
