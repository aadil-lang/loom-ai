"use client"

import * as React from 'react';
import Image from 'next/image';
import { ColumnDef, DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { MoreHorizontal, Edit, Eye, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

/* eslint-disable @typescript-eslint/no-explicit-any */

export function InventoryClient({ initialProducts }: { initialProducts: any[] }) {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "image",
      header: "Product",
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-md border">
            <Image 
              src={item.images[0] || "https://placehold.co/100"} 
              alt={item.name} 
              fill 
              className="object-cover" 
            />
          </div>
          <div>
            <div className="font-medium">{item.name}</div>
            <div className="text-xs text-muted-foreground">{item.sku}</div>
          </div>
        </div>
      )
    },
    {
      accessorKey: "pricePerMeter",
      header: "Price / m",
      sortable: true,
      cell: (item) => <div className="font-medium" suppressHydrationWarning>₹{item.pricePerMeter?.toLocaleString('en-IN') || 0}</div>
    },
    {
      accessorKey: "stock",
      header: "Stock (m)",
      sortable: true,
      cell: (item) => (
        <div className={item.stock < 100 ? "text-amber-600 font-medium" : ""}>
          {item.stock}
        </div>
      )
    },
    {
      accessorKey: "moq",
      header: "MOQ",
      sortable: true,
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
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", className: "h-8 w-8 p-0" })}>
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> View Details</DropdownMenuItem>
              <Link href={`/supplier/products/${item.id}/edit`}>
                <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit Product</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground mt-1">Manage your catalog, stock levels, and pricing.</p>
        </div>
        <Link href="/supplier/products/new">
          <Button className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      <DataTable 
        data={initialProducts} 
        columns={columns} 
        searchKey="name" 
        searchPlaceholder="Search products by name or SKU..." 
        pageSize={12}
      />
    </div>
  );
}
