import { afterAll } from "vitest";

/**
 * Test setup for Vitest
 * This file runs before all tests
 */

// Mock console.error during tests to avoid noise
const originalConsoleError = console.error;
console.error = (...args) => {
  // Only log errors that are not expected during tests
  if (args[0]?.toString().includes("CSRF") || args[0]?.toString().includes("Rate limit")) {
    originalConsoleError(...args);
  }
};

// Cleanup after all tests
afterAll(() => {
  // Reset console.error
  console.error = originalConsoleError;
});
