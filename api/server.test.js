const serverFile = require("./server");
const request = require("supertest");
const db = require("../data/dbConfig");
const DataOps = require("./DataOps");
const jwt = require("jsonwebtoken");
const ENV_JWT_SECRET = process.env.ENV_JWT_SECRET || "openplz";

// Write your tests here
test("sanity", () => {
  expect(true).toBe(true);
});

let server;

const generateToken = (user) => {
  const payload = {
    sub: user.id,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
  };

  const options = {};

  return jwt.sign(payload, ENV_JWT_SECRET, options);
};

describe("endpoint tests", () => {
  beforeEach(async () => {
    await db.migrate.rollback(); // Rollback migrations to reset the database
    await db.migrate.latest();
    server = serverFile.listen("3000");
    await db.seed.run();
  });

  describe("[GET] Jokes endpoint", () => {
    it("[1] retrives jokes on request with successful token", async () => {
      // generate valid token
      const token = generateToken({ id: 3 });
      console.log(token);

      const jokeGetResponse = await request(server)
        .get("/api/jokes")
        .set("Authorization", `Bearer ${token}`);

      expect(jokeGetResponse.body).toHaveLength(3 /* Length of jokeData*/);
    });

    it("[2] rejects missing token with appropriate error message", async () => {
      const response = await request(server)
        .get("/api/jokes")
        .set("Authorization", "Bearer");
      expect(response.status).toBe(401);
      const responseBody = JSON.parse(response.text);
      expect(responseBody).toStrictEqual({ message: "token required" });
    });
  });

  describe("[POST] Register endpoint", () => {
    it("[3] creates a new user in the database", async () => {
      const req = {
        username: "sHarry",
        password: "sPotter",
      };

      await request(server).post("/api/auth/register").send(req);

      const userArray = await DataOps.findUsers();
      const user = userArray.find((user) => user.username === req.username);
      expect(user).toBeTruthy();
    });
    it("[4] handles for an already existing username", async () => {
      const req = {
        username: "Tallboi",
        password: 1234,
      };

      const response = await request(server)
        .post("/api/auth/register")
        .send(JSON.stringify(req));

      expect(response.status).toBe(400);
    });
  });

  describe("[POST] Login endpoint", () => {
    it("[5] rejects bad password or username", async () => {
      const req = {
        username: "Midway upon our life's journey",
        password: '34525',
      };

      const response = await request(server)
        .post("/api/auth/login")
        .send(req);

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch('invalid credentials')
    });

    it("[6] returns token on successful request", async () => {
      const req = {
        username: "bobo",
        password: "foo"
      }

      await request(server)
      .post("/api/auth/register")
      .send(req);

      const userArray = await DataOps.findUsers()
      const [user] = userArray.filter((user) => {
        if (user.username === "bob") {
          return user;
        }
      });

      const response = await request(server)
      .post("/api/auth/login")
      .send(req);

      expect(response.body.token).toBeTruthy();
    });
  });

  afterEach(() => {
    server.close();
  });
});
