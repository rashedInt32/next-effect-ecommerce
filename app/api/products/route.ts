import { PgLive } from "@/src/infrastructure/database";
import { ProductService } from "@/src/services/ProductService";
import { Effect } from "effect";
import { NextResponse } from "next/server";

export async function GET() {
  const program = Effect.gen(function* () {
    const service = yield* ProductService;
    const products = yield* service.getAll();
    return yield* Effect.succeed(NextResponse.json({ products }));
  }).pipe(
    Effect.catchAll((error) => {
      return Effect.succeed(
        NextResponse.json({ error: error.message }, { status: 500 }),
      );
    }),
    Effect.withSpan("GET /api/products"),
  );

  const products = await Effect.runPromise(
    program.pipe(
      Effect.provide(ProductService.Default),
      Effect.provide(PgLive),
    ),
  );
  return products;
}
