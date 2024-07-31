import { config as conf } from "dotenv";

conf();

const configEnv = {
  PORT: process.env.PORT,
  DBURLNAME: process.env.DATABASE_URL,
  DBNAME: process.env.DATABASE_NAME,
  Env: process.env.envError,
};

export const config = Object.freeze(configEnv);
