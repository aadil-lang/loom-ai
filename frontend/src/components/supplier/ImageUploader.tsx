"use client"

import * as React from "react"
import { UploadCloud, X } from "lucide-react"
import Image from "next/image"

export interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

export function ImageUploader({ images, onChange, maxImages = 5 }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = React.useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true)
    else if (e.type === "dragleave") setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    // MOCK UPLOAD: We just append placeholders for demonstration
    if (images.length < maxImages) {
      const newMockImages = [...images, `https://placehold.co/600x400/eeeeee/999999?text=Uploaded+Image+${images.length + 1}`]
      onChange(newMockImages.slice(0, maxImages))
    }
  }

  const handleMockUpload = () => {
    if (images.length < maxImages) {
      const newMockImages = [...images, `https://placehold.co/600x400/eeeeee/999999?text=Uploaded+Image+${images.length + 1}`]
      onChange(newMockImages.slice(0, maxImages))
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((url, idx) => (
            <div key={url || `image-${idx}`} className="relative aspect-square rounded-lg border overflow-hidden group">
              <Image src={url} alt="Product image" fill className="object-cover" />
              <button 
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {images.length < maxImages && (
        <div 
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:bg-slate-50"}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleMockUpload}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="rounded-full bg-primary/10 p-3">
              <UploadCloud className="h-6 w-6 text-primary" />
            </div>
            <div className="text-sm font-medium">Click or drag images here to upload</div>
            <div className="text-xs text-muted-foreground">Up to {maxImages} images. PNG, JPG, or WEBP. (Mock)</div>
          </div>
        </div>
      )}
    </div>
  )
}
