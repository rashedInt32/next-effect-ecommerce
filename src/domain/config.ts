import { Config } from "effect";

export const AppConfig = Config.all({
  baseUrl: Config.string("BASE_URL").pipe(
    Config.withDefault("http://localhost:3000"),
  ),
  databaseUrl: Config.string("DATABASE_URL").pipe(
    Config.validate({
      message: "Database URL must start with 'postgresql://'",
      validation: (url) => url.startsWith("postgresql://"),
    }),
  ),
});

export type AppConfig = Config.Config.Success<typeof AppConfig>;
