import knex, { type Knex } from "knex";

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {boolean} emailVerified
 * @property {string} image
 * @property {string} createdAt
 * @property {string} updatedAt
 *
 * @returns {Knex.QueryBuilder<User, {}>}
 */
export const Users = () => knex("sktp_users");
