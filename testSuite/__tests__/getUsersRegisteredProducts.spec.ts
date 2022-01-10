require("dotenv").config({ path: ".env" });
import axios, { AxiosRequestConfig } from "axios";
const devTestLink = "https://dannygoldsmithmagic.com/_functions-dev";

jest.setTimeout(10000);

xdescribe("Get users registered products", () => {
  let config: AxiosRequestConfig = { params: {}, headers: {} };
  beforeEach(() => {
    // reset database
    config.method = "GET";
    config.url = `${devTestLink}/usersRegisteredProducts`;
    config.params.email = "jameshrivnak4@gmail.com";
    config.params.discordId = 12345;
    config.headers.Authorization = process.env.WIX_API_KEY;
  });

  test("it should get unregistered users products", async () => {
    try {
      const response = await axios(config);
      expect(response.status).toEqual(200);
      expect(response.data).toBeDefined();
    } catch (err) {
      expect(true).toBeFalsy();
    }
  });

  test("it should return a 500 error when no credentials are passed", async () => {
    delete config.headers.Authorization;
    try {
      expect(await axios(config)).toThrowError();
    } catch (err) {
      expect(err.response.status).toEqual(500);
    }
  }),
    test("it should return a 400 error when a user is already registered", async () => {
      try {
        expect(await axios(config)).toThrowError();
      } catch (err) {
        expect(err.response.status).toEqual(400);
      }
    });
});
