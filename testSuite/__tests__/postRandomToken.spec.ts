require("dotenv").config({ path: ".env" });
import axios, { AxiosRequestConfig } from "axios";
const devTestLink = "https://dannygoldsmithmagic.com/_functions-dev";

jest.setTimeout(15000);

describe("Post Random Token Test Suite", () => {
  let config: AxiosRequestConfig = { params: {}, headers: {} };

  beforeEach(() => {
    config.url = `${devTestLink}/randomToken`;
    config.method = "POST";
    config.params.email = "jameshrivnak4@gmail.com";
    config.headers.Authorization = process.env.WIX_API_KEY;
  });

  test("should post a random token where one doesn't exist", async () => {
    expect(true).toBeTruthy();
  });

  test.only("it should throw a 500 error when no credentials are provided", async () => {
    delete config.headers.Authorization;
    try {
      expect(await axios(config)).toThrowError();
    } catch(err) {
      expect(err.response.data.error).toBeDefined();
      expect(err.response.status).toBe(500);
    }
  });

  test("it should throw an error when a discordId is already registered", async () => {
    try {
      expect(await axios(config)).toThrowError();
    } catch (err) {
      expect(err.response.data.error).toBeDefined();
      expect(err.response.data.error).toBe(
        "The user with the email jameshrivnak4@gmail.com is already registered."
      );
      expect(err.response.status).toEqual(400);
    }
  });
});
