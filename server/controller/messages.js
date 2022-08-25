require("dotenv").config();

const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

// Create a message
router.post(
  "/createmessage",
  auth,
  [check("message", "Please enter a message").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ Status: "error", error: errors.array() });
    }
    try {
      const { message } = req.body;
      const userEmail = req.decoded.email;
      const userName = req.decoded.username;

      const newMessage = await pool.query(
        "INSERT INTO messages (email, username, message) VALUES($1, $2, $3) RETURNING *",
        [userEmail, userName, message]
      );

      res.json(newMessage.rows);
    } catch (error) {
      console.log("POST /createmessage", error);
      res.status(400).json({ status: "error", message: "An error occured" });
    }
  }
);

// View all messages
router.get("/allmessages", auth, async (req, res) => {
  try {
    const allMessages = await pool.query("SELECT * FROM messages LIMIT 100");
    res.json(allMessages.rows);
  } catch (error) {
    console.log("GET /allmessages", error);
    res.status(400).json({ status: "error", message: "An error occured" });
  }
});

// Delete a message
router.delete("/deletemessage/:message_id", auth, async (req, res) => {
  try {
    const userEmail = req.decoded.email;
    // const messageID = req.params.message_id;
    const { message_id } = req.params;

    const deleteMessage = await pool.query(
      "DELETE FROM messages WHERE email = $1 AND message_id = $2",
      [userEmail, message_id]
    );
    res.json(deleteMessage);
  } catch (error) {
    console.log("DELETE /deletemessage", error);
    res.status(400).json({ status: "error", message: "An error has occured" });
  }
});

module.exports = router;
