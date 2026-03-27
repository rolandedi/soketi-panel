import { describe, it, expect, beforeEach, vi } from "vitest";
import { UserRepository } from "../../server/repositories/user.repository";
import { User } from "../../server/models/user";

// Mock the User model and auth
vi.mock("../../server/models/user", () => ({
  User: {
    paginate: vi.fn(),
    find: vi.fn(),
  },
}));

vi.mock("../../server/lib/auth", () => ({
  auth: {
    api: {
      createUser: vi.fn(),
      updateUser: vi.fn(),
      removeUser: vi.fn(),
      banUser: vi.fn(),
      unbanUser: vi.fn(),
    },
  },
}));

describe("UserRepository", () => {
  let repository: UserRepository;

  beforeEach(() => {
    repository = new UserRepository();
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return paginated users with default parameters", async () => {
      const mockUsers = [
        { id: "1", email: "test1@example.com", name: "Test 1" },
        { id: "2", email: "test2@example.com", name: "Test 2" },
      ];

      vi.mocked(User.paginate).mockResolvedValue({
        data: mockUsers,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      });

      const result = await repository.getAll();

      expect(User.paginate).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual({
        data: mockUsers,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      });
    });

    it("should return paginated users with custom parameters", async () => {
      const mockUsers = [
        { id: "3", email: "test3@example.com", name: "Test 3" },
      ];

      vi.mocked(User.paginate).mockResolvedValue({
        data: mockUsers,
        pagination: {
          page: 2,
          limit: 5,
          total: 6,
          totalPages: 2,
        },
      });

      const result = await repository.getAll(2, 5);

      expect(User.paginate).toHaveBeenCalledWith(2, 5);
      expect(result.pagination).toEqual({
        page: 2,
        limit: 5,
        total: 6,
        totalPages: 2,
      });
    });
  });

  describe("getById", () => {
    it("should return a user by ID", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        role: "admin",
      };

      vi.mocked(User.find).mockResolvedValue(mockUser);

      const result = await repository.getById("user-123");

      expect(User.find).toHaveBeenCalledWith("user-123");
      expect(result).toEqual(mockUser);
    });

    it("should return undefined if user not found", async () => {
      vi.mocked(User.find).mockResolvedValue(undefined);

      const result = await repository.getById("non-existent-id");

      expect(User.find).toHaveBeenCalledWith("non-existent-id");
      expect(result).toBeUndefined();
    });
  });

  describe("create", () => {
    it("should create a user with default role", async () => {
      const mockCreatedUser = {
        id: "new-user-123",
        email: "newuser@example.com",
        name: "New User",
        role: "user",
      };

      vi.mocked(User.create).mockResolvedValue(mockCreatedUser);

      const result = await repository.create({
        email: "newuser@example.com",
        password: "password123",
        name: "New User",
      });

      expect(User.create).toHaveBeenCalledWith({
        email: "newuser@example.com",
        password: "password123",
        name: "New User",
      });
      expect(result).toEqual(mockCreatedUser);
    });

    it("should create a user with custom role", async () => {
      const mockCreatedUser = {
        id: "admin-user-123",
        email: "admin@example.com",
        name: "Admin User",
        role: "admin",
      };

      vi.mocked(User.create).mockResolvedValue(mockCreatedUser);

      const result = await repository.create({
        email: "admin@example.com",
        password: "password123",
        name: "Admin User",
        role: "admin",
      });

      expect(User.create).toHaveBeenCalledWith({
        email: "admin@example.com",
        password: "password123",
        name: "Admin User",
        role: "admin",
      });
      expect(result).toEqual(mockCreatedUser);
    });
  });

  describe("ban", () => {
    it("should ban a user with reason and expiration", async () => {
      const mockBanResult = { success: true };
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      vi.mocked(User.ban).mockResolvedValue(mockBanResult);

      const result = await repository.ban(
        "user-123",
        true,
        "Violation of terms",
        expiresAt.toISOString(),
      );

      expect(User.ban).toHaveBeenCalledWith(
        "user-123",
        true,
        "Violation of terms",
        expiresAt.toISOString(),
      );
      expect(result).toEqual(mockBanResult);
    });

    it("should unban a user", async () => {
      const mockUnbanResult = { success: true };

      vi.mocked(User.unban).mockResolvedValue(mockUnbanResult);

      const result = await repository.ban("user-123", false);

      expect(User.unban).toHaveBeenCalledWith("user-123", false);
      expect(result).toEqual(mockUnbanResult);
    });
  });
});
