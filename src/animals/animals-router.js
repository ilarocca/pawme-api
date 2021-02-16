const path = require("path");
const express = require("express");
const AnimalsService = require("./animals-service");
const { requireAuth } = require("../middleware/jwt-auth");
const { serializeAnimal, camelAnimal } = require("../helpers/serialize");

const animalsRouter = express.Router();
const jsonParser = express.json();

animalsRouter.route("/").post(requireAuth, jsonParser, (req, res, next) => {
  const {
    petId,
    name,
    email,
    phone,
    location,
    age,
    url,
    img,
    description,
  } = req.body;
  const newAnimal = serializeAnimal({
    petId,
    name,
    email,
    phone,
    location,
    age,
    url,
    img,
    description,
  });

  //if animal already inserted by a user, don't insert
  AnimalsService.getAnimal(req.app.get("db"), petId).then((animal) => {
    console.log(animal);
    if (animal !== undefined) {
      return res.json({ message: "Animal already exists" }).end();
    } else {
      AnimalsService.insertAnimal(req.app.get("db"), newAnimal)
        .then((animal) => {
          res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${animal.id}`))
            .json(camelAnimal(animal));
        })
        .catch(next);
    }
  });
});

// animalsRouter
//   .route("/:user_id/:animal_id")
//   .all(requireAuth, (req, res, next) => {
//     if (parseInt(req.user.id) !== parseInt(req.params.user_id)) {
//       return res.status(401).json({
//         error: { message: "Unauthorized request." },
//       });
//     }
//     AnimalsService.getAnimal(req.app.get("db"), req.params.animal_id)
//       .then((animal) => {
//         if (!animal) {
//           return res.status(404).json({
//             error: { message: `Animal doesn't exist` },
//           });
//         }
//         res.animal = animal;
//         next();
//       })
//       .catch(next);
//   })
//   .delete((req, res, next) => {
//     AnimalsService.deleteAnimal(req.app.get("db"), req.params.animal_id)
//       .then((numRowsAffected) => {
//         res.status(204).end();
//       })
//       .catch(next);
//   });

module.exports = animalsRouter;
