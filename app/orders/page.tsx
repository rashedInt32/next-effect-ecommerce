import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const orders = [
  {
    id: "order_001",
    status: "delivered",
    createdAt: "2025-01-20T14:30:00Z",
    total: 26496,
    items: [
      {
        productId: "prod_001",
        name: "Wireless Bluetooth Headphones",
        price: 7999,
        quantity: 2,
        imageUrl:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
      },
      {
        productId: "prod_006",
        name: "Stainless Steel Water Bottle",
        price: 3499,
        quantity: 3,
        imageUrl:
          "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop",
      },
    ],
  },
  {
    id: "order_002",
    status: "shipped",
    createdAt: "2025-01-25T09:15:00Z",
    total: 20998,
    items: [
      {
        productId: "prod_003",
        name: "Smart Fitness Watch",
        price: 19999,
        quantity: 1,
        imageUrl:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
      },
    ],
  },
  {
    id: "order_003",
    status: "processing",
    createdAt: "2025-01-27T16:45:00Z",
    total: 18998,
    items: [
      {
        productId: "prod_007",
        name: "Mechanical Keyboard",
        price: 12999,
        quantity: 1,
        imageUrl:
          "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&h=500&fit=crop",
      },
      {
        productId: "prod_002",
        name: "Minimalist Leather Wallet",
        price: 4999,
        quantity: 1,
        imageUrl:
          "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=500&fit=crop",
      },
    ],
  },
];

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "delivered":
      return "default";
    case "shipped":
      return "secondary";
    case "processing":
      return "outline";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
}

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continue Shopping
        </Link>
      </Button>

      <h1 className="mb-8 text-3xl font-bold">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center">
          <Package className="h-16 w-16 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">No orders yet</h2>
          <p className="mt-2 text-muted-foreground">
            Start shopping to see your orders here!
          </p>
          <Button asChild className="mt-6">
            <Link href="/">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      Order #{order.id.toUpperCase()}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Placed on{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </Badge>
                    <span className="font-semibold">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={item.productId}>
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1">
                          <Link
                            href={`/products/${item.productId}`}
                            className="font-medium hover:underline"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} × {formatPrice(item.price)}
                          </p>
                        </div>
                        <span className="font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                      {index < order.items.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/orders/${order.id}`}>
                      View Details
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
