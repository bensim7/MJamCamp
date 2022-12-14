require("dotenv").config();

const express = require("express");

const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");

router.get("/testing", auth, async (req, res) => {
  try {
    res.send("songs controller works");
  } catch (error) {
    console.log(error);
    res.send("There's an error");
  }
});

// Create a song
router.post("/addsong", auth, async (req, res) => {
  // console.log(`accessing /POST addsong`);
  // console.log(req.decoded);
  // console.log(req.body);
  try {
    const { title, lyrics, chords, genre } = req.body;
    const userEmail = req.decoded.email;
    console.log(userEmail);
    // find if title exists
    const existingTitle = await pool.query(
      "SELECT title FROM songs WHERE title=$1",
      [title]
    );
    // console.log(existingTitle.rows);
    if (existingTitle.rows.length !== 0) {
      return res.status(400).json({
        status: "error",
        message: "Duplicate title, please enter a different title",
        title: existingTitle.rows,
      });
    }

    // if title does not exist, create song
    const newSong = await pool.query(
      "INSERT INTO songs (title, lyrics, chords, genre, email) VALUES($1, $2, $3, $4, $5)",
      [title, lyrics, chords, genre, userEmail]
    );

    res.json(newSong);
  } catch (error) {
    console.log("GET /addsong", error);
    res.status(400).json({ status: "error", message: "An error occurred" });
  }
});

////////////////////////////////////////////////////////
// Seed songs (For developer use)
// Uncomment below to seed songs for developer use
////////////////////////////////////////////////////////

router.post("/seedsongs", auth, async (req, res) => {
  try {
    const seedSongs = await pool.query(
      "INSERT INTO songs (title, lyrics, chords, genre, email) VALUES('Apple Fruit', '{awesome random lyrics test, alright insight}', 'Verse: Am C F G', 'Classic Rock', 'tester1@gmail.com'), ('Best Day To Cycle', '{best random lyrics test}', 'Verse: Am C F G', 'Indie', 'tester1@gmail.com'), ('Climb and Clam', '{climb random lyrics test}', 'Verse: Am C F G', 'Indie', 'tester2@gmail.com'), ('Dive and Damp', '{dive random lyrics test}', 'Verse: Am C F G', 'Classic Rock', 'tester2@gmail.com'), ('Excellent Experiment', '{experiment random lyrics test}', 'Verse: Am C F G', 'Alternative Rock', 'tester3@gmail.com'), ('Fast Flying', '{fast random lyrics test}', 'Verse: Am C F G', 'Grunge', 'tester3@gmail.com'), ('Grandpa', '{grand random lyrics test}', 'Verse: Am C F G', 'Grunge', 'tester5@gmail.com'), ('High Gravel', '{high random lyrics test}', 'Verse: Am C F G', 'Pop', 'tester4@gmail.com'), ('Isometric', '{isometric random lyrics test, isotonic beverage}', 'Verse: Am C F G', 'Pop', 'tester6@gmail.com')"
    );

    res.json(seedSongs);
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "error", message: "An error occurred" });
  }
});

// View all songs
router.get("/allsongs", auth, async (req, res) => {
  const userEmail = req.decoded.email;
  try {
    const allSongs = await pool.query(
      `SELECT * FROM songs WHERE email='${userEmail}'`
    );
    res.json(allSongs.rows);
  } catch (error) {
    console.log("GET /allsongs", error);
    res.status(400).json({ status: "error", message: "An error has occured" });
  }
});

// View one song
router.post("/getsong", auth, async (req, res) => {
  // console.log("view one song");
  // console.log(req.body);
  try {
    const userEmail = req.decoded.email;
    const { title } = req.body;
    if (title !== "") {
      const getSong = await pool.query(
        //   `SELECT * FROM songs WHERE email='${userEmail}' AND title LIKE '%${title}%'`
        `SELECT * FROM songs WHERE email=$1 AND title LIKE '%${title}%'`,
        [userEmail]
      );
      res.json(getSong.rows);
    } else {
      res
        .status(400)
        .json({ status: "error", message: "Please key in an input." });
    }
  } catch (error) {
    console.log("GET /getsong", error);
    res.status(400).json({ status: "error", message: "An error has occured" });
  }
});

// Update song
router.put("/updatesong", auth, async (req, res) => {
  try {
    const userEmail = req.decoded.email;
    const { title, lyrics, chords, genre } = req.body;
    const updateSong = await pool.query(
      "UPDATE songs SET lyrics = $1, chords = $2, genre = $3, updated_on = current_timestamp WHERE email = $4 AND title = $5",
      [lyrics, chords, genre, userEmail, title]
    );
    res.json(updateSong);
  } catch (error) {
    console.log("PUT /updatesong", error);
    res.status(400).json({ status: "error", message: "An error has occured" });
  }
});

// Delete song

router.delete("/deletesong", auth, async (req, res) => {
  try {
    const userEmail = req.decoded.email;
    const { title } = req.body;
    const deleteSong = await pool.query(
      "DELETE FROM songs WHERE email = $1 AND title = $2",
      [userEmail, title]
    );
    res.json(deleteSong);
  } catch (error) {
    console.log("DELETE /deletesong", error);
    res.status(400).json({ status: "error", message: "An error has occured" });
  }
});

module.exports = router;
