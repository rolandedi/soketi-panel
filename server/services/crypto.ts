import { randomBytes, randomUUID } from "node:crypto";

export function generateAppId() {
  return randomUUID();
}

export function generateAppKey() {
  return randomBytes(16).toString("hex");
}

export function generateAppSecret() {
  return randomBytes(32).toString("hex");
}
