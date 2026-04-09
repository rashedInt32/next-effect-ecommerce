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

interface ProductFromAPI {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  category: string;
  created_at: string;
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default async function Home() {
  const response = await fetch("http://localhost:3000/api/products");
  const data = await response.json();
  const products: ProductFromAPI[] = data.products;

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
                    src={product.image_url}
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
