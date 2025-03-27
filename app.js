console.log("Starting");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// Set up EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
console.log("Serving static files from:", path.join(__dirname, "public"));

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/todo")
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Failed to connect to MongoDB:", err));

// Schema and Model
const trySchema = new mongoose.Schema({ name: String });
const Item = mongoose.model("Task", trySchema);

// Routes
app.get("/", async function (req, res) {
    try {
        const foundItems = await Item.find({});
        res.render("list", { tasks: foundItems });
    } catch (err) {
        console.error("Error retrieving items:", err);
    }
});

app.post("/", function (req, res) {
    const itemName = req.body.ele1;
    const todo = new Item({ name: itemName });
    todo.save();
    res.redirect("/");
});

app.post("/delete", async function (req, res) {
    const checkedId = req.body.checkbox1;

    try {
        await Item.findByIdAndDelete(checkedId);
        console.log("Deleted successfully");
        res.redirect("/");
    } catch (err) {
        console.error("Error deleting item:", err);
        res.status(500).send("An error occurred while deleting the item.");
    }
});

// Start Server
app.listen(3012, function () {
    console.log("Server is running on port 3012");
});
