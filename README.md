# MJamCamp

## Description

MJamCamp (MJC) is a song tracker and user match app.

---

## App Function / User Stories

- The app has a login function, which will open up the other pages that enables users to enter songs, search for songs they have entered and or search for other users.

- On login, the user is shown their account details, which they can update.

- A user can create or write songs into the application. For their songs that the user has entered, the user can view it through database search, update the songs, and delete them from the database

- Based on the song content that the users write, users can be searched by other users via lyrics, title etc. Users can also search for other users based on music interest such as Guitarist, Drummer, Bassist, Vocalist, Keyboardist etc.

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

# Planning and Development Process

- After determining the idea and wireframe of the app,planning of the database set up
- Setting up of API routes and cross checking with postman and pgAdmin 4
- Check database for bugs
- Create Front end with react, fetching of data via API to the backend
- Check front end for bugs and CSS
- Check application as a whole

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

---

## Potential Future Goals

- Speech-to-text for create song lyrics input
- Saving of Users into favorites list and chatting with the saved user in the list, via messages or chat.
