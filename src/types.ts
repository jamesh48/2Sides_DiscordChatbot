import {
  AwsAPIKey,
  CodeFromDiscord,
  DiscordChannelsStr,
  DiscordId,
  RouteCommand,
  UserEmail
} from "staticTypes";

/**
 * The available secrets for our Discord server.
 */
export interface DiscordSecrets {
  discordPublicKey: string;
  authToken: string;
  serverId: string;
}

/**
 * A server role assigned to a user.
 */
export interface DiscordRole {
  id: string;
  name: string;
  color: number;
  hoist: boolean;
  mentionable: boolean;
}

/**
 * A Discord member and their properties.
 */
export interface DiscordMember {
  deaf: boolean;
  roles: string[];
  user: DiscordUser;
}

/**
 * The user information for a Discord member.
 */
export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
}

/**
 * The incoming request, created via API Gateway request templates.
 */
export interface DiscordEventRequest {
  json: DiscordJson;
  // Custom Added--->
  routeCommand: RouteCommand;
  code: CodeFromDiscord;
  email: UserEmail;
  discordId: DiscordId;
  channels: DiscordChannelsStr;
  apiKey: AwsAPIKey;
  tempRandToken: string;
}

/**
 * The actual Discord request data.
 */
export interface DiscordJson {
  id?: string;
  token?: string;
  data?: DiscordRequestData;
  member?: DiscordMember;
  user?: DiscordUser;
  type: number;
  version: number;
}

/**
 * The data in the Discord request. Should be handled for actually parsing commands.
 */
export interface DiscordRequestData {
  id: string;
  name: string;
  command: string;
  email: string;
  apiKey: string;
  channels: string;
  discordId: string;
  options?: DiscordRequestDataOption[];
}

/**
 * The name and value for a given command option if available.
 */
export interface DiscordRequestDataOption {
  name: string;
  value: string;
}

/**
 * The response to send back for a Discord request.
 */
export interface DiscordEventResponse {
  type: number;
  data?: DiscordResponseData;
}

/**
 * The actual response data that will be used in the resulting Discord message.
 */
export interface DiscordResponseData {
  tts: boolean;
  content: string;
  embeds: any[];
  /* eslint-disable camelcase */
  allowed_mentions: string[];
  /* eslint-enable camelcase */
}

export type Channel = {
  id: string;
  name: string;
};
