"use client"

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save, Edit2, X } from 'lucide-react';

/* eslint-disable @typescript-eslint/no-explicit-any */

export function ProfileClient({ initialProfile }: { initialProfile: any }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [profile, setProfile] = React.useState<any>(initialProfile);

  const { control, handleSubmit, reset } = useForm({
    values: profile || {}
  });

  const onSubmit = (data: any) => {
    setProfile(data);
    setIsEditing(false);
    alert("Profile updated successfully (Mock Component State)");
  };

  const handleCancel = () => {
    reset(profile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto p-4 md:p-8 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Company Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your business information and sourcing preferences.</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleCancel} variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
            <Button onClick={handleSubmit(onSubmit)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Your public identity on the LoomAI marketplace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Controller name="name" control={control} render={({ field }) => (
                  <Input {...field} disabled={!isEditing} />
                )} />
              </div>
              <div className="space-y-2">
                <Label>Industry</Label>
                <Controller name="industry" control={control} render={({ field }) => (
                  <Input {...field} disabled={!isEditing} />
                )} />
              </div>
              <div className="space-y-2">
                <Label>Business Type</Label>
                <Controller name="businessType" control={control} render={({ field }) => (
                  <Input {...field} disabled={!isEditing} />
                )} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>How suppliers can reach out to you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Primary Contact Name</Label>
                <Controller name="contactName" control={control} render={({ field }) => (
                  <Input {...field} disabled={!isEditing} />
                )} />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Controller name="email" control={control} render={({ field }) => (
                  <Input {...field} type="email" disabled={!isEditing} />
                )} />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Controller name="phone" control={control} render={({ field }) => (
                  <Input {...field} disabled={!isEditing} />
                )} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sourcing Preferences</CardTitle>
            <CardDescription>Used by our AI to recommend the best suppliers and fabrics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Preferred Categories (Comma separated)</Label>
              <Controller name="preferredCategories" control={control} render={({ field }) => (
                <Input 
                  value={Array.isArray(field.value) ? field.value.join(", ") : field.value} 
                  onChange={(e) => field.onChange(e.target.value.split(",").map(s => s.trim()))}
                  disabled={!isEditing} 
                />
              )} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Budget Range (Monthly)</Label>
                <Controller name="budgetRange" control={control} render={({ field }) => (
                  <Input {...field} disabled={!isEditing} />
                )} />
              </div>
              <div className="space-y-2">
                <Label>Typical Order Quantity</Label>
                <Controller name="typicalOrderQuantity" control={control} render={({ field }) => (
                  <Input {...field} disabled={!isEditing} />
                )} />
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
