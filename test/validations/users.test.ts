import { describe, it, expect } from "vitest";
import { createUserScheme } from "../../server/validations/users/createUserScheme";
import { updateUserScheme } from "../../server/validations/users/updateUserScheme";
import { banUserScheme } from "../../server/validations/users/banUserScheme";
import { unbanUserScheme } from "../../server/validations/users/unbanUserScheme";

describe("User Validation Schemas", () => {
  describe("createUserScheme", () => {
    it("parses valid user creation payload", () => {
      const result = createUserScheme.parse({
        name: "John Doe",
        email: "john@example.com",
        role: "user",
        password: "securepassword123",
      });

      expect(result.name).toBe("John Doe");
      expect(result.email).toBe("john@example.com");
      expect(result.role).toBe("user");
      expect(result.password).toBe("securepassword123");
    });

    it("accepts admin role", () => {
      const result = createUserScheme.parse({
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
        password: "securepassword123",
      });

      expect(result.role).toBe("admin");
    });

    it("fails when name is too short", () => {
      const result = createUserScheme.safeParse({
        name: "AB",
        email: "test@example.com",
        role: "user",
        password: "securepassword123",
      });

      expect(result.success).toBe(false);
    });

    it("fails when name is too long", () => {
      const result = createUserScheme.safeParse({
        name: "A".repeat(256),
        email: "test@example.com",
        role: "user",
        password: "securepassword123",
      });

      expect(result.success).toBe(false);
    });

    it("fails with invalid email", () => {
      const result = createUserScheme.safeParse({
        name: "John Doe",
        email: "not-an-email",
        role: "user",
        password: "securepassword123",
      });

      expect(result.success).toBe(false);
    });

    it("fails with invalid role", () => {
      const result = createUserScheme.safeParse({
        name: "John Doe",
        email: "john@example.com",
        role: "superadmin",
        password: "securepassword123",
      });

      expect(result.success).toBe(false);
    });

    it("fails when password is too short", () => {
      const result = createUserScheme.safeParse({
        name: "John Doe",
        email: "john@example.com",
        role: "user",
        password: "short",
      });

      expect(result.success).toBe(false);
    });

    it("fails when required fields are missing", () => {
      const result = createUserScheme.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe("updateUserScheme", () => {
    it("parses full update payload", () => {
      const result = updateUserScheme.parse({
        name: "Updated Name",
        email: "updated@example.com",
        role: "admin",
        banned: true,
        banReason: "Spam",
        banExpires: "2026-12-31",
      });

      expect(result.name).toBe("Updated Name");
      expect(result.email).toBe("updated@example.com");
      expect(result.role).toBe("admin");
      expect(result.banned).toBe(true);
      expect(result.banReason).toBe("Spam");
      expect(result.banExpires).toBe("2026-12-31");
    });

    it("parses partial update payload", () => {
      const result = updateUserScheme.parse({
        name: "New Name",
      });

      expect(result.name).toBe("New Name");
      expect(result.email).toBeUndefined();
      expect(result.role).toBeUndefined();
    });

    it("allows empty update", () => {
      const result = updateUserScheme.parse({});
      expect(result).toEqual({});
    });

    it("accepts null for banReason and banExpires", () => {
      const result = updateUserScheme.parse({
        banReason: null,
        banExpires: null,
      });

      expect(result.banReason).toBeNull();
      expect(result.banExpires).toBeNull();
    });

    it("fails when name is too short", () => {
      const result = updateUserScheme.safeParse({ name: "AB" });
      expect(result.success).toBe(false);
    });

    it("fails with invalid email format", () => {
      const result = updateUserScheme.safeParse({ email: "not-email" });
      expect(result.success).toBe(false);
    });

    it("fails with invalid role", () => {
      const result = updateUserScheme.safeParse({ role: "moderator" });
      expect(result.success).toBe(false);
    });
  });

  describe("banUserScheme", () => {
    it("parses valid ban payload", () => {
      const result = banUserScheme.parse({
        userId: "user-123",
        banned: true,
        banReason: "Abusive behavior",
        banExpires: "2026-06-01",
      });

      expect(result.userId).toBe("user-123");
      expect(result.banned).toBe(true);
      expect(result.banReason).toBe("Abusive behavior");
      expect(result.banExpires).toBe("2026-06-01");
    });

    it("parses ban payload without optional fields", () => {
      const result = banUserScheme.parse({
        userId: "user-456",
        banned: true,
      });

      expect(result.userId).toBe("user-456");
      expect(result.banReason).toBeUndefined();
      expect(result.banExpires).toBeUndefined();
    });

    it("accepts null for banReason and banExpires", () => {
      const result = banUserScheme.parse({
        userId: "user-789",
        banned: false,
        banReason: null,
        banExpires: null,
      });

      expect(result.banReason).toBeNull();
      expect(result.banExpires).toBeNull();
    });

    it("fails when userId is missing", () => {
      const result = banUserScheme.safeParse({ banned: true });
      expect(result.success).toBe(false);
    });

    it("fails when banned is missing", () => {
      const result = banUserScheme.safeParse({ userId: "user-123" });
      expect(result.success).toBe(false);
    });

    it("fails when banReason exceeds 255 characters", () => {
      const result = banUserScheme.safeParse({
        userId: "user-123",
        banned: true,
        banReason: "A".repeat(256),
      });

      expect(result.success).toBe(false);
    });
  });

  describe("unbanUserScheme", () => {
    it("parses valid unban payload", () => {
      const result = unbanUserScheme.parse({
        userId: "user-123",
      });

      expect(result.userId).toBe("user-123");
    });

    it("fails when userId is missing", () => {
      const result = unbanUserScheme.safeParse({});
      expect(result.success).toBe(false);
    });
  });
});
