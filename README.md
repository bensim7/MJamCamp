# MJamCamp

## Description

MJamCamp (MJC) is a song tracker and user match app.

---

## App Function / User Stories

A user can create or write songs into the application, and recall back the songs from the database through search. Based on the song content that the users write, users can be searched by other users via lyrics, title etc.
Users can also search for other users based on music interest such as Guitarist, Drummer, Bassist, Vocalist, Keyboardist etc.

---

## Technologies Used

PERN Stack is used
Postgresql
Express
React
Node.js
Local Storage

Bootstrap  
eg. Bootstrap Modals, Buttons, Bootstrap Grids

---

## Challenges

1. Coming from MERN Stack previously, a initial challenge was setting up the database tables, and implementing Postgres query languge into the REST API routes in express.

2. Since the app allows users to search other users based on their song content, the columns of the user table is searched with the content of the song table. This was resolved via primary key and foreign key, and innering joining the 2 tables on the key.

---

## Database Set up

![Database](/README_img/Database.jpg)

---

## Codes

![ViewUser1](/README_img/ViewUser1.jpg)

![ViewUser1](/README_img/ViewUser2.jpg)

![SearchUserSongGenre](/README_img/SearchUserSongGenre.jpg)

![SearchUserSongLyrics](/README_img/SearchUserSongLyrics.jpg)

![SearchUserSongTitle](/README_img/SearchUserSongTitle.jpg)
