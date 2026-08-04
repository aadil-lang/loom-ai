export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Buyer Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here is an overview of your sourcing activity.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-32 rounded-xl bg-muted/50 border border-dashed flex items-center justify-center text-muted-foreground">Active Orders</div>
        <div className="h-32 rounded-xl bg-muted/50 border border-dashed flex items-center justify-center text-muted-foreground">Saved Items</div>
        <div className="h-32 rounded-xl bg-muted/50 border border-dashed flex items-center justify-center text-muted-foreground">Recent Messages</div>
      </div>
    </div>
  );
}
