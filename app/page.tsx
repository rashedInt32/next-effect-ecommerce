import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const products = [
  {
    id: "prod_001",
    name: "Wireless Bluetooth Headphones",
    description: "Premium noise-cancelling headphones with 30-hour battery life",
    price: 7999,
    stock: 45,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    category: "electronics",
    createdAt: "2025-01-15T10:30:00Z",
  },
  {
    id: "prod_002",
    name: "Minimalist Leather Wallet",
    description: "Slim genuine leather wallet with RFID protection",
    price: 4999,
    stock: 120,
    imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=500&fit=crop",
    category: "accessories",
    createdAt: "2025-01-14T08:00:00Z",
  },
  {
    id: "prod_003",
    name: "Smart Fitness Watch",
    description: "Track your health with heart rate monitor and GPS",
    price: 19999,
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    category: "electronics",
    createdAt: "2025-01-13T14:20:00Z",
  },
  {
    id: "prod_004",
    name: "Organic Cotton T-Shirt",
    description: "Comfortable everyday tee made from 100% organic cotton",
    price: 2999,
    stock: 200,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
    category: "clothing",
    createdAt: "2025-01-12T09:45:00Z",
  },
  {
    id: "prod_005",
    name: "Portable Bluetooth Speaker",
    description: "Waterproof speaker with 360° sound and 12-hour battery",
    price: 8999,
    stock: 75,
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop",
    category: "electronics",
    createdAt: "2025-01-11T16:30:00Z",
  },
  {
    id: "prod_006",
    name: "Stainless Steel Water Bottle",
    description: "Insulated bottle keeps drinks cold 24hrs or hot 12hrs",
    price: 3499,
    stock: 150,
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop",
    category: "lifestyle",
    createdAt: "2025-01-10T11:15:00Z",
  },
  {
    id: "prod_007",
    name: "Mechanical Keyboard",
    description: "RGB backlit keyboard with cherry MX switches",
    price: 12999,
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&h=500&fit=crop",
    category: "electronics",
    createdAt: "2025-01-09T13:00:00Z",
  },
  {
    id: "prod_008",
    name: "Canvas Backpack",
    description: "Durable backpack with laptop compartment and USB port",
    price: 5999,
    stock: 85,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
    category: "accessories",
    createdAt: "2025-01-08T10:00:00Z",
  },
];

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <div className="rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8 md:p-12">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Welcome to ShopEffect
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground md:text-lg">
            Discover amazing products at unbeatable prices. Quality meets
            affordability in our curated collection.
          </p>
          <Button size="lg" className="mt-6" asChild>
            <Link href="#products">Shop Now</Link>
          </Button>
        </div>
      </section>

      <section id="products">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            Featured Products
          </h2>
          <Badge variant="secondary">{products.length} items</Badge>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <Badge className="absolute right-2 top-2" variant="secondary">
                    {product.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="line-clamp-1 text-lg">
                  {product.name}
                </CardTitle>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {product.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-bold">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {product.stock} in stock
                  </span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full" asChild>
                  <Link href={`/products/${product.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
