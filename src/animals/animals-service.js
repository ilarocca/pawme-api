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
  getUserAnimal(knex, user_id, animal_id) {
    return knex
      .from("animals")
      .select("*")
      .where("user_id", user_id)
      .where("id", animal_id)
      .first();
  },
  deleteAnimal(knex, id) {
    return knex("animals").where({ id }).delete();
  },
};

module.exports = AnimalsService;
