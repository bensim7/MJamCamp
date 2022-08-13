require("dotenv").config();

// set-up express
const express = require("express");
const app = express();
const cors = require("cors");

// database
const pool = require("./db");

// middleware
// cors
app.use(cors());
// body parser
app.use(express.json()); //this passes raw html body
app.use(express.urlencoded({ extended: false })); // this passes urlencoded data like arrays, objects

// controller
const usersController = require("./controller/users");
app.use("/users", usersController);
const songsController = require("./controller/songs");
app.use("/songs", songsController);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on Port: ${PORT}`));
