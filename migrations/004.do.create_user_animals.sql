CREATE TABLE user_animals (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    pet_id INTEGER NOT NULL,
    interested BOOLEAN,
    date_created TIMESTAMPTZ NOT NULL DEFAULT now()
);