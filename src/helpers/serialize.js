const xss = require("xss");

//keeps json respones camelCase and db underscore_case

const camelUser = (user) => ({
  id: user.id,
  name: xss(user.name),
  username: xss(user.username),
  email: xss(user.email),
  dateCreated: user.date_created,
});

const serializeUser = (user) => ({
  name: xss(user.name),
  username: xss(user.username),
  email: xss(user.email),
  password: xss(user.password),
});

const camelPreferences = (preferences) => ({
  userId: preferences.user_id,
  location: xss(preferences.location),
  distance: preferences.distance,
  type: xss(preferences.type),
  size: xss(preferences.size),
  age: xss(preferences.age),
  gender: xss(preferences.gender),
  goodWithChildren: preferences.good_with_children,
  goodWithDogs: preferences.good_with_dogs,
  goodWithCats: preferences.good_with_cats,
  houseTrained: preferences.house_trained,
  declawed: preferences.declawed,
  specialNeeds: preferences.special_needs,
});

const serializePreferences = (preferences) => ({
  location: xss(preferences.location),
  distance: preferences.distance,
  type: xss(preferences.type),
  size: xss(preferences.size),
  age: xss(preferences.age),
  gender: xss(preferences.gender),
  good_with_children: preferences.goodWithChildren,
  good_with_dogs: preferences.goodWithDogs,
  good_with_cats: preferences.goodWithCats,
  house_trained: preferences.houseTrained,
  declawed: preferences.declawed,
  special_needs: preferences.specialNeeds,
});

const camelAnimal = (animal) => ({
  id: animal.id,
  petId: animal.pet_id,
  name: xss(animal.name),
  email: xss(animal.email),
  phone: animal.phone,
  location: xss(animal.location),
  //petApi returns 'young' 'old' for age
  age: xss(animal.age),
  url: xss(animal.url),
  img: xss(animal.img),
  description: animal.description,
  dateCreated: animal.date_created,
});

const serializeAnimal = (animal) => ({
  pet_id: animal.petId,
  name: xss(animal.name),
  email: xss(animal.email),
  phone: xss(animal.phone),
  location: xss(animal.location),
  //petApi returns 'young' 'old' for age
  age: xss(animal.age),
  url: xss(animal.url),
  img: xss(animal.img),
  description: animal.description,
});

const camelUserAnimal = (userAnimal) => ({
  userId: userAnimal.user_id,
  petId: userAnimal.pet_id,
  interested: userAnimal.interested,
});

const serializeUserAnimal = (userAnimal) => ({
  user_id: userAnimal.userId,
  pet_id: userAnimal.petId,
  interested: userAnimal.interested,
});

module.exports = {
  camelUser,
  serializeUser,
  camelPreferences,
  serializePreferences,
  camelAnimal,
  serializeAnimal,
  camelUserAnimal,
  serializeUserAnimal,
};
