// Utils/Logger.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirName = path.dirname(fileURLToPath(import.meta.url));

// Log levels in ascending severity order.
// Only messages at or above the configured level will be written.
const LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };

export default class Logger {
  #level;
  #logFile;

  constructor() {
    this.#level = process.env.LOG_LEVEL || "INFO";
    const logDir = path.join(__dirName, "../Logs");
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    this.#logFile = fs.createWriteStream(path.join(logDir, "app.log"), { flags: "a" });
  }

  #write(level, message) {
    if (LEVELS[level] < LEVELS[this.#level]) {
      return;
    }
    const timestamp = new Date().toISOString();
    const formatted = `[${timestamp}] [${level}] ${message}\n`;
    console.log(formatted.trim());
    this.#logFile.write(formatted);
  }

  debug(message) {
    this.#write("DEBUG", message);
  }

  info(message) {
    this.#write("INFO", message);
  }

  warn(message) {
    this.#write("WARN", message);
  }

  error(message) {
    this.#write("ERROR", message);
  }
}

// Export a single shared instance so all files use the same log file.
export const logger = new Logger();