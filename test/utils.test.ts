import { describe, it, expect, vi, afterAll } from "vitest";

// Mock console to avoid noise during tests
const originalWarn = console.warn;
console.warn = vi.fn();

describe("Utility Functions", () => {
  describe("cn (className merger)", () => {
    it("should merge class names correctly", async () => {
      // Import dynamically to avoid Nuxt auto-import issues
      const { cn } = await import("../app/lib/utils");

      expect(cn("foo", "bar")).toBe("foo bar");
      expect(cn("foo", null, "bar")).toBe("foo bar");
      expect(cn("foo", undefined, "bar")).toBe("foo bar");
    });

    it("should handle conditional classes", async () => {
      const { cn } = await import("../app/lib/utils");

      const isActive = true;
      const isDisabled = false;

      expect(
        cn(
          "base-class",
          isActive && "active-class",
          isDisabled && "disabled-class",
        ),
      ).toBe("base-class active-class");
    });

    it("should handle twMerge for conflicting classes", async () => {
      const { cn } = await import("../app/lib/utils");

      // tailwind-merge should handle conflicting classes
      expect(cn("px-2", "px-4")).toBe("px-4");
    });
  });
});

describe("Validation Helpers", () => {
  it("should have validation utilities", async () => {
    // This test verifies the test infrastructure works
    const utils = await import("../server/lib/utils");

    expect(utils.validateWith).toBeDefined();
    expect(utils.createValidationError).toBeDefined();
    expect(utils.logError).toBeDefined();
  });
});

// Restore console
afterAll(() => {
  console.warn = originalWarn;
});
