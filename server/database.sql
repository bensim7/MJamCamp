CREATE DATABASE mjamcamp;

CREATE EXTENSION if not exists "uuid-ossp";

CREATE TABLE users (
  user_id uuid DEFAULT uuid_generate_v4(),
  username VARCHAR (50) UNIQUE NOT NULL,
  password CHAR(60) NOT NULL,
  email VARCHAR ( 255 ) UNIQUE NOT NULL PRIMARY KEY,
  musictype VARCHAR (50) NOT NULL,
  location VARCHAR (50),
  isadmin BOOLEAN,
  Matches VARCHAR [],
  Messages Text [],
  created_on TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  last_login TIMESTAMP WITH TIME ZONE
);


CREATE TABLE songs (
  song_id serial,
  email VARCHAR(255) REFERENCES users(email),
  title VARCHAR (50) UNIQUE NOT NULL PRIMARY KEY,
  lyrics TEXT NOT NULL,
  chords TEXT,
  genretag VARCHAR [],
  created_on TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  updated_on TIMESTAMP WITH TIME ZONE
);


