require("dotenv").config();

const express = require("express");

const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const pool = require("../db");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

router.get("/testing", auth, async (req, res) => {
  try {
    res.send("users controller works");
  } catch (error) {
    console.log(error);
    res.send("There's an error");
  }
});

// Login
router.post(
  "/login",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password.").isLength({ min: 12 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // 1. Destructure the body
      const { email, password } = req.body;
      // 2. Find if user exists
      const userInDB = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      if (userInDB.rows.length === 0) {
        return res
          .status(400)
          .json({ status: "error", message: "User is not found" });
      }
      // 3. If user exists, compare hash in DB with password input

      const validPassword = await bcrypt.compare(
        password,
        userInDB.rows[0].password
      );

      if (!validPassword) {
        return res
          .status(401)
          .json({ status: "error", message: "Password incorrect" });
      }
      // 4. If password is correct, create payload and sign token.

      const payload = {
        id: userInDB.rows[0].user_id,
        email: userInDB.rows[0].email,
        username: userInDB.rows[0].username,
        isAdmin: userInDB.rows[0].isadmin,
      };

      const access = jwt.sign(payload, process.env.ACCESS_SECRET, {
        expiresIn: "30m",
        jwtid: uuidv4(),
      });

      const refresh = jwt.sign(payload, process.env.REFRESH_SECRET, {
        expiresIn: "30d",
        jwtid: uuidv4(),
      });

      const response = { access, refresh };
      const updateLastLogin = await pool.query(
        `UPDATE users SET last_login = current_timestamp WHERE email='${email}'`
      );
      res.json(response);
    } catch (error) {
      console.log("POST /login", error);
      res.status(400).json({ status: "error", message: "Login failed" });
    }
  }
);

// Create a user
router.post(
  "/createuser",
  [
    check("email", "Please enter valid email").isEmail(),
    check("password", "Please enter valid password").isLength({ min: 12 }),
    check("password1", "Please enter valid password1").isLength({ min: 12 }),
    check("username", "User name field is required").not().isEmpty(),
    check("musictype", "Music field is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ Status: "error", error: errors.array() });
    }
    try {
      const {
        username,
        password,
        password1,
        email,
        contact,
        musictype,
        location,
      } = req.body;
      const existingUser = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      // console.log(existingUser.rows);
      // find if user exists or password inputs match
      if (existingUser.rows.length !== 0 || password !== password1) {
        console.log(
          "Error: Email address is already used or password inputs do not match"
        );
        return res.status(400).json({
          status: "error",
          message:
            "Email address is already used or password inputs do not match",
        });
      }

      const hash = await bcrypt.hash(password, 12);
      const newUser = await pool.query(
        "INSERT INTO users (username, password, email, contact, musictype, location) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
        [username, hash, email, contact, musictype, location]
      );

      res.json(newUser.rows);
    } catch (error) {
      console.log("POST /createuser", error);
      res
        .status(400)
        .json({ status: "error", message: "An error has occured" });
    }
  }
);

//////////////////////////////////////////////////////////////////////////////////
// Seed Users (For developer use)
// Uncomment below to seed users without hashed password for developer use
//////////////////////////////////////////////////////////////////////////////////

router.post("/seedusers", auth, async (req, res) => {
  try {
    const seedUsers = await pool.query(
      "INSERT INTO users (username, password, email, contact, musictype, location) VALUES('Tester1', 'helloworld12', 'tester1@gmail.com', 'tester1.socialmediapage.com', 'Guitarist', 'North'), ('Tester2','helloworld12', 'tester2@gmail.com', 'tester2.socialmediapage2.com', 'Keyboardist', 'South'), ('Tester3', 'helloworld12', 'tester3@gmail.com', 'tester3.socialmediapage3.com', 'Drummer', 'East'), ('Tester4', 'helloworld12', 'tester4@gmail.com', 'tester4.socialmediapage4', 'Bassist', 'West'), ('Tester5', 'helloworld12', 'tester5@gmail.com', 'tester5.socialmediapage5.com', 'Vocalist', 'Central'), ('Tester6', 'helloworld12', 'tester6@gmail.com', 'tester6.socialmediapage6.com', 'Wind Instruments', 'Central') RETURNING *"
    );

    res.json(seedUsers.rows);
  } catch (error) {
    console.log("POST /seedusers ", error);
    res.status(400).json({ status: "error", message: "An error has occured" });
  }
});

// Get all users
router.get("/allusers", auth, async (req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users");
    res.json(allUsers.rows);
  } catch (error) {
    console.log("GET /users", error);
    res.status(403).json({ status: "error", message: "An error has occured" });
  }
});

// Get one user
router.get("/getuser", auth, async (req, res) => {
  try {
    const loggedInUser = req.decoded.id;

    const getUser = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      loggedInUser,
    ]);
    console.log(loggedInUser);
    res.json(getUser.rows[0]);
  } catch (error) {
    console.log("GET /getuser", error);
    res
      .status(400)
      .json({ status: "error", message: "Error with displaying user" });
  }
});

// Update User
router.put(
  "/updateuser",
  auth,
  [
    check("password", "Please enter valid password").isLength({ min: 12 }),
    check("password1", "Please enter valid password1").isLength({ min: 12 }),
    check("username", "User name field is required").not().isEmpty(),
    check("musictype", "Music field is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ Status: "error", error: errors.array() });
    }
    try {
      const loggedInUser = req.decoded.id;
      const { username, musictype, password, contact, location } = req.body;
      const hash = await bcrypt.hash(password, 12);
      const updateUser = await pool.query(
        "UPDATE users SET username=$1, musictype = $2, password = $3, contact = $4, location =$5 WHERE user_id =$6",
        [username, musictype, hash, contact, location, loggedInUser]
      );
      res.json(updateUser.command);
    } catch (error) {
      console.log("PUT /updateuser", error);
      res
        .status(400)
        .json({ status: "error", message: "An error has occurred" });
    }
  }
);

