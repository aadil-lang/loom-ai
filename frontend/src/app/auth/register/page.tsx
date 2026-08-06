"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { registerBuyer, registerSupplier } from '@/services/api/auth.service';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { refreshUser } = useAuth();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>, role: 'Buyer' | 'Supplier') => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      if (role === 'Buyer') {
        const payload = {
          name: formData.get('company') as string || formData.get('name') as string,
          email: formData.get('email') as string,
          password: password,
          contactName: formData.get('name') as string,
          // Phone and Company can be passed even if backend ignores them
          phone: formData.get('phone') as string,
        };
        await registerBuyer(payload);
        refreshUser();
        router.push('/dashboard?onboarding=true');
      } else {
        const payload = {
          name: formData.get('businessName') as string,
          email: formData.get('email') as string,
          password: password,
          contactName: formData.get('contactPerson') as string,
          location: formData.get('location') as string || 'Global',
          // GST and Phone passed even if ignored
          gst: formData.get('gst') as string,
          phone: formData.get('phone') as string,
        };
        await registerSupplier(payload);
        refreshUser();
        router.push('/supplier?onboarding=true');
      }
    } catch (err: any) {
      setError(err?.message || err?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-2xl border-muted/50 bg-background/60 backdrop-blur-xl">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-2">
          <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-xl">
            L
          </div>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
        <CardDescription>Join the global textile marketplace</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-start gap-2 text-destructive text-sm">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        <Tabs defaultValue="buyer" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="buyer">Buyer</TabsTrigger>
            <TabsTrigger value="supplier">Supplier</TabsTrigger>
          </TabsList>
          
          <TabsContent value="buyer" className="mt-0">
            <form onSubmit={(e) => handleRegister(e, 'Buyer')} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buyer-name">Full Name</Label>
                  <Input id="buyer-name" name="name" placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyer-company">Company</Label>
                  <Input id="buyer-company" name="company" placeholder="Acme Corp" required />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buyer-email">Email</Label>
                  <Input id="buyer-email" name="email" type="email" placeholder="john@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyer-phone">Phone</Label>
                  <Input id="buyer-phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buyer-password">Password</Label>
                  <Input id="buyer-password" name="password" type="password" required minLength={8} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyer-confirm">Confirm Password</Label>
                  <Input id="buyer-confirm" name="confirmPassword" type="password" required minLength={8} />
                </div>
              </div>

              <Button type="submit" className="w-full mt-6" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loading ? 'Creating account...' : 'Create Buyer Account'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="supplier" className="mt-0">
            <form onSubmit={(e) => handleRegister(e, 'Supplier')} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier-biz">Business Name</Label>
                  <Input id="supplier-biz" name="businessName" placeholder="Global Textiles Ltd." required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier-gst">GST / Tax ID</Label>
                  <Input id="supplier-gst" name="gst" placeholder="GSTIN12345678" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier-contact">Contact Person</Label>
                  <Input id="supplier-contact" name="contactPerson" placeholder="Jane Smith" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier-location">Location</Label>
                  <Input id="supplier-location" name="location" placeholder="Mumbai, India" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier-email">Email</Label>
                  <Input id="supplier-email" name="email" type="email" placeholder="sales@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier-phone">Phone</Label>
                  <Input id="supplier-phone" name="phone" type="tel" placeholder="+91 98765 43210" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier-password">Password</Label>
                  <Input id="supplier-password" name="password" type="password" required minLength={8} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier-confirm">Confirm Password</Label>
                  <Input id="supplier-confirm" name="confirmPassword" type="password" required minLength={8} />
                </div>
              </div>

              <Button type="submit" className="w-full mt-6" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loading ? 'Creating account...' : 'Create Supplier Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col border-t p-6 mt-6">
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
