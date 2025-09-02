const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;


app.use(express.json());
app.use(cors());


mongoose
  .connect("mongodb+srv://varsha:varsha@backend.rravwpl.mongodb.net/Exdb")
  .then(() => console.log("CONNECTED TO MONGODB"))
  .catch((err) => console.log("NOT CONNECTED", err));


const formSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  service: String,
  country: String,
  date: String,
  message: String
});

app.get("/", (req, res) => {
res.send("Server is live")
});

const Form = mongoose.model("forms", formSchema);



app.get("/forms", async (req, res) => {
  try {
    const forms = await Form.find();
    res.json(forms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/forms", async (req, res) => {
  try {
   const existingForm = await Form.findOne({ email: req.body.email });
    if (existingForm) {
      return res.status(400).json({ message: "This email is already registered!" });
    }

    const form = new Form(req.body);
    const savedForm = await form.save();
    res.status(201).json(savedForm);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



app.put("/forms/:id", async (req, res) => {
  try {
    const updatedForm = await Form.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedForm);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


app.delete("/forms/:id", async (req, res) => {
  try {
    await Form.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port http://localhost:5000`));
