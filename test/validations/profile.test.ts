import { describe, it, expect } from "vitest";
import { updateProfileScheme } from "../../server/validations/profile/updateProfileScheme";
import { changePasswordScheme } from "../../server/validations/profile/changePasswordScheme";

describe("Profile Validation Schemas", () => {
  describe("updateProfileScheme", () => {
    it("parses valid profile update payload", () => {
      const result = updateProfileScheme.parse({
        name: "John Doe",
        email: "john@example.com",
      });

      expect(result.name).toBe("John Doe");
      expect(result.email).toBe("john@example.com");
    });

    it("trims whitespace from name", () => {
      const result = updateProfileScheme.parse({
        name: "  John Doe  ",
        email: "john@example.com",
      });

      expect(result.name).toBe("John Doe");
    });

    it("fails when name is too short", () => {
      const result = updateProfileScheme.safeParse({
        name: "AB",
        email: "john@example.com",
      });
      expect(result.success).toBe(false);
    });

    it("fails when name is too long", () => {
      const result = updateProfileScheme.safeParse({
        name: "A".repeat(256),
        email: "john@example.com",
      });
      expect(result.success).toBe(false);
    });

    it("fails with invalid email", () => {
      const result = updateProfileScheme.safeParse({
        name: "John Doe",
        email: "not-an-email",
      });
      expect(result.success).toBe(false);
    });

    it("fails with extra fields (strict mode)", () => {
      const result = updateProfileScheme.safeParse({
        name: "John Doe",
        email: "john@example.com",
        role: "admin",
      });
      expect(result.success).toBe(false);
    });

    it("fails when required fields are missing", () => {
      const result = updateProfileScheme.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe("changePasswordScheme", () => {
    it("parses valid password change payload", () => {
      const result = changePasswordScheme.parse({
        currentPassword: "oldpassword123",
        newPassword: "newpassword123",
        confirmPassword: "newpassword123",
      });

      expect(result.currentPassword).toBe("oldpassword123");
      expect(result.newPassword).toBe("newpassword123");
      expect(result.confirmPassword).toBe("newpassword123");
    });

    it("accepts revokeOtherSessions flag", () => {
      const result = changePasswordScheme.parse({
        currentPassword: "oldpassword123",
        newPassword: "newpassword123",
        confirmPassword: "newpassword123",
        revokeOtherSessions: true,
      });

      expect(result.revokeOtherSessions).toBe(true);
    });

    it("fails when passwords do not match", () => {
      const result = changePasswordScheme.safeParse({
        currentPassword: "oldpassword123",
        newPassword: "newpassword123",
        confirmPassword: "differentpassword",
      });

      expect(result.success).toBe(false);
    });

    it("fails when current password is too short", () => {
      const result = changePasswordScheme.safeParse({
        currentPassword: "short",
        newPassword: "newpassword123",
        confirmPassword: "newpassword123",
      });

      expect(result.success).toBe(false);
    });

    it("fails when new password is too short", () => {
      const result = changePasswordScheme.safeParse({
        currentPassword: "oldpassword123",
        newPassword: "short",
        confirmPassword: "short",
      });

      expect(result.success).toBe(false);
    });

    it("fails when confirm password is too short", () => {
      const result = changePasswordScheme.safeParse({
        currentPassword: "oldpassword123",
        newPassword: "newpassword123",
        confirmPassword: "short",
      });

      expect(result.success).toBe(false);
    });

    it("fails when required fields are missing", () => {
      const result = changePasswordScheme.safeParse({});
      expect(result.success).toBe(false);
    });
  });
});
