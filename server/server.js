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
//////////////////////////
// Routes
//////////////////////////

// Create a user
// app.post("/createuser", async (req, res) => {
//   try {
//     const { username, password, email, musictype, location } = req.body;
//     // const existingUser = await pool.query(
//     //   "SELECT * FROM users WHERE email = $1",
//     //   [email]
//     // );
//     // console.log(existingUser);
//     // if (existingUser) {
//     //   return res
//     //     .status(400)
//     //     .json({ status: "error", message: "Duplicate Username" });
//     // }

//     const newUser = await pool.query(
//       "INSERT INTO users (username, password, email, musictype, location, last_login) VALUES($1, $2, $3, $4, $5, current_timestamp) RETURNING *",
//       [username, password, email, musictype, location]
//     );

//     res.json(newUser.rows);
//   } catch (error) {
//     res.json(error.message);
//   }
// });
// // Get all users
// app.get("/allusers", async (req, res) => {
//   try {
//     const allUsers = await pool.query("SELECT * FROM users");
//     res.json(allUsers.rows);
//   } catch (error) {
//     res.json(error.message);
//   }
// });
// // Get one user
// app.get("/getuser", async (req, res) => {
//   try {
//     const { username } = req.body;
//     // const getUser = await pool.query(
//     //   "SELECT IFNULL((SELECT * FROM users WHERE username = $1, $2), 'not found') ",
//     //   [username]
//     // );
//     // const { nullsoerror } = "not found";
//     // const getUser = await pool.query(
//     //   "SELECT IFNULL((SELECT * FROM users WHERE username = $1), '$2') ",
//     //   [username, nullsoerror]
//     // );

//     const getUser = await pool.query(
//       "SELECT * FROM users WHERE username = $1",
//       [username]
//     );
//     res.json(getUser.rows);
//   } catch (error) {
//     console.log("GET /getuser", error);
//     res.json(error.message);
//   }
// });
// // Update User
// app.put("/updateuser", async (req, res) => {
//   try {
//     const { email } = req.body;
//     const { musictype, password, location } = req.body;
//     const updateUser = await pool.query(
//       "UPDATE users SET musictype = $1, password = $2, location =$3 WHERE email =$4",
//       [musictype, password, location, email]
//     );
//     res.json(updateUser.command);
//   } catch (error) {
//     console.log(error.message);
//   }
// });

// // Delete a User
// app.delete("/deleteuser", async (req, res) => {
//   try {
//     const { email } = req.body;
//     const deleteUser = await pool.query(
//       `DELETE FROM users WHERE email = '${email}'`
//     );
//     res.json(deleteUser.command);
//   } catch (error) {
//     console.log(error.message);
//   }
// });

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on Port: ${PORT}`));
