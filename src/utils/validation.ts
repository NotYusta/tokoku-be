import type { Request } from "express";

export class ValidationError extends Error {
  constructor(public readonly fields: string[]) {
    super(`Missing or invalid fields: ${fields.join(", ")}`);
    this.name = "ValidationError";
  }
}

export function validateAndParse<T extends Record<string, any>>(
  req: Request,
  requiredFields: (keyof T)[]
): T {
  const body = req.body as Record<string, unknown>;
  const missing: string[] = [];

  const result = {} as T;

  for (const field of requiredFields) {
    const value = body[field as string]; 

    if (value === undefined || value === null || value === "") {
      missing.push(String(field));
    } else {
      result[field] = value as T[typeof field];
    }
  }

  if (missing.length > 0) {
    throw new ValidationError(missing);
  }

  return result;
}
