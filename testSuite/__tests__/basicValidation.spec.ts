import axios from "axios";

describe("Basic Validation tests", () => {
  test("basic ip test", async () => {
    const response = await axios("https://www.icanhazip.com");
    expect(response.status).toEqual(200);
    expect(response.data).toBeDefined();
  });
});
