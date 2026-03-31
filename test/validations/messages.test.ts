import { describe, it, expect } from "vitest";
import { deleteMessagesScheme } from "../../server/validations/messages/deleteMessagesScheme";

describe("Message Validation Schemas", () => {
  describe("deleteMessagesScheme", () => {
    it("parses valid delete payload with multiple IDs", () => {
      const result = deleteMessagesScheme.parse({
        ids: ["msg-1", "msg-2", "msg-3"],
      });

      expect(result.ids).toEqual(["msg-1", "msg-2", "msg-3"]);
    });

    it("parses valid delete payload with single ID", () => {
      const result = deleteMessagesScheme.parse({
        ids: ["msg-1"],
      });

      expect(result.ids).toEqual(["msg-1"]);
    });

    it("fails when ids array is empty", () => {
      const result = deleteMessagesScheme.safeParse({ ids: [] });
      expect(result.success).toBe(false);
    });

    it("fails when ids is missing", () => {
      const result = deleteMessagesScheme.safeParse({});
      expect(result.success).toBe(false);
    });

    it("fails when ids contains empty strings", () => {
      const result = deleteMessagesScheme.safeParse({
        ids: ["msg-1", "", "msg-3"],
      });
      expect(result.success).toBe(false);
    });

    it("fails when ids is not an array", () => {
      const result = deleteMessagesScheme.safeParse({
        ids: "msg-1",
      });
      expect(result.success).toBe(false);
    });
  });
});
