import { Config } from "effect";

export const AppConfig = Config.all({
  baseUrl: Config.string("BASE_URL").pipe(
    Config.withDefault("http://localhost:3000"),
  ),
  databaseUrl: Config.redacted("DATABASE_URL"),
});

export const AppConfigEnv = "Some";

export type AppConfig = Config.Config.Success<typeof AppConfig>;
