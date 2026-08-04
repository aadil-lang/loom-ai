import * as React from 'react';
import { supplierService } from '@/services';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

export default async function SettingsPage() {
  const supplierId = 's1'; 
  const supplier = await supplierService.getSupplierById(supplierId);

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto p-6 md:p-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your public profile, factory details, and account preferences.</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Public Profile</CardTitle>
            <CardDescription>This information is visible to buyers on the marketplace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input defaultValue={supplier?.name || ""} />
              </div>
              <div className="space-y-2">
                <Label>Business Type</Label>
                <Input defaultValue={supplier?.businessType || ""} />
              </div>
              <div className="space-y-2">
                <Label>Contact Email</Label>
                <Input type="email" defaultValue={supplier?.email || "contact@example.com"} />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input defaultValue="+1 (555) 123-4567" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Factory & Compliance</CardTitle>
            <CardDescription>Upload certifications to build trust with enterprise buyers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Location / Country</Label>
              <Input defaultValue={supplier?.location || ""} />
            </div>
            <div className="space-y-2">
              <Label>Active Certifications (Comma separated)</Label>
              <Input defaultValue={(supplier?.certifications || []).join(", ")} />
            </div>
            <div className="pt-4 flex justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
