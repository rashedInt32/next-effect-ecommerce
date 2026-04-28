import { Product, ProductId, ProductInput } from "@/src/domain/models";
import { SqlError } from "@effect/sql/SqlError";
import { ProductRepo } from "@/src/infrastructure/repositories/ProductRepo";
import { Effect } from "effect";
import { ProductNotFoundError, ValidationError } from "@/src/errors";

export class ProductService extends Effect.Service<ProductService>()(
  "ProductService",
  {
    effect: Effect.gen(function* () {
      const repo = yield* ProductRepo;

      const getAll = (): Effect.Effect<Product[], SqlError> =>
        repo.findAll().pipe(
          Effect.mapError(
            (error) =>
              new SqlError({
                cause: error,
                message: "Failed to fetch products",
              }),
          ),
        );
      const getById = (
        id: string,
      ): Effect.Effect<Product, ProductNotFoundError | SqlError> =>
        repo
          .findById(id)
          .pipe(
            Effect.flatMap((product) =>
              product
                ? Effect.succeed(product)
                : ProductNotFoundError.make({ id }),
            ),
          );

      const create = (input: ProductInput): Effect.Effect<Product, SqlError> =>
        Effect.gen(function* () {
          const id = ProductId.make(
            `product-${new Date() + Math.random().toString(36).slice(2)}`,
          );
          yield* repo.insert(id, input);
          return {
            id,
            ...input,
            createdAt: new Date().toISOString(),
          };
        });

      const updateStock = (
        id: ProductId,
        stock: number,
      ): Effect.Effect<
        Product,
        ProductNotFoundError | ValidationError | SqlError
      > =>
        Effect.gen(function* () {
          const product = yield* repo.findById(id);
          if (!product) {
            return yield* ProductNotFoundError.make({ id });
          }
          if (stock < 0) {
            return yield* ValidationError.make({
              message: "Stock cannot be negative",
            });
          }
          const rows = yield* repo.updateStock(product.id, stock);
          return rows[0] as Product;
        });

      return { getAll, getById, create, updateStock };
    }),
    dependencies: [ProductRepo.Default],
  },
) {}
