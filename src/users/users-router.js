const path = require("path");
const express = require("express");
const UsersService = require("./users-service");
const AuthService = require("../auth/auth-service");
const { requireAuth } = require("../middleware/jwt-auth");
const {
  serializeUser,
  camelUser,
  serializePreferences,
  camelAnimal,
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
  .patch(jsonParser, (req, res, next) => {
    const { location, distance, type } = req.body;
    const preferenceToUpdate = serializePreferences({
      location,
      distance,
      type,
    });

    UsersService.updatePreference(
      req.app.get("db"),
      req.params.user_id,
      preferenceToUpdate
    )
      .then((numRowsAffected) => {
        res.status(204).json({ preferences: preferenceToUpdate }).end();
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
    console.log("PASSSS");
    next();
  })
  .get((req, res, next) => {
    UsersService.getAllUserAnimals(req.app.get("db"), req.params.user_id)
      .then((animals) => {
        res.status(200).json(animals.map(camelAnimal));
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
module.exports = usersRouter;
