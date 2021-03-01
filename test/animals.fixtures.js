function makeAnimalsArray() {
  return [
    {
      pet_id: 50628,
      name: "toby",
      email: "shelter@gmail.com",
      phone: "301-233-3448",
      location: "Maryland",
      age: "young",
      url: "shelter.com",
      img: "img-of-toby.com",
      description: "toby is cute",
    },
    {
      pet_id: 50620,
      name: "mittens",
      email: "shelter@gmail.com",
      phone: "301-233-3463",
      location: "Maryland",
      age: "old",
      url: "shelter.com",
      img: "img-of-mittens.com",
      description: "mittens is cute",
    },
  ];
}

function camelAnimalsArray() {
  return [
    {
      id: 1,
      petId: 50628,
      name: "toby",
      email: "shelter@gmail.com",
      phone: "301-233-3448",
      location: "Maryland",
      age: "young",
      url: "shelter.com",
      img: "img-of-toby.com",
      description: "toby is cute",
      dateCreated: "2029-01-22T16:28:32.615Z",
    },
    {
      id: 2,
      petId: 50620,
      name: "mittens",
      email: "shelter@gmail.com",
      phone: "301-233-3463",
      location: "Maryland",
      age: "old",
      url: "shelter.com",
      img: "img-of-mittens.com",
      description: "mittens is cute",
    },
  ];
}

module.exports = {
  makeAnimalsArray,
  camelAnimalsArray,
};
