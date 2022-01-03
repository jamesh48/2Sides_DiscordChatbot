import { DiscordEventRequest } from "types/types";

export const routePath = (event: DiscordEventRequest) => {
  let routeCommand: string = "";
  let commandMethod: string = "";
  let protectedRoute: boolean = false;

  if (event.json?.data?.command === "enableNewChannels") {
    routeCommand = "enableNewChannels";
    commandMethod = "POST";
    protectedRoute = true;
  } else if (event.json?.data?.command === "kick") {
    routeCommand = "kick";
    commandMethod = "POST";
    protectedRoute = true;
  } else if (event.json?.data?.command === "badge") {
    routeCommand = "badge";
    commandMethod = "POST";
    protectedRoute = true;
  } else if (event.json?.data?.command === "redeem") {
    routeCommand = "redeem";
    commandMethod = "POST";
  } else if (event.tempRandToken && event.email && event.discordId) {
    routeCommand = "verification";
    commandMethod = "GET";
  } else if (event.json?.data?.command === "registerAdditionalEmail") {
    routeCommand = "registerAdditionalEmail";
    commandMethod = "POST";
  } else if (event.command === "registrationPortal") {
    routeCommand = "registrationPortal";
    commandMethod = "GET";
    // Todo- Change this to event.command in discord (requires changing the embed as well).
  } else if (event.command === "accessCode") {
    routeCommand = "accessCode";
    commandMethod = "GET";
  } else if (event.json?.data?.command === "automationFailAlert") {
    routeCommand = "automationFailAlert";
    commandMethod = "POST";
    protectedRoute = true;
  } else {
    throw new Error("Not a valid path");
  }
  return [routeCommand, commandMethod, protectedRoute];
};
