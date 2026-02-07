import { AppConfig } from "@/src/domain/config";
import { Config, Effect, Either, Layer } from "effect";
import { PgClient } from "@effect/sql-pg";

export const PgLive = Layer.unwrapEffect(
  Config.map(AppConfig, (config) =>
    PgClient.layer({
      url: config.databaseUrl,
    }),
  ),
);
