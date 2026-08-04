"use client"

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef, DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Eye, Download } from 'lucide-react';

/* eslint-disable @typescript-eslint/no-explicit-any */

export function BuyerOrdersClient({ initialOrders }: { initialOrders: any[] }) {
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
      accessorKey: "supplierId",
      header: "Supplier ID",
      sortable: true,
      cell: (item) => <div className="font-medium text-slate-600">{item.supplierId}</div>
    },
    {
      accessorKey: "totalValue",
      header: "Total Amount",
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
          <Button variant="secondary" size="sm" onClick={() => router.push(`/orders/${item.id}`)}>
            <Eye className="mr-2 h-4 w-4" /> View
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto p-4 md:p-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
        <p className="text-muted-foreground mt-1">Track and manage your purchase orders across all suppliers.</p>
      </div>

      <DataTable 
        data={initialOrders} 
        columns={columns} 
        searchKey="id" 
        searchPlaceholder="Search by Order ID..." 
        pageSize={12}
        onRowClick={(item) => router.push(`/orders/${item.id}`)}
      />
    </div>
  );
}
