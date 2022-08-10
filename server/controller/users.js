require("dotenv").config();

const express = require("express");

const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const pool = require("../db");
const auth = require("../middleware/auth");

router.get("/testing", async (req, res) => {
  try {
    res.send("users controller works");
  } catch (error) {
    console.log(error);
    res.send("There's an error");
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    // 1. Destructure the body
    const { email, password } = req.body;
    // 2. Find if user exists
    const userInDB = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

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
    console.log("POST /users/login " + error);
    res.status(400).json({ status: "error", message: "Login failed" });
  }
});

// Create a user
router.post("/createuser", async (req, res) => {
  try {
    const { username, password, password1, email, musictype, location } =
      req.body;
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    console.log(existingUser.rows); // find if user exists or password inputs match
    if (existingUser.rows.length !== 0 || password !== password1) {
      return res.status(400).json({
        status: "error",
        message: "Duplicate Username or password inputs do not match",
      });
    }

    const hash = await bcrypt.hash(password, 12);
    const newUser = await pool.query(
      "INSERT INTO users (username, password, email, musictype, location) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [username, hash, email, musictype, location]
    );

    res.json(newUser.rows);
  } catch (error) {
    console.log("POST /create ", error);
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
    // const getUser = await pool.query(
    //   "SELECT IFNULL((SELECT * FROM users WHERE username = $1, $2), 'not found') ",
    //   [username]
    // );
    // const { nullsoerror } = "not found";
    // const getUser = await pool.query(
    //   "SELECT IFNULL((SELECT * FROM users WHERE username = $1), '$2') ",
    //   [username, nullsoerror]
    // );

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
router.put("/updateuser", auth, async (req, res) => {
  try {
    const loggedInUser = req.decoded.id;
    const { musictype, password, location } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const updateUser = await pool.query(
      "UPDATE users SET musictype = $1, password = $2, location =$3 WHERE user_id =$4",
      [musictype, hash, location, loggedInUser]
    );
    res.json(updateUser.command);
  } catch (error) {
    console.log("PUT /updateuser ", error);
    res.status(400).json({ status: "error", message: "An error has occurred" });
  }
});

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
      console.log(error.message);
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

module.exports = router;
