import knex, { type Knex } from "knex";
import type { Message } from "#shared/types";

/**
 * @typedef {Object} Message
 * @property {string} id
 * @property {string} app_id
 * @property {string} channel
 * @property {string} event
 * @property {string} payload
 * @property {string} created_at
 *
 * @returns {Knex.QueryBuilder<Message, {}>}
 */
export const Messages = () => knex<Message>("sktp_messages");
