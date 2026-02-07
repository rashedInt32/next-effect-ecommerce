import { Schema } from "effect";

export const ProductId = Schema.String.pipe(Schema.brand("ProductId"));
export type ProductId = typeof ProductId.Type;

export const Product = Schema.Struct({
  id: ProductId,
  name: Schema.String,
  description: Schema.String,
  price: Schema.Number.pipe(Schema.int(), Schema.positive()),
  stock: Schema.Number.pipe(Schema.int(), Schema.nonNegative()),
  imageUrl: Schema.String,
  category: Schema.String,
  createdAt: Schema.String,
});
export type Product = typeof Product.Type;

export const ProductInput = Schema.Struct({
  name: Schema.String,
  description: Schema.String,
  price: Schema.Number.pipe(Schema.int(), Schema.positive()),
  stock: Schema.Number.pipe(Schema.int(), Schema.nonNegative()),
  imageUrl: Schema.String,
  category: Schema.String,
});
export type ProductInput = typeof ProductInput.Type;

export const CartItem = Schema.Struct({
  productId: ProductId,
  quantity: Schema.Number.pipe(Schema.int(), Schema.positive()),
  price: Schema.Number.pipe(Schema.int(), Schema.positive()),
  name: Schema.String,
});
export type CartItem = typeof CartItem.Type;

export const Cart = Schema.Struct({
  id: Schema.String.pipe(Schema.brand("CartId")),
  visitorId: Schema.String,
  items: Schema.Array(CartItem),
  total: Schema.Number.pipe(Schema.int(), Schema.nonNegative()),
  createdAt: Schema.String,
  updatedAt: Schema.String,
});
export type Cart = typeof Cart.Type;

export const OrderStatus = Schema.Literal(
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
);
export type OrderStatus = typeof OrderStatus.Type;

export const OrderItem = Schema.Struct({
  productId: ProductId,
  quantity: Schema.Number.pipe(Schema.int(), Schema.positive()),
  price: Schema.Number.pipe(Schema.int(), Schema.positive()),
  name: Schema.String,
});
export type OrderItem = typeof OrderItem.Type;

export const Order = Schema.Struct({
  id: Schema.String.pipe(Schema.brand("OrderId")),
  visitorId: Schema.String,
  items: Schema.Array(OrderItem),
  total: Schema.Number.pipe(Schema.int(), Schema.positive()),
  status: OrderStatus,
  createdAt: Schema.String,
});
export type Order = typeof Order.Type;

export const AddToCartInput = Schema.Struct({
  productId: ProductId,
  quantity: Schema.Number.pipe(Schema.int(), Schema.positive()),
});
export type AddToCartInput = typeof AddToCartInput.Type;

export const UpdateCartItemInput = Schema.Struct({
  productId: ProductId,
  quantity: Schema.Number.pipe(Schema.int(), Schema.nonNegative()),
});
export type UpdateCartItemInput = typeof UpdateCartItemInput.Type;

export const CheckoutInput = Schema.Struct({
  visitorId: Schema.String,
});
export type CheckoutInput = typeof CheckoutInput.Type;
