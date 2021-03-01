const path = require("path");
const express = require("express");
const UsersService = require("./users-service");
const AuthService = require("../auth/auth-service");
const { requireAuth } = require("../middleware/jwt-auth");
const {
  serializeUser,
  camelUser,
  serializePreferences,
  camelPreferences,
  camelAnimal,
  serializeUserAnimal,
  camelUserAnimal,
} = require("../helpers/serialize");

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter.route("/").post(jsonParser, (req, res, next) => {
  const { name, username, email, password } = req.body;
  // serialize camelCase to db syntax & sanitize
  const newUser = serializeUser({ name, username, email, password });

  for (const [key, value] of Object.entries(newUser)) {
    if (value == null) {
      return res.status(400).json({
        error: { message: `Missing '${key}' in request body` },
      });
    }
  }

  //Validate
  const response = UsersService.validateUserField(newUser);
  if (response.error) {
    return res.status(400).json({ error: response });
  }

  //Check if username is available
  UsersService.getByUsername(req.app.get("db"), newUser.username).then(
    (user) => {
      if (user) {
        return res.json({
          status: 400,
          message: "Username is already in user",
        });
      }
    }
  );

  //Hash password
  newUser.password = UsersService.hashPassword(newUser.password);

  //Insert & Generate authToken
  UsersService.insertUser(req.app.get("db"), newUser)
    .then((user) => {
      const subject = user.username;
      const payload = { user_id: user.id };
      const authToken = AuthService.generateAuthToken(subject, payload);

      //create preference row for newUser
      const newUserPreferences = {
        user_id: user.id,
        location: "",
        distance: null,
        type: "",
        size: "",
        age: "",
        gender: "",
        good_with_children: false,
        good_with_dogs: false,
        good_with_cats: false,
        house_trained: false,
        declawed: false,
        special_needs: false,
      };
      const userPreferences = UsersService.insertUserPreferences(
        req.app.get("db"),
        newUserPreferences
      );

      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${user.id}`))
        .json({ user: camelUser(user), authToken: authToken });
    })
    .catch(next);
});

usersRouter
  .route("/:user_id/preferences")
  .all(requireAuth, (req, res, next) => {
    if (parseInt(req.user.id) !== parseInt(req.params.user_id)) {
      return res.status(401).json({
        error: { message: "Unauthorized request." },
      });
    }
    UsersService.getById(req.app.get("db"), req.params.user_id)
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            error: { message: `User doesn't exist` },
          });
        }
        req.user = user;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    UsersService.getUserPreferences(req.app.get("db"), req.params.user_id)
      .then((preferences) => {
        res.status(200).json(preferences);
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const {
      location,
      distance,
      type,
      size,
      age,
      gender,
      goodWithChildren,
      goodWithDogs,
      goodWithCats,
      houseTrained,
      declawed,
      specialNeeds,
    } = req.body;
    const preferenceToUpdate = serializePreferences({
      location,
      distance,
      type,
      size,
      age,
      gender,
      goodWithChildren,
      goodWithDogs,
      goodWithCats,
      houseTrained,
      declawed,
      specialNeeds,
    });

    UsersService.updatePreference(
      req.app.get("db"),
      req.params.user_id,
      preferenceToUpdate
    )
      .then((numRowsAffected) => {
        res
          .status(202)
          .json({ preferences: camelPreferences(preferenceToUpdate) });
      })
      .catch(next);
  });

usersRouter
  .route("/:user_id/animals")
  .all(requireAuth, (req, res, next) => {
    if (parseInt(req.user.id) !== parseInt(req.params.user_id)) {
      return res.status(401).json({
        error: { message: "Unauthorized request." },
      });
    }
    next();
  })
  .get((req, res, next) => {
    UsersService.getInterestedUserAnimals(req.app.get("db"), req.params.user_id)
      .then((animals) => {
        UsersService.getAllUserAnimals(
          req.app.get("db"),
          req.params.user_id
        ).then((all) => {
          res.status(200).json({
            interested: animals.map(camelAnimal),
            all: all.map(camelUserAnimal),
          });
        });
      })
      .catch(next);
  })
  //used to reset/show not interested animals
  .delete((req, res, next) => {
    UsersService.deleteNotInterested(req.app.get("db"), req.params.user_id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

usersRouter
  .route("/:user_id/animals/:pet_id")
  .all(requireAuth, (req, res, next) => {
    if (parseInt(req.user.id) !== parseInt(req.params.user_id)) {
      return res.status(401).json({
        error: { message: "Unauthorized request." },
      });
    }
    next();
  })
  .post(jsonParser, (req, res, next) => {
    const { userId, petId, interested } = req.body;
    const newUserAnimal = serializeUserAnimal({ userId, petId, interested });
    if (parseInt(req.user.id) !== parseInt(userId)) {
      return res.status(401).json({
        error: { message: "Unauthorized request." },
      });
    }

    UsersService.insertUserAnimal(req.app.get("db"), newUserAnimal)
      .then((userAnimal) => {
        res.status(201).json(camelUserAnimal(userAnimal));
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const pet_id = parseInt(req.params.pet_id);
    const user_id = req.params.user_id;
    UsersService.deleteUserAnimal(req.app.get("db"), user_id, pet_id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = usersRouter;
