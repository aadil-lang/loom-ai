export default function SupplierDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-emerald-900 dark:text-emerald-500">Supplier Overview</h1>
        <p className="text-muted-foreground">Manage your inventory, process orders, and view analytics.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="h-32 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 flex flex-col items-center justify-center text-emerald-700 dark:text-emerald-400">
          <span className="text-3xl font-bold">12</span>
          <span className="text-sm">Pending Orders</span>
        </div>
        <div className="h-32 rounded-xl bg-muted/50 border border-dashed flex items-center justify-center text-muted-foreground">Total Revenue</div>
        <div className="h-32 rounded-xl bg-muted/50 border border-dashed flex items-center justify-center text-muted-foreground">Active Listings</div>
        <div className="h-32 rounded-xl bg-muted/50 border border-dashed flex items-center justify-center text-muted-foreground">Profile Views</div>
      </div>
    </div>
  );
}
