export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;

  role: "admin" | "user";
  banned: boolean;
  banReason: string | null;
  banExpires: string | null;
}

export interface Application {
  id: string;
  name: string;
  key: string;
  secret: string;
  max_connections: number;
  enable_client_messages: boolean;
  enabled: boolean;
  max_backend_events_per_sec: number;
  max_client_events_per_sec: number;
  max_read_req_per_sec: number;
  webhooks: string;
  max_presence_members_per_channel: number;
  max_presence_member_size_in_kb: number;
  max_channel_name_length: number;
  max_event_channels_at_once: number;
  max_event_name_length: number;
  max_event_payload_in_kb: number;
  max_event_batch_size: number;
  enable_user_authentication: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  user?: User;
}

export interface Message {
  id: string;
  app_id: string;
  channel: string;
  event: string;
  payload: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    enabledTotal?: number;
    disabledTotal?: number;
  };
}
