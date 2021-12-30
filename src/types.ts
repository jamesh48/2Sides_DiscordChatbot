import {
  AwsAPIKey,
  CodeFromDiscord,
  DiscordChannelsStr,
  DiscordId,
  RouteCommand,
  TempRandToken,
  UserEmail
} from "staticTypes";

/**
 * The incoming request, created via API Gateway request templates.
 */
export interface DiscordEventRequest {
  // For Command Lambda and Endpoint Lambda
  // POST Requests.
  json: DiscordJson;
  // Access Code Route (GET Request); (event.code)
  code: CodeFromDiscord;
  // Verification Route (GET Request); (event.tempRandToken, event.email, event.discordId)
  tempRandToken: TempRandToken;
  email: UserEmail;
  discordId: DiscordId;
  // For CommandLambda only event.routeCommand->
  routeCommand: RouteCommand;
}

/**
 * The actual Discord request data.
 */
export interface DiscordJson {
  data?: DiscordRequestData;
}

/**
 * The data in the Discord request. Should be handled for actually parsing commands.
 */
export interface DiscordRequestData {
  command: RouteCommand;
  email: UserEmail;
  discordId: DiscordId;
  apiKey: AwsAPIKey;
  channels: DiscordChannelsStr;
}

/**
 * The response to send back for a Discord request.
 */
export type DiscordEventResponse = string;
