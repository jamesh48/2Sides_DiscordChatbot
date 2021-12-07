export const validationLink = (
  discordId: string,
  email: string,
  tempRandToken: string
) => {
  // @ts-ignore, undefined only in local env
  const { APIGatewayURL } = JSON.parse(process.env.SECRET_URLS);
  return `${APIGatewayURL}?discordId=${discordId}&email=${email}&tempRandToken=${tempRandToken}`;
};
