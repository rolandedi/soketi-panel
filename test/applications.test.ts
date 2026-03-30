import { describe, it, expect } from "vitest";
import {
  generateAppId,
  generateAppKey,
  generateAppSecret,
} from "../server/services/crypto";
import { createApplicationScheme } from "../server/validations/applications/createApplicationScheme";
import { updateApplicationScheme } from "../server/validations/applications/updateApplicationScheme";

describe("application crypto helpers", () => {
  it("generates application identifiers and credentials with expected shapes", () => {
    const appId = generateAppId();
    const appKey = generateAppKey();
    const appSecret = generateAppSecret();

    expect(appId).toHaveLength(36);
    expect(appKey).toHaveLength(32);
    expect(appSecret).toHaveLength(64);
    expect(appKey).not.toBe(appSecret);
  });
});

describe("application validation schemas", () => {
  it("parses create application payloads with numeric coercion", () => {
    const result = createApplicationScheme.parse({
      name: "My Application",
      max_connections: "25",
      enabled: true,
      webhooks: ["https://example.com/webhook"],
    });

    expect(result.max_connections).toBe(25);
    expect(result.name).toBe("My Application");
    expect(result.webhooks).toEqual(["https://example.com/webhook"]);
  });

  it("parses partial update payloads", () => {
    const result = updateApplicationScheme.parse({
      enabled: false,
      max_event_batch_size: "15",
    });

    expect(result.enabled).toBe(false);
    expect(result.max_event_batch_size).toBe(15);
  });
});
