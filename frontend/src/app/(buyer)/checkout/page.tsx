"use client"

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Truck, FileText, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartTotal, clearCart } = useCart();
  const [step, setStep] = React.useState(1);

  // If they somehow land here with no items (unless success)
  React.useEffect(() => {
    if (items.length === 0 && step !== 3) {
      router.push('/cart');
    }
  }, [items, router, step]);

  const shipping = items.length > 0 ? 150 : 0;
  const total = cartTotal + shipping;

  const handleCompleteOrder = () => {
    // Generate Order Mock
    setStep(3);
    clearCart(); // Local state wipe
  };

  if (step === 3) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 text-center max-w-lg mx-auto p-6">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="h-24 w-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4"
        >
          <CheckCircle2 className="h-12 w-12" />
        </motion.div>
        <h1 className="text-4xl font-bold tracking-tight">Order Confirmed!</h1>
        <p className="text-muted-foreground text-lg">
          Your mock purchase order #PO-{Math.floor(Math.random() * 100000)} has been sent to the suppliers.
        </p>
        <div className="pt-8 w-full flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/orders">
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-full">
              Track Order
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="w-full sm:w-auto rounded-full">
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto p-4 md:p-8 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => step === 2 ? setStep(1) : router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
      </div>

      <div className="flex items-center justify-center mb-8">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600 font-bold' : 'text-muted-foreground'}`}>
          <div className="h-8 w-8 rounded-full border-2 flex items-center justify-center">1</div>
          <span>Shipping</span>
        </div>
        <div className={`h-px w-16 mx-4 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600 font-bold' : 'text-muted-foreground'}`}>
          <div className="h-8 w-8 rounded-full border-2 flex items-center justify-center">2</div>
          <span>Review</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 relative">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="p-6 rounded-xl border bg-white shadow-sm space-y-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Truck className="h-5 w-5 text-blue-600" /> Shipping Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input defaultValue="Jane Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label>Company Name</Label>
                      <Input defaultValue="Acme Apparel" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Street Address</Label>
                      <Input defaultValue="123 Fashion Ave, Suite 400" />
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input defaultValue="New York" />
                    </div>
                    <div className="space-y-2">
                      <Label>ZIP Code</Label>
                      <Input defaultValue="10001" />
                    </div>
                  </div>
                  <Button onClick={() => setStep(2)} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12">
                    Continue to Review
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="p-6 rounded-xl border bg-white shadow-sm space-y-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" /> Order Review
                  </h2>
                  <div className="space-y-4">
                    {items.map(({ product, quantity }) => (
                      <div key={product.id} className="flex justify-between items-center pb-4 border-b last:border-0 last:pb-0">
                        <div>
                          <div className="font-semibold">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{quantity} meters</div>
                        </div>
                        <div className="font-bold">${(product.pricePerMeter * quantity).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                    <strong>Note:</strong> Payment is handled off-platform for large B2B POs. Clicking Confirm will dispatch the PO to the suppliers.
                  </div>
                  <Button onClick={handleCompleteOrder} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12">
                    Confirm Purchase Order
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <div className="p-6 rounded-xl border bg-white shadow-sm space-y-4 sticky top-24">
            <h3 className="font-bold text-lg border-b pb-4">Summary</h3>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Items ({items.length})</span>
              <span className="font-medium">${cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium">${shipping.toLocaleString()}</span>
            </div>
            <div className="border-t pt-4 flex justify-between font-bold text-xl">
              <span>Total</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
