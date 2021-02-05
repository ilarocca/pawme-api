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
});

const serializePreferences = (preferences) => ({
  location: xss(preferences.location),
  distance: preferences.distance,
  type: xss(preferences.type),
});

const camelAnimal = (animal) => ({
  id: animal.id,
  userId: animal.user_id,
  name: xss(animal.name),
  email: xss(animal.email),
  phone: animal.phone,
  location: xss(animal.location),
  //sometimes petApi returns 'young' 'old' for age
  age: xss(animal.age),
  url: xss(animal.url),
  img: xss(animal.img),
  interest: animal.interest,
  dateCreated: animal.date_created,
});

const serializeAnimal = (animal) => ({
  user_id: animal.userId,
  name: xss(animal.name),
  email: xss(animal.email),
  phone: xss(animal.phone),
  location: xss(animal.location),
  //sometimes petApi returns 'young' 'old' for age
  age: xss(animal.age),
  url: xss(animal.url),
  img: xss(animal.img),
  interest: animal.interest,
});

module.exports = {
  camelUser,
  serializeUser,
  camelPreferences,
  serializePreferences,
  camelAnimal,
  serializeAnimal,
};
