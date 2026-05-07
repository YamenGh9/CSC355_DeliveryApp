// Utils/Config.mjs
import "dotenv/config";

export default class Config {
  static #instance = null;

  static getInstance() {
    if (!Config.#instance) Config.#instance = new Config();
    return Config.#instance;
  }

  constructor() {
    this.port = Number(process.env.PORT);
    this.dbHost = process.env.DB_HOST;
    this.dbPort = Number(process.env.DB_PORT);
    this.dbUser = process.env.DB_USER;
    this.dbPassword = process.env.DB_PASSWORD;
    this.dbName = process.env.DB_NAME;
    this.dbConnLimit = Number(process.env.DB_CONNECTION_LIMIT ?? "10");
    this.dbQueueLimit = Number(process.env.DB_QUEUE_LIMIT ?? "0");
    this.logLevel = process.env.LOG_LEVEL ?? "INFO";

    this.#validate();
  }

  #validate() {
    const required = [
      { name: "PORT", value: this.port },
      { name: "DB_HOST", value: this.dbHost },
      { name: "DB_PORT", value: this.dbPort },
      { name: "DB_USER", value: this.dbUser },
      { name: "DB_PASSWORD", value: this.dbPassword },
      { name: "DB_NAME", value: this.dbName },
    ];

    for (const { name, value } of required) {
      if (value === undefined || value === null || (typeof value === "number" && isNaN(value))) {
        throw new Error(`Missing required config: ${name}`);
      }
    }
  }
}