import knex, { type Knex } from "knex";
import type { Application } from "#shared/types";

/**
 * @typedef {Object} Application
 * @property {string} id
 * @property {string} name
 * @property {string} key
 * @property {string} secret
 * @property {number} max_connections
 * @property {boolean} enable_client_messages
 * @property {boolean} enabled
 * @property {number} max_backend_events_per_sec
 * @property {number} max_client_events_per_sec
 * @property {number} max_read_req_per_sec
 * @property {string} webhooks
 * @property {number} max_presence_members_per_channel
 * @property {number} max_presence_member_size_in_kb
 * @property {number} max_channel_name_length
 * @property {number} max_event_channels_at_once
 * @property {number} max_event_name_length
 * @property {number} max_event_payload_in_kb
 * @property {number} max_event_batch_size
 * @property {boolean} enable_user_authentication
 * @property {string} created_at
 * @property {string} updated_at
 * @property {string} user_id
 * @property {User} user
 *
 * @returns {Knex.QueryBuilder<Application, {}>}
 */
export const Applications = () => knex<Application>("sktp_applications");
