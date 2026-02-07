import { Product, ProductInput } from "@/src/domain/models";
import { PgClient } from "@effect/sql-pg";
import { Effect } from "effect";

export class ProductRepo extends Effect.Service<ProductRepo>()("ProductRepo", {
  effect: Effect.gen(function* () {
    const sql = yield* PgClient.PgClient;

    return {
      findAll: () =>
        sql<Product>`SELECT * FROM products`.pipe(
          Effect.map((rows: unknown) => rows as Product[]),
        ),
      findById: (id: string) =>
        sql`SELECT * FROM products WHERE id = ${id}`.pipe(
          Effect.map((rows: unknown) => (rows as Product[])[0]),
        ),

      insert: (id: string, input: ProductInput) =>
        sql`INSERT INTO products ${sql.insert({ id, ...input })} RETURNING *`,
      update: (id: string, data: Partial<Product>) =>
        sql`UPDATE products SET ${sql.update(data)} WHERE id = ${id} RETURNING *`,

      updateStock: (id: string, stock: number) =>
        sql`UPDATE products SET stock = ${stock} WHERE id = ${id}`,

      delete: (id: string) => sql`DELETE FROM products WHERE id = ${id}`,
    };
  }),
}) {}
