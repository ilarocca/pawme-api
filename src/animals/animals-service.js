const AnimalsService = {
  insertAnimal(knex, newAnimal) {
    return knex
      .insert(newAnimal)
      .into("animals")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  getAnimal(knex, pet_id) {
    return knex.from("animals").where("pet_id", pet_id).first("*");
  },
  deleteAnimal(knex, id) {
    return knex("animals").where({ id }).delete();
  },
};

module.exports = AnimalsService;
