function makeUsersArray() {
  return [
    {
      id: 1,
      name: "Jon",
      email: "jon@gmail.com",
      username: "jdoe",
      date_created: "2029-01-22T16:28:32.615Z",
    },
    {
      id: 2,
      name: "Foo",
      email: "foobar@gmail.com",
      username: "fbar",
      date_created: "2100-05-22T16:28:32.615Z",
    },
  ];
}

function camelUsersArray() {
  return [
    {
      id: 1,
      name: "Jon",
      email: "jon@gmail.com",
      username: "jdoe",
      dateCreated: "2029-01-22T16:28:32.615Z",
    },
    {
      id: 2,
      name: "Foo",
      email: "foobar@gmail.com",
      username: "fbar",
      dateCreated: "2100-05-22T16:28:32.615Z",
    },
  ];
}

const makePreferencesObject = {
  user_id: 1,
  location: "Maryland",
  distance: "100",
  type: "dogs",
  size: "small",
  age: "young",
  gender: "male",
  good_with_children: false,
  good_with_dogs: false,
  good_with_cats: false,
  house_trained: false,
  declawed: false,
  special_needs: false,
};

const camelPreferencesObject = {
  location: "Maryland",
  distance: 100,
  type: "dogs",
  size: "small",
  age: "young",
  gender: "male",
  goodWithChildren: false,
  goodWithDogs: false,
  goodWithCats: false,
  houseTrained: false,
  declawed: false,
  specialNeeds: false,
};

function makeUserAnimalsArray() {
  return [
    {
      user_id: 1,
      pet_id: 50628,
      interested: true,
      date_created: "2029-01-22T16:28:32.615Z",
    },
    {
      user_id: 1,
      pet_id: 50629,
      interested: false,
      date_created: "2100-05-22T16:28:32.615Z",
    },
  ];
}

function camelUserAnimalsArray() {
  return [
    {
      userId: 1,
      petId: 50628,
      interested: true,
    },
    {
      userId: 1,
      petId: 50629,
      interested: false,
    },
  ];
}

module.exports = {
  makeUsersArray,
  camelUsersArray,
  makePreferencesObject,
  camelPreferencesObject,
  makeUserAnimalsArray,
  camelUserAnimalsArray,
};
