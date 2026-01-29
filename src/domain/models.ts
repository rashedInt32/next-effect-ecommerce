import { Schema } from "effect";

export const ProductId = Schema.String.pipe(Schema.brand("ProductId"));

export const Category = Schema.Literal(
  "Electronics",
  "Books",
  "Clothing",
  "Home",
  "Toys",
).pipe(Schema.brand("Category"));

export class Product extends Schema.Class<Product>("Product")({
  id: ProductId,
  name: Schema.String.pipe(Schema.nonEmptyString()),
  description: Schema.optional(Schema.String),
  price: Schema.Number.pipe(Schema.greaterThanOrEqualTo(0)),
  stock: Schema.NonNegativeInt,
  imageUrl: Schema.optional(Schema.String),
  category: Category,
  createdAt: Schema.Date,
}) {}

export const createProductSchema = Schema.Struct(Product.fields).pipe(
  Schema.omit("id", "createdAt"),
);

export const createProduct = (params: {
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  category: "Electronics" | "Books" | "Clothing" | "Home" | "Toys";
  createdAt?: Date;
}): Product =>
  new Product({
    id: ProductId.make(`prod-${Math.floor(Math.random() * 1000000)}`),
    name: params.name,
    description: params.description,
    price: params.price,
    stock: params.stock,
    imageUrl: params.imageUrl,
    category: Category.make(params.category),
    createdAt: new Date(),
  });
