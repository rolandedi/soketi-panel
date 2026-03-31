import { describe, it, expect } from "vitest";
import { broadcastScheme } from "../../server/validations/playground/broadcastScheme";

describe("Playground Validation Schemas", () => {
  describe("broadcastScheme", () => {
    it("parses valid broadcast payload", () => {
      const result = broadcastScheme.parse({
        app_id: "app-123",
        channel: "my-channel",
        event: "my-event",
        payload: '{"message": "hello"}',
      });

      expect(result.app_id).toBe("app-123");
      expect(result.channel).toBe("my-channel");
      expect(result.event).toBe("my-event");
      expect(result.payload).toBe('{"message": "hello"}');
    });

    it("fails when app_id is missing", () => {
      const result = broadcastScheme.safeParse({
        channel: "my-channel",
        event: "my-event",
        payload: '{"message": "hello"}',
      });
      expect(result.success).toBe(false);
    });

    it("fails when channel is empty", () => {
      const result = broadcastScheme.safeParse({
        app_id: "app-123",
        channel: "",
        event: "my-event",
        payload: '{"message": "hello"}',
      });
      expect(result.success).toBe(false);
    });

    it("fails when event is empty", () => {
      const result = broadcastScheme.safeParse({
        app_id: "app-123",
        channel: "my-channel",
        event: "",
        payload: '{"message": "hello"}',
      });
      expect(result.success).toBe(false);
    });

    it("fails when payload is empty", () => {
      const result = broadcastScheme.safeParse({
        app_id: "app-123",
        channel: "my-channel",
        event: "my-event",
        payload: "",
      });
      expect(result.success).toBe(false);
    });

    it("fails when all fields are missing", () => {
      const result = broadcastScheme.safeParse({});
      expect(result.success).toBe(false);
    });
  });
});