// Delete a User
router.delete("/deleteuser", auth, async (req, res) => {
  if (req.decoded.isAdmin === true) {
    try {
      const { email } = req.body;
      const deleteUser = await pool.query(
        `DELETE FROM users WHERE email = '${email}'`
      );
      res.json(deleteUser.command);
    } catch (error) {
      console.log("DELETE /deleteuser", error);
      res
        .status(400)
        .json({ status: "error", message: "An error has occured" });
    }
  } else {
    console.log("Not authorized, please contact administrator");
    res.status(403).json({
      status: "error",
      message: "Not authorized, please contact administrator",
    });
  }
});

//////////////////////////////////////////////////
// Search User Based on music role in users table
//////////////////////////////////////////////////

router.post("/getuserbyrole", auth, async (req, res) => {
  try {
    const { musictype } = req.body;
    const getUserByRole = await pool.query(
      `SELECT username, musictype, contact, location FROM users WHERE musictype = '${musictype}'`
    );

    res.json(getUserByRole.rows);
  } catch (error) {
    console.log("POST /getuserbyrole", error);
    res.status(400).json({ status: "error", message: "An error has occured" });
  }
});

//////////////////////////////////////////////
// Search User Based on genre in songs table
/////////////////////////////////////////////

router.post("/getuserbysonggenre", auth, async (req, res) => {
  try {
    const { genre } = req.body;
    const getUserBySongGenre = await pool.query(
      `SELECT username, musictype, location, contact, genre FROM users INNER JOIN songs ON users.email = songs.email WHERE genre='${genre}'`
    );
    res.json(getUserBySongGenre.rows);
  } catch (error) {
    console.log("POST /getuserbysonggenre", error);
    res.status(400).json({ status: "error", message: "An error has occured" });
  }
});

//////////////////////////////////////////////
// Search User Based on lyrics in songs table
//////////////////////////////////////////////

router.post("/getuserbysonglyrics", auth, async (req, res) => {
  try {
    const { lyrics } = req.body;
    if (lyrics !== "") {
      const getUserBySongLyrics = await pool.query(
        // `SELECT username, musictype, location, contact, title, array_to_string(lyrics, ',') FROM users INNER JOIN songs ON users.email = songs.email WHERE array_to_string(lyrics, ',') LIKE '%${lyrics}%'`
        `SELECT username, musictype, location, contact, title FROM users INNER JOIN songs ON users.email = songs.email WHERE array_to_string(lyrics, ',') LIKE '%${lyrics}%'`
      );
      res.json(getUserBySongLyrics.rows);
    }
  } catch (error) {
    console.log("POST /getuserbysonglyrics", error);
    res.status(400).json({ status: "error", message: "An error has occured" });
  }
});

//////////////////////////////////////////////////
// Search User Based on song title in songs table
//////////////////////////////////////////////////

router.post("/getuserbysongtitle", auth, async (req, res) => {
  try {
    const { title } = req.body;
    if (title !== "") {
      const getUserBySongTitle = await pool.query(
        `SELECT username, musictype, location, contact, title FROM users INNER JOIN songs ON users.email = songs.email WHERE title LIKE '%${title}%'`
      );
      res.json(getUserBySongTitle.rows);
    }
  } catch (error) {
    console.log("POST /getuserbysongtitle", error);
    res.status(400).json({ status: "error", message: "An error has occured" });
  }
});

///////////////////////////////////////////////////////////////////////////////////
// Add User Matches into Matches Column (requires another table Work in progress)

// router.post("/addmatches/:email", auth, async (req, res) => {
//   try {
//     const { email } = req.params;

//     const userMatchDetails = await pool.query(
//       "SELECT username, musictype, location, contact FROM users WHERE email = $1",
//       [email]
//     );

//     console.log(userMatchDetails.rows);
//     const loggedInUser = req.decoded.id;
//     console.log(loggedInUser);
//     const addUserToMatches = await pool.query(
//       "UPDATE users SET matches = $1 WHERE user_id = $2",
//       [userMatchDetails.rows, loggedInUser]
//     );
//     res.json(addUserToMatches.rows);
//   } catch (error) {
//     console.log("POST /addmatches", error);
//     res.status(400).json({ status: "error", message: "An error has occured" });
//   }
// });

// Delete user match from matches column
// router.delete("/deletematches/:email", auth, async (req, res) => {
//   try {
//     const { email } = req.params;

//     const loggedInUser = req.decoded.id;
//     console.log(loggedInUser);
//     const removeUserFromMatches = await pool.query(
//       "UPDATE users SET matches = $1 WHERE user_id = $2",
//       [{}, loggedInUser]
//     );
//     res.json(removeUserFromMatches);
//   } catch (error) {
//     console.log("POST /addmatches", error);
//     res.status(400).json({ status: "error", message: "An error has occured" });
//   }
// });

// Get user matches (object passed as string into matches array)
// router.get("/getmatches", auth, async (req, res) => {
//   try {
//     const loggedInUser = req.decoded.id;
//     console.log(loggedInUser);
//     const getUserMatches = await pool.query(
//       "SELECT matches FROM users WHERE user_id = $1",
//       [loggedInUser]
//     );
//     console.log(getUserMatches.rows[0]);
//     // const newJSON = getUserMatches.rows[0].matches.replace(/\"/g, "");
//     const newJSON = JSON.parse(getUserMatches.rows[0].matches);
//     res.json(newJSON);
//   } catch (error) {
//     console.log("POST /addmatches", error);
//     res.status(400).json({ status: "error", message: "An error has occured" });
//   }
// });

module.exports = router;
