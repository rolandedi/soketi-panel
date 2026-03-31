import { describe, it, expect } from "vitest";
import {
  generateAppId,
  generateAppKey,
  generateAppSecret,
} from "../server/services/crypto";
import { createApplicationScheme } from "../server/validations/applications/createApplicationScheme";
import { updateApplicationScheme } from "../server/validations/applications/updateApplicationScheme";
import { deleteApplicationScheme } from "../server/validations/applications/deleteApplicationScheme";

describe("application crypto helpers", () => {
  it("generates application id with 32 hex characters (16 bytes)", () => {
    const appId = generateAppId();
    expect(appId).toHaveLength(32);
    expect(appId).toMatch(/^[0-9a-f]+$/);
  });

  it("generates application key with 46 hex characters (23 bytes)", () => {
    const appKey = generateAppKey();
    expect(appKey).toHaveLength(46);
    expect(appKey).toMatch(/^[0-9a-f]+$/);
  });

  it("generates application secret with 64 hex characters (32 bytes)", () => {
    const appSecret = generateAppSecret();
    expect(appSecret).toHaveLength(64);
    expect(appSecret).toMatch(/^[0-9a-f]+$/);
  });

  it("generates unique values on each call", () => {
    const id1 = generateAppId();
    const id2 = generateAppId();
    expect(id1).not.toBe(id2);

    const key1 = generateAppKey();
    const key2 = generateAppKey();
    expect(key1).not.toBe(key2);

    const secret1 = generateAppSecret();
    const secret2 = generateAppSecret();
    expect(secret1).not.toBe(secret2);
  });

  it("generates distinct values across id, key, and secret", () => {
    const appId = generateAppId();
    const appKey = generateAppKey();
    const appSecret = generateAppSecret();

    expect(appId).not.toBe(appKey);
    expect(appId).not.toBe(appSecret);
    expect(appKey).not.toBe(appSecret);
  });
});

describe("application validation schemas", () => {
  describe("createApplicationScheme", () => {
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

    it("requires a name with minimum 3 characters", () => {
      const result = createApplicationScheme.safeParse({ name: "AB" });
      expect(result.success).toBe(false);
    });

    it("requires a name with maximum 255 characters", () => {
      const result = createApplicationScheme.safeParse({
        name: "A".repeat(256),
      });
      expect(result.success).toBe(false);
    });

    it("accepts all optional config fields", () => {
      const result = createApplicationScheme.parse({
        name: "Full Config App",
        enabled: false,
        max_connections: 100,
        max_event_batch_size: 10,
        max_event_size_in_kb: 512,
        max_read_requests_per_second: 50,
        max_presence_members_per_channel: 100,
        max_presence_member_size_in_kb: 2,
        max_client_events_per_second: 10,
        enable_client_messages: true,
        enable_user_authentication: true,
        webhooks: ["https://example.com/hook1", "https://example.com/hook2"],
      });

      expect(result.name).toBe("Full Config App");
      expect(result.enabled).toBe(false);
      expect(result.max_connections).toBe(100);
      expect(result.enable_client_messages).toBe(true);
    });

    it("accepts webhooks as a string", () => {
      const result = createApplicationScheme.parse({
        name: "String Webhooks",
        webhooks: "https://example.com/webhook",
      });

      expect(result.webhooks).toBe("https://example.com/webhook");
    });

    it("fails when name is missing", () => {
      const result = createApplicationScheme.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe("updateApplicationScheme", () => {
    it("parses partial update payloads", () => {
      const result = updateApplicationScheme.parse({
        enabled: false,
        max_event_batch_size: "15",
      });

      expect(result.enabled).toBe(false);
      expect(result.max_event_batch_size).toBe(15);
    });

    it("allows empty update", () => {
      const result = updateApplicationScheme.parse({});
      expect(result).toEqual({});
    });

    it("does not require name for updates", () => {
      const result = updateApplicationScheme.safeParse({ enabled: true });
      expect(result.success).toBe(true);
    });
  });

  describe("deleteApplicationScheme", () => {
    it("parses valid delete payload", () => {
      const result = deleteApplicationScheme.parse({
        ids: ["app-1", "app-2"],
      });

      expect(result.ids).toEqual(["app-1", "app-2"]);
    });

    it("fails when ids array is empty", () => {
      const result = deleteApplicationScheme.safeParse({ ids: [] });
      expect(result.success).toBe(false);
    });

    it("fails when ids is missing", () => {
      const result = deleteApplicationScheme.safeParse({});
      expect(result.success).toBe(false);
    });
  });
});
