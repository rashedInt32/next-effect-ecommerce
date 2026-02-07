import { Schema } from "effect";

export class SqlError extends Schema.Class<SqlError>("SqlError")({
  operation: Schema.String,
  error: Schema.String,
}) {}

export class NotFoundError extends Schema.Class<NotFoundError>("NotFoundError")(
  {
    id: Schema.String,
    operation: Schema.String,
    message: Schema.String,
  },
) {}
