import { Schema } from "effect";

export class ProductNotFoundError extends Schema.TaggedError<ProductNotFoundError>()(
  "ProductNotFoundError",
  {
    id: Schema.String,
  },
) {}

export class InsufficientStock extends Schema.TaggedError<InsufficientStock>()(
  "InsufficientStock",
  {
    productId: Schema.String,
    requestedQuantity: Schema.Number,
    availableQuantity: Schema.Number,
  },
) {}

export class CartNotFound extends Schema.TaggedError<CartNotFound>()(
  "CartnotFound",
  {
    visitorId: Schema.String,
  },
) {}

export class CartEmpty extends Schema.TaggedError<CartEmpty>()("CartEmpty", {
  visitorId: Schema.String,
}) {}

export class OrderNotFound extends Schema.TaggedError<OrderNotFound>()(
  "OrderNotFound",
  {
    id: Schema.String,
  },
) {}

export class InvalidQuantity extends Schema.TaggedError<InvalidQuantity>()(
  "InvalidQuantity",
  {
    quantity: Schema.Number,
  },
) {}
