import express from "express";
import pg from "pg";
import dotenv from "dotenv";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const db = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});
db.connect();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const sort = req.query.sort || "id";
  try {
    const result = await db.query(`SELECT * FROM books ORDER BY ${sort} DESC`);
    res.render("index", { books: result.rows });
  } catch (err) {
    res.status(500).send("Database error");
  }
});

app.get("/add", (req, res) => {
  res.render("book");
});

app.post("/add", async (req, res) => {
  const { title, author, rating, notes, read_date } = req.body;
  try {
    const search = await axios.get(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`);
    const cover_id = search.data.docs[0]?.cover_i || null;
    await db.query("INSERT INTO books (title, author, rating, notes, read_date, cover_id) VALUES ($1, $2, $3, $4, $5, $6)",
      [title, author, rating, notes, read_date, cover_id]);
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Error adding book");
  }
});

app.get("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const result = await db.query("SELECT * FROM books WHERE id = $1", [id]);
  res.render("edit", { book: result.rows[0] });
});

app.post("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { title, author, rating, notes, read_date } = req.body;
  await db.query("UPDATE books SET title=$1, author=$2, rating=$3, notes=$4, read_date=$5 WHERE id=$6",
    [title, author, rating, notes, read_date, id]);
  res.redirect("/");
});

app.post("/delete/:id", async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM books WHERE id = $1", [id]);
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
