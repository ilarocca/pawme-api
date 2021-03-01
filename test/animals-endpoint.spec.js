const app = require("../src/app");
const knex = require("knex");
const supertest = require("supertest");
const helpers = require("./test-helpers");
const { makeUsersArray } = require("./users.fixtures");
const { makeAnimalsArray } = require("./animals.fixtures");
const { expect } = require("chai");

describe("Users Endpoint", () => {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () =>
    db.raw("TRUNCATE users, animals RESTART IDENTITY CASCADE")
  );

  afterEach("cleanup", () =>
    db.raw("TRUNCATE users, animals RESTART IDENTITY CASCADE")
  );

  describe("POST /api/animals", () => {
    context("Given there are users in the db", () => {
      const testUsers = makeUsersArray();
      const testAnimals = makeAnimalsArray();
      // const camelAnimals = camelAnimalsArray();

      beforeEach("insert users", () => {
        return db.into("users").insert(testUsers);
      });

      it("responds with 201 and a new animal", () => {
        const newAnimal = {
          petId: 502229,
          name: "foo bark",
          email: "shelter@gmail.com",
          phone: "301-339-9922",
          location: "Virginia",
          age: "young",
          url: "shelter.com",
          img: "foo-bark-pic.com",
          description: "foo bark is cute",
        };
        return supertest(app)
          .post("/api/animals")
          .set("Content-Type", "application/json")
          .set("Authorization", helpers.createAuthToken(testUsers[0]))
          .send(newAnimal)
          .expect(201)
          .expect((res) => {
            expect(res.body.petId).to.eql(newAnimal.petId);
            expect(res.body.name).to.eql(newAnimal.name);
            expect(res.body.email).to.eql(newAnimal.email);
            expect(res.body.phone).to.eql(newAnimal.phone);
            expect(res.body.location).to.eql(newAnimal.location);
            expect(res.body.age).to.eql(newAnimal.age);
            expect(res.body.url).to.eql(newAnimal.url);
            expect(res.body.img).to.eql(newAnimal.img);
            expect(res.body.description).to.eql(newAnimal.description);
            expect(res.body).to.have.property("id");
            expect(res.headers.location).to.eql(`/api/animals/${res.body.id}`);
            const expected = new Intl.DateTimeFormat("en-US").format(
              new Date()
            );
            const actual = new Intl.DateTimeFormat("en-US").format(
              new Date(res.body.dateCreated)
            );
            expect(actual).to.eql(expected);
          });
      });
    });
  });
});
