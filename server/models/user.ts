import knex, { type Knex } from "knex";
import type { User } from "#shared/types";

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {boolean} emailVerified
 * @property {string|null} image
 * @property {string} role
 * @property {boolean} banned
 * @property {string|null} banReason
 * @property {string|null} banExpires
 * @property {string} createdAt
 * @property {string|null} updatedAt
 *
 * @returns {Knex.QueryBuilder<User, {}>}
 */
export const Users = () => knex<User>("sktp_users");
