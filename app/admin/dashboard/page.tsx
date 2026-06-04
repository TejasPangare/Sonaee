"use client";

import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminShell } from "@/components/admin/admin-shell";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAdmin } from "@/lib/admin-context";
import { Order } from "@/lib/types";
import { Table } from '@/lib/api-client'
import { OrderWithItems } from "@/lib/api-client";

export default function DashboardPage() {
  const { token, isLoading: authLoading } = useAdmin();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const authToken = token;
  if (!authToken) return;

  async function fetchData() {
    try {
      const [ordersData, tablesData] = await Promise.all([
        api.orders.getAll(authToken!),
        api.tables.getAll(authToken!),
      ]);

      setOrders(ordersData);
      setTables(tablesData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  fetchData();
}, [token]);


  const todayOrders = orders.filter((o) => o.status !== "cancelled");
  const pendingOrders = orders.filter(
    (o) =>
      o.status === "pending" ||
      o.status === "confirmed" ||
      o.status === "preparing",
  );
  const completedOrders = orders.filter((o) => o.status === "completed");
  const totalRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const availableTables = tables.filter((t) => t.status === "available").length;

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 5);

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    preparing: "bg-orange-100 text-orange-800 border-orange-200",
    ready: "bg-green-100 text-green-800 border-green-200",
    completed: "bg-gray-100 text-gray-800 border-gray-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here is what is happening today.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Today&apos;s Revenue
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                ₹{totalRevenue.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {/* <span className="text-green-600">+12.5%</span> from yesterday */}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
              <ShoppingBag className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {todayOrders.length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {pendingOrders.length} pending, {completedOrders.length}{" "}
                completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Available Tables
              </CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {availableTables}/{tables.length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {tables.filter((t) => t.status === "occupied").length} occupied
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Order Value
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                ₹
                {todayOrders.length > 0
                  ? (totalRevenue / todayOrders.length).toFixed(2)
                  : "0.00"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {/* <span className="text-green-600">+5.2%</span> from last week */}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {order.order_type === "takeaway" ? (
                          <ShoppingBag className="w-5 h-5 text-primary" />
                        ) : (
                          <Users className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {order.order_number}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.customer.full_name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className={statusColors[order.status]}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </Badge>
                      <p className="text-sm font-medium text-foreground mt-1">
                        ₹{order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="font-semibold text-foreground">
                    {orders.filter((o) => o.status === "pending").length} orders
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Preparing</p>
                  <p className="font-semibold text-foreground">
                    {orders.filter((o) => o.status === "preparing").length}{" "}
                    orders
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    Ready for Pickup
                  </p>
                  <p className="font-semibold text-foreground">
                    {orders.filter((o) => o.status === "ready").length} orders
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    Completed Today
                  </p>
                  <p className="font-semibold text-foreground">
                    {orders.filter((o) => o.status === "completed").length}{" "}
                    orders
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
