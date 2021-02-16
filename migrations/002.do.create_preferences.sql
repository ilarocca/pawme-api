CREATE TABLE preferences ( 
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, 
  location VARCHAR(300), 
  distance VARCHAR(50), 
  type VARCHAR(75), 
  size VARCHAR(75), 
  age VARCHAR(75), 
  gender VARCHAR(75),
  good_with_children BOOLEAN, 
  good_with_dogs BOOLEAN, 
  good_with_cats BOOLEAN, 
  house_trained BOOLEAN, 
  declawed BOOLEAN, 
  special_needs BOOLEAN
);