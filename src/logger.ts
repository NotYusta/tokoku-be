import pino, { type LevelWithSilent } from "pino";

const validLevels = [
  "fatal",
  "error",
  "warn",
  "info",
  "debug",
  "trace",
  "silent",
] as const;

function resolveLogLevel(): LevelWithSilent {
  const raw = process.env.LOG_LEVEL?.trim().toLowerCase();
  if (!raw) return "info";
  if (validLevels.includes(raw as LevelWithSilent)) return raw as LevelWithSilent;
  return "info";
}

const logger = pino({
  level: resolveLogLevel(),
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      singleLine: true,
      translateTime: "yyyy-mm-dd HH:MM:ss.l",
      ignore: "pid,hostname",
    },
  },
});

export default logger;
