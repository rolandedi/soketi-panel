import { randomBytes } from "node:crypto";

export function generateAppId() {
  return randomBytes(16).toString("hex");
}

export function generateAppKey() {
  return randomBytes(23).toString("hex");
}

export function generateAppSecret() {
  return randomBytes(32).toString("hex");
}
