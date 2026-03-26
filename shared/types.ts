export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface App {
  id: string;
  name: string;
  key: string;
  secret: string;
  max_connections: number;
  enable_client_messages: number;
  enabled: boolean;
  webhooks: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  app_id: string;
  channel: string;
  event: string;
  payload: string;
  created_at: string;
}
