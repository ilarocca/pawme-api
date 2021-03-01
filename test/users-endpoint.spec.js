const app = require("../src/app");
const knex = require("knex");
const supertest = require("supertest");
const helpers = require("./test-helpers");
const {
  makeUsersArray,
  makePreferencesObject,
  camelPreferencesObject,
  makeUserAnimalsArray,
  camelUserAnimalsArray,
} = require("./users.fixtures");
const { makeAnimalsArray, camelAnimalsArray } = require("./animals.fixtures");

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
    db.raw("TRUNCATE users, user_animals, animals RESTART IDENTITY CASCADE")
  );

  afterEach("cleanup", () =>
    db.raw("TRUNCATE users, user_animals, animals RESTART IDENTITY CASCADE")
  );

  describe("POST /api/users", () => {
    it("responds with 201 and a new user", () => {
      const newUser = {
        name: "Eman",
        email: "Tasl",
        username: "resu",
        password: "12345",
      };
      return supertest(app)
        .post("/api/users")
        .send(newUser)
        .expect((res) => {
          expect(res.body.user.firstName).to.eql(newUser.firstName);
          expect(res.body.user.lastName).to.eql(newUser.lastName);
          expect(res.body.user.username).to.eql(newUser.username);
          expect(res.body.user).to.have.property("id");
          expect(res.headers.location).to.eql(`/api/users/${res.body.user.id}`);
          const expected = new Intl.DateTimeFormat("en-US").format(new Date());
          const actual = new Intl.DateTimeFormat("en-US").format(
            new Date(res.body.user.dateCreated)
          );
          expect(actual).to.eql(expected);
          expect(res.body).to.have.property("authToken");
        });
    });
  });

  // ~~~~Preferences~~~

  describe(`GET /api/users/:user_id/preferences`, () => {
    context("Given there are preferences and users in the database", () => {
      const testUsers = makeUsersArray();
      const testPreferences = makePreferencesObject;

      beforeEach("insert items", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("preferences").insert(testPreferences);
          });
      });

      it("responds with 200 and the user preferences", () => {
        const userId = 1;
        return supertest(app)
          .get(`/api/users/${userId}/preferences`)
          .set("Content-Type", "application/json")
          .set("Authorization", helpers.createAuthToken(testUsers[0]))
          .expect(200, testPreferences);
      });
    });
  });
  describe(`PATCH /api/users/:user_id/preferences`, () => {
    context("Given there are preferences and users in the database", () => {
      const testUsers = makeUsersArray();
      const testPreferences = makePreferencesObject;

      beforeEach("insert items", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("preferences").insert(testPreferences);
          });
      });

      it("responds with 202 and the user preferences", () => {
        const userId = 1;
        const updatedPreference = camelPreferencesObject;
        updatedPreference.type = "cats";
        return supertest(app)
          .patch(`/api/users/${userId}/preferences`)
          .send(updatedPreference)
          .set("Content-Type", "application/json")
          .set("Authorization", helpers.createAuthToken(testUsers[0]))
          .expect(202, { preferences: updatedPreference });
      });
    });
  });

  // ~~~~User Animals~~~

  describe(`GET /api/users/:user_id/animals`, () => {
    context("Given there are user animals and users in the database", () => {
      const testUsers = makeUsersArray();
      const testUserAnimals = makeUserAnimalsArray();
      const camelAllUserAnimals = camelUserAnimalsArray();
      const testAnimals = makeAnimalsArray();
      const newAnimal = camelAnimalsArray();

      beforeEach("insert users", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("user_animals").insert(testUserAnimals);
          })
          .then(() => {
            return db.into("animals").insert(testAnimals);
          });
      });

      it("responds with 200 and the user animals", () => {
        const userId = 1;
        return supertest(app)
          .get(`/api/users/${userId}/animals`)
          .set("Content-Type", "application/json")
          .set("Authorization", helpers.createAuthToken(testUsers[0]))
          .expect(200)
          .expect((res) => {
            expect(res.body.interested[0].petId).to.eql(newAnimal[0].petId);
            expect(res.body.interested[0].name).to.eql(newAnimal[0].name);
            expect(res.body.interested[0].email).to.eql(newAnimal[0].email);
            expect(res.body.interested[0].phone).to.eql(newAnimal[0].phone);
            expect(res.body.interested[0].location).to.eql(
              newAnimal[0].location
            );
            expect(res.body.interested[0].age).to.eql(newAnimal[0].age);
            expect(res.body.interested[0].url).to.eql(newAnimal[0].url);
            expect(res.body.interested[0].img).to.eql(newAnimal[0].img);
            expect(res.body.interested[0].description).to.eql(
              newAnimal[0].description
            );
            expect(res.body.interested[0]).to.have.property("id");
            const expected = new Intl.DateTimeFormat("en-US").format(
              new Date()
            );
            const actual = new Intl.DateTimeFormat("en-US").format(
              new Date(res.body.interested[0].dateCreated)
            );
            expect(actual).to.eql(expected);
            expect(res.body.all).to.eql(camelAllUserAnimals);
          });
      });
    });
  });

  describe(`DELETE /api/users/:user_id/animals`, () => {
    context("Given there are recipes in the database", () => {
      const testUsers = makeUsersArray();
      const testUserAnimals = makeUserAnimalsArray();

      beforeEach("insert users", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("user_animals").insert(testUserAnimals);
          });
      });

      it("responds with 204 and removes the not interested user animals", () => {
        const userId = 1;
        return supertest(app)
          .delete(`/api/users/${userId}/animals`)
          .set("Content-Type", "application/json")
          .set("Authorization", helpers.createAuthToken(testUsers[0]))
          .expect(204);
      });
    });
  });

  describe("POST /api/users/:user_id/animals/:pet_id", () => {
    const testUsers = makeUsersArray();
    beforeEach("insert users", () => {
      return db.into("users").insert(testUsers);
    });
    it("responds with 201 and a new user animal", () => {
      const newUserAnimal = {
        userId: 1,
        petId: 500334,
        interested: true,
      };
      return supertest(app)
        .post(
          `/api/users/${newUserAnimal.userId}/animals/${newUserAnimal.petId}`
        )
        .set("Authorization", helpers.createAuthToken(testUsers[0]))
        .send(newUserAnimal)
        .expect((res) => {
          console.log(res.body);
          expect(res.body.userId).to.eql(newUserAnimal.userId);
          expect(res.body.petId).to.eql(newUserAnimal.petId);
          expect(res.body.interested).to.eql(newUserAnimal.interested);
        });
    });
  });

  describe(`DELETE /api/user/:user_id/animals/:pet_id`, () => {
    context("Given there are user animals in the database", () => {
      const testUsers = makeUsersArray();
      const testUserAnimals = makeUserAnimalsArray();
      const camelAllUserAnimals = camelUserAnimalsArray();

      beforeEach("insert users", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("user_animals").insert(testUserAnimals);
          });
      });

      it("responds with 204 and removes the user animal", () => {
        const idToRemove = 50629;
        const userId = 1;

        return supertest(app)
          .delete(`/api/users/${userId}/animals/${idToRemove}`)
          .set("Content-Type", "application/json")
          .set("Authorization", helpers.createAuthToken(testUsers[0]))
          .expect(204);
      });
    });
  });
});
