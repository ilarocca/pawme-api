const bcrypt = require("bcryptjs");

const UsersService = {
  validateUserField(newUser) {
    const response = {};
    const validations = {
      name: this.validateName,
      username: this.validateUserName,
      password: this.validatePassword,
    };

    // run validation on each field, if error occurs at any point,
    // field name and error message get added to response
    for (const [field, validation] of Object.entries(validations)) {
      let result = validation(newUser[field]);
      if (result.error) {
        response[field] = result.error;
        response.error = true;
      }
    }

    return response;
  },
  validateName(name) {
    const response = {};
    if (name.length < 2 || name.length > 35) {
      response.error = "Must be between 2 and 35 characters";
    }
    return response;
  },
  validateUserName(username) {
    const response = {};
    if (username.length < 4 || username.length > 25) {
      response.error = "Username must be between 4 and 25 characters";
    }
    return response;
  },
  validatePassword(password) {
    const response = {};
    if (password.length < 4) {
      response.error = "Password must be at least 4 characters";
    }
    return response;
  },
  hashPassword(password) {
    return bcrypt.hashSync(password, 10);
  },
  getAllUsers(knex) {
    return knex.select("*").from("users");
  },
  getByUsername(knex, username) {
    return knex("users").where({ username }).first("*");
  },
  getById(knex, id) {
    return knex.from("users").select("*").where("id", id).first();
  },
  insertUser(knex, newUser) {
    return knex
      .insert(newUser)
      .into("users")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  insertUserPreferences(knex, newUserPreferences) {
    return knex
      .insert(newUserPreferences)
      .into("preferences")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  updatePreference(knex, user_id, newPreferences) {
    return knex("preferences")
      .where({ user_id })
      .update(newPreferences)
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  getAllUserAnimals(knex, id) {
    return knex.from("animals").select("*").where("user_id", id);
  },
  deleteNotInterested(knex, id) {
    return knex("animals")
      .where("user_id", id)
      .where("interest", false)
      .delete();
  },
};

module.exports = UsersService;
