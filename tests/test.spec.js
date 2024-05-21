const request = require("supertest");
const app = require("../app");

const db = require("../db");

async function clearDB() {
  await db.query("DELETE FROM bugs");
  await db.query("DELETE FROM users");
}

beforeAll(async () => {
  await clearDB();
});

afterAll(async () => {
  await db.end();
});

let accessToken;

describe("Route /auth", () => {
  it("POST /register", async () => {
    return request(app)
      .post("/auth/register")
      .send({
        firstName: "Pawel",
        secondName: "Jablko",
        email: "example@mail.com",
        password: "ExamplePassword",
      })
      .expect(200);
  });

  it("POST /register FAIL if exist", async () => {
    return request(app)
      .post("/auth/register")
      .send({
        firstName: "Pawel",
        secondName: "Jablko",
        email: "example@mail.com",
        password: "ExamplePassword",
      })
      .expect(409);
  });

  it("POST /login", async () => {
    return request(app)
      .post("/auth/login")
      .send({
        email: "example@mail.com",
        password: "ExamplePassword",
      })
      .expect(200)
      .then(({ body }) => {
        accessToken = body.accessToken;
      });
  });

  it("POST /login FAIL if incorrect password", async () => {
    return request(app)
      .post("/auth/login")
      .send({
        email: "example@mail.com",
        password: "WrongPassword",
      })
      .expect(400);
  });
});

describe("Route /bugs", () => {
  let bugId;

  it("GET / FAIL NOT AUTHORIZED", async () => {
    return request(app).get("/bugs").expect(401);
  });

  it("POST /create FAIL NOT AUTHORIZED", async () => {
    return request(app)
      .post("/bugs/create")
      .send({
        title: "Bug",
        description: "Some description",
        severity: "low",
      })
      .expect(401);
  });

  it("POST /create", async () => {
    return request(app)
      .post("/bugs/create")
      .set("Authorization", "bearer " + accessToken)
      .send({
        title: "Bug",
        description: "Some description",
        severity: "low",
      })
      .expect(200);
  });

  it("GET /", async () => {
    return request(app)
      .get("/bugs")
      .set("Authorization", "bearer " + accessToken)
      .expect(200)
      .then(({ body }) => {
        expect(body.bugs[0]).toHaveProperty("title", "Bug");
        expect(body.bugs[0]).toHaveProperty("description", "Some description");
        expect(body.bugs[0]).toHaveProperty("severity", "low");
        bugId = body.bugs[0].id;
      });
  });

  it("GET /:id", async () => {
    return request(app)
      .get("/bugs/" + bugId)
      .set("Authorization", "bearer " + accessToken)
      .expect(200)
      .then(({ body }) => {
        expect(body.bug).toHaveProperty("title", "Bug");
        expect(body.bug).toHaveProperty("description", "Some description");
        expect(body.bug).toHaveProperty("severity", "low");
      });
  });

  it("PATCH /:id", async () => {
    return request(app)
      .patch("/bugs/" + bugId)
      .set("Authorization", "bearer " + accessToken)
      .send({
        description: "New description",
      })
      .expect(200)
      .then(() => {
        request(app)
          .get("/bugs/" + bugId)
          .set("Authorization", "bearer " + accessToken)
          .expect(200)
          .then(({ body }) => {
            expect(body.bug).toHaveProperty("title", "Bug");
            expect(body.bug).toHaveProperty("description", "New description");
            expect(body.bug).toHaveProperty("severity", "low");
          });
      });
  });
});

describe("Route /users", () => {
  it("GET /", async () => {
    return request(app)
      .get("/users")
      .set("Authorization", "bearer " + accessToken)
      .expect(200)
      .then(({ body }) => {
        expect(body.users[0]).toHaveProperty("first_name", "Pawel");
        expect(body.users[0]).toHaveProperty("second_name", "Jablko");
        expect(body.users[0]).toHaveProperty("email", "example@mail.com");
      });
  });
});
