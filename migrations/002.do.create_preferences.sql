CREATE TABLE preferences ( 
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, 
  location VARCHAR(300), 
  distance INTEGER, 
  type VARCHAR(75)
);