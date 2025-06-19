import express from "express";
const router = express.Router();
import fetchUser from "../middleware/fetchUser.js";
import { Note } from "../models/Note.js";
import { body, validationResult } from "express-validator";

//Route 1: Get all notes using: GET Login required.
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//Route 2:  Add  a new note using: POST Login required.
router.post(
  "/addnotes",
  fetchUser,
  [
    body("title").isLength({ min: 3 }).withMessage("Not a valid title"),
    // body("description")
    //   .isLength({ min: 5 })
    //   .withMessage("Description should be atleast 5 characters."),
    body("description")
      .optional({ checkFalsy: true })
      .isLength({ min: 0 })
      .withMessage("Description should be provided but can be empty."),
    body("status")
      .optional()
      .isIn(["Active", "On Hold", "Completed", "Dropped"]),
  ],
  async (req, res) => {
    try {
      const { title, description, tag, status } = req.body;
      const errorobj = validationResult(req); // returns an object that contains validation errors (if obj empty no error)
      if (!errorobj.isEmpty()) {
        //isEmpty returns true if there are no errors(valid) and false if there are errors. ! xa so false ma if chlx
        return res.send({ errors: errorobj.array() }); //valid xaina vane error cause hunu
      }

      const note = new Note({
        title,
        description,
        tag,
        status: status || "Active",
        user: req.user.id,
      });
      const saveNote = await note.save();
      res.json(saveNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Server error" });
    }
  }
);
//Route 3: Update an existing Note using: PUT "/api/auth/updatenote". Login required.
router.put("/updatenotes/:id", fetchUser, async (req, res) => {
  try {
    const { title, description, tag, status } = req.body;
    //Create a new note obj

    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }
    if (status) newNote.status = status;
    //find the note to be updated and update it

    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not found");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(404).send("Not allowed");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});

//Route 4: Delete an existing Note using: DELETE "/api/auth/deleteenote". Login required.
router.delete("/deletenotes/:id", fetchUser, async (req, res) => {
  try {
    //Find the note to be deleted and delete it

    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not found");
    }

    //Allow deletion if only users own to Note
    if (note.user.toString() !== req.user.id) {
      return res.status(404).send("Not allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ Sucess: "Note has been deleted", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});
export default router;
