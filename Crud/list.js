import express from "express";
import User from "../user.js";
import List from "../list.js";

const router = express.Router();

// Add
router.post("/addtask", async (req, res) => {
  try {
    const { title, body, color, id } = req.body;

    // Validate request data
    if (!title || !body || !color || !id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const list = new List({
      title,
      body,
      color,
      user: user._id,
    });

    await list.save();
    user.list.push(list._id);
    await user.save();

    return res.status(200).json({ list });
  } catch (error) {
    console.error("Error adding task:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});
// Update
router.put("/updatetask/:id", async (req, res) => {
  try {
    const { title, body, color } = req.body;
    const list = await List.findByIdAndUpdate(
      req.params.id,
      { title, body, color },
      { new: true }
    );
    list.save().then(() => {
      res.status(200).json({ message: "Task Updated", list });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Delete
router.delete("/deletetask/:id", async (req, res) => {
  try {
    const { id } = req.body;
    const exist = await User.findByIdAndUpdate(id, {
      $pull: { list: req.params.id },
    });
    if (exist) {
      const deletedTask = await List.findByIdAndDelete(req.params.id);
      if (deletedTask) {
        return res.status(200).json({ message: "Task Deleted", deletedTask });
      } else {
        return res.status(404).json({ message: "Task not found" });
      }
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get
router.get("/gettask/:id", async (req, res) => {
  const list = await List.find({ user: req.params.id }).sort({
    updatedAt: -1,
  });
  if (list.length !== 0) {
    res.status(200).json({ list });
  } else {
    res.status(200).json({ message: "No Task" });
  }
});

export default router;
