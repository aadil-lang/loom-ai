"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ImageUploader } from "./ImageUploader"
import { ArrowLeft, Save } from "lucide-react"

/* eslint-disable @typescript-eslint/no-explicit-any */

const productSchema = z.object({
  name: z.string().min(5, "Product name must be at least 5 characters"),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  categoryId: z.string().min(1, "Category is required"),
  pricePerMeter: z.coerce.number().min(0.01, "Price must be greater than 0"),
  moq: z.coerce.number().min(1, "MOQ must be at least 1"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  gsm: z.coerce.number().min(10, "GSM must be valid"),
  width: z.string().min(1, "Width is required"),
  composition: z.string().min(3, "Composition is required"),
  description: z.string().min(10, "Description is required"),
  images: z.array(z.string()).min(1, "At least one image is required")
})

type ProductFormValues = z.infer<typeof productSchema>

interface ProductFormProps {
  initialData?: any
  categories: any[]
  mode?: "create" | "edit" | "read"
}

export function ProductForm({ initialData, categories, mode = "create" }: ProductFormProps) {
  const router = useRouter()
  const isReadOnly = mode === "read"

  const defaultValues: ProductFormValues = {
    name: initialData?.name || "",
    sku: initialData?.sku || "",
    categoryId: initialData?.categoryId || "",
    pricePerMeter: initialData?.pricePerMeter || 0,
    moq: initialData?.moq || 50,
    stock: initialData?.stock || 0,
    gsm: initialData?.gsm || 150,
    width: initialData?.width || "58\"",
    composition: initialData?.composition || "",
    description: initialData?.description || "",
    images: initialData?.images || []
  }

  const { control, handleSubmit, formState: { errors }, watch } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues
  })

  const onSubmit = (data: ProductFormValues) => {
    console.log("Mock Saving Data...", data)
    alert(`Product ${mode === "create" ? "created" : "updated"} successfully! (Mock)`)
    router.push("/supplier/inventory")
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button type="button" variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {mode === "create" ? "Add New Product" : mode === "edit" ? "Edit Product" : "View Product"}
          </h1>
        </div>
        {!isReadOnly && (
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
            <Save className="mr-2 h-4 w-4" /> Save Product
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Product title, SKU, and categorization.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Controller name="name" control={control} render={({ field }) => (
                  <Input {...field} disabled={isReadOnly} placeholder="e.g. Premium Silk Blend..." />
                )} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>SKU</Label>
                  <Controller name="sku" control={control} render={({ field }) => (
                    <Input {...field} disabled={isReadOnly} placeholder="SKU-000000" />
                  )} />
                  {errors.sku && <p className="text-sm text-destructive">{errors.sku.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Controller name="categoryId" control={control} render={({ field }) => (
                    <Select disabled={isReadOnly} onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c: any) => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )} />
                  {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Controller name="description" control={control} render={({ field }) => (
                  <Textarea {...field} disabled={isReadOnly} className="min-h-[150px]" placeholder="Describe the fabric quality, ideal usage, etc..." />
                )} />
                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Technical Specs */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>GSM</Label>
                <Controller name="gsm" control={control} render={({ field }) => (
                  <Input type="number" {...field} disabled={isReadOnly} />
                )} />
              </div>
              <div className="space-y-2">
                <Label>Width</Label>
                <Controller name="width" control={control} render={({ field }) => (
                  <Input {...field} disabled={isReadOnly} placeholder="e.g. 58&quot;" />
                )} />
              </div>
              <div className="space-y-2">
                <Label>Composition</Label>
                <Controller name="composition" control={control} render={({ field }) => (
                  <Input {...field} disabled={isReadOnly} placeholder="100% Cotton" />
                )} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <Controller name="images" control={control} render={({ field }) => (
                <ImageUploader 
                  images={field.value} 
                  onChange={isReadOnly ? () => {} : field.onChange} 
                />
              )} />
              {errors.images && <p className="text-sm text-destructive mt-2">{errors.images.message}</p>}
            </CardContent>
          </Card>

          {/* Commercials */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Price per Meter ($)</Label>
                <Controller name="pricePerMeter" control={control} render={({ field }) => (
                  <Input type="number" step="0.01" {...field} disabled={isReadOnly} />
                )} />
              </div>
              <div className="space-y-2">
                <Label>Minimum Order Quantity (MOQ)</Label>
                <Controller name="moq" control={control} render={({ field }) => (
                  <Input type="number" {...field} disabled={isReadOnly} />
                )} />
              </div>
              <div className="space-y-2">
                <Label>Current Stock (Meters)</Label>
                <Controller name="stock" control={control} render={({ field }) => (
                  <Input type="number" {...field} disabled={isReadOnly} />
                )} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
