# Pawme

> A match-making application for foster animals.

This repo is the back-end for Pawme. You can see the app live at [https://pawme-client.vercel.app/](https://pawme-client.vercel.app/)

The app was designed with both mobile and desktop viewing in mind.

To check out the app, you can either sign up or select the demo account.

## Demo

<p><a href="https://pawme-client.vercel.app/" target="_blank">Live Link</a></p>

## Introduction

Finding the perfect pet can be overwhelming. Pawme leaves it up to chance and instinct. You can then save the animals you're interested in and reach out to the shelter to discuss the details.

## In Action

![](https://media.giphy.com/media/2nG2DUnSjmmpBtLtYx/giphy.gif)

## API Overview

```text
/api
.
├── /auth
│   └── GET
│       ├── /current-user
│   └── POST
│       └── /login
|
├── /users
|   └── POST
|       ├── /
│   └── GET
|       ├── /:user_id/preferences
│   └── PATCH
│       └── /:user_id/preferences
│   └── GET
│       ├── /:user_id/animals
│   └── POST
│       ├── /:user_id/animals/:pet_id
│   └── DELETE
|       └── /:user_id/animals/:pet_id
|
├── /animals
│   └── POST
│       ├── /


```

### POST `/api/auth/login`

```js
// req.body
{
  username: String,
  password: String
}

// res.body
{
  user: {
  id: Number,
  name: String,
  username: String,
  email: String,
  dateCreated: Number,
  }
  authToken: String
}
```

### GET `/api/auth/current-user`

```js
// req.header
Authorization: Bearer ${token}

// res.body
{
  user: {
  id: Number,
  name: String,
  username: String,
  email: String,
  dateCreated: Number,
  }
}
```

### POST `/api/users`

```js
// req.body
{
  user: {
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  }
}

// req.body
{
  user: {
  id: Number,
  name: String,
  username: String,
  email: String,
  dateCreated: Number,
  }
  authToken: String
}
```

### GET `/api/users/:user_id/preferences`

```js
// req.header
Authorization: Bearer ${token}

//req.body
{
  userId: Number
}

// res.body
{
  preferences: {
  userId: Number,
  location: String,
  distance: Number,
  type: String,
  size: String,
  age: String,
  gender: String,
  goodWithChildren: Boolean,
  goodWithDogs: Boolean,
  goodWithCats: Boolean,
  houseTrained: Boolean,
  declawed: Boolean,
  specialNeeds: Boolean,
  }
}
```

### PATCH `/api/users/:user_id/preferences`

```js
// req.header
Authorization: Bearer ${token}

//req.body
{
  preferences: {
  userId: Number,
  location: String,
  distance: Number,
  type: String,
  size: String,
  age: String,
  gender: String,
  goodWithChildren: Boolean,
  goodWithDogs: Boolean,
  goodWithCats: Boolean,
  houseTrained: Boolean,
  declawed: Boolean,
  specialNeeds: Boolean,
  }
}

// res.body
{
  preferences: {
  userId: Number,
  location: String,
  distance: Number,
  type: String,
  size: String,
  age: String,
  gender: String,
  goodWithChildren: Boolean,
  goodWithDogs: Boolean,
  goodWithCats: Boolean,
  houseTrained: Boolean,
  declawed: Boolean,
  specialNeeds: Boolean,
  }
}
```

### GET `/api/users/:user_id/animals`

```js
// req.header
Authorization: Bearer ${token}

//req.body
{
  userId: Number
}

// res.body
{
  interested:{
  id: Number,
  petId: Number,
  name: String,
  email: String,
  phone: String,
  location: String,
  age: Number,
  url: String,
  img: String,
  description: String,
  dateCreated: String,
  }
  all: {
  userId: Number,
  petId: Number,
  interested: Boolean,
  }
}
```

### POST `/api/users/:user_id/animals/:pet_id`

```js
// req.header
Authorization: Bearer ${token}

//req.body
{
  userAnimal: {
  userId: Number,
  petId: Number,
  interested: Boolean,
  }
}

// res.body
{
  userAnimal: {
  userId: Number,
  petId: Number,
  interested: Boolean,
  }
}
```

### DELETE `/api/users/:user_id/animals/:pet_id`

```js
// req.header
Authorization: Bearer ${token}

//req.body
{
  userId: Number
}
```

### POST `/api/animals/`

```js
// req.header
Authorization: Bearer ${token}

//req.body
{
  animal: {
  id: Number,
  petId: Number,
  name: String,
  email: String,
  phone: String,
  location: String,
  age: Number,
  url: String,
  img: String,
  description: String,
  }
}
```

## Technology

#### Back End

- Node and Express
  - Authentication via JWT
  - RESTful Api
- Testing
  - Supertest (integration)
  - Mocha and Chai (unit)
- Database
  - Postgres
  - Knex.js - SQL wrapper

#### Testing

- Supertest (integration)

* Mocha and Chai (unit)

#### Production

- Deployed via Heroku
