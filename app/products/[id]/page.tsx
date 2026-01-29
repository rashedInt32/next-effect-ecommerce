import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold">Product Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          The product you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild className="mt-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
        </Button>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="flex flex-col">
          <div className="flex items-start justify-between">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold">{product.name}</h1>
            </div>
          </div>

          <p className="mt-4 text-lg text-muted-foreground">
            {product.description}
          </p>

          <Separator className="my-6" />

          <div className="flex items-baseline gap-4">
            <span className="text-4xl font-bold">
              {formatPrice(product.price)}
            </span>
            <span className="text-muted-foreground">
              {product.stock > 0 ? (
                <Badge variant="outline" className="text-green-600">
                  {product.stock} in stock
                </Badge>
              ) : (
                <Badge variant="destructive">Out of stock</Badge>
              )}
            </span>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-md border">
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">1</span>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button size="lg" className="flex-1">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <h3 className="font-semibold">Product Details</h3>
            <dl className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">SKU</dt>
                <dd className="font-medium">{product.id.toUpperCase()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Category</dt>
                <dd className="font-medium capitalize">{product.category}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Added</dt>
                <dd className="font-medium">
                  {new Date(product.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-semibold">Related Products</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} className="group overflow-hidden">
                <CardHeader className="p-0">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <Image
                      src={relatedProduct.imageUrl}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="line-clamp-1 text-base">
                    {relatedProduct.name}
                  </CardTitle>
                  <p className="mt-2 font-bold">
                    {formatPrice(relatedProduct.price)}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/products/${relatedProduct.id}`}>
                      View Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
