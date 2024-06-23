import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "library",
  password: "143026jo",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM book");
    console.log(result);
    const data = {
      total: result.rowCount,
      book: result.rows,
    };
    res.send(data);
    //res.render(data);
  } catch (error) {
    console.error(error);
  }
});

//specific book
app.get("/book/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    console.log(bookId);
    // const result = await db.query(`SELECT * FROM book JOIN book_note ON book.id=book_note.book_id WHERE book.id = '${bookId}'`);
    const resultBook = await db.query(
      `SELECT * FROM book WHERE book.id = '${bookId}'`
    );
    const resultNote = await db.query(
      `SELECT * FROM book_note WHERE book_id = '${bookId}'`
    );

    const data = {
      book: resultBook.rows[0],
      note: resultNote.rows,
    };
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }

  //res.render("index.ejs", data);
});

app.post("/note", async (req, res) => {
  try {
    const { content, bookId } = req.body;
    const date = new Date();
    const values = [content, date, bookId];
    const result = await db.query(
      `INSERT INTO book_note (note_content, note_date, book_id) VALUES ($1, $2, $3)  RETURNING *;`,
      values
    );

    res.send(result);
    //res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("error contact admin");
    // res.render("index.ejs", { content: error.response.data });
  }
});

app.patch("/note", async (req, res) => {
  const { content, noteId } = req.body;
  const date = new Date();
  const values = [content, date, noteId];

  try {
    const result = await db.query(
      `UPDATE book_note SET note_content = $1, note_date = $2 WHERE id = $3 RETURNING *`,
      values
    );
    //res.redirect("/")
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error to update the list");
  }
});

app.delete("/note", async (req, res) => {
  const noteId = req.body.noteId;
  const values = [noteId];

  try {
    const result = await db.query(
      `DELETE FROM book_note WHERE id = $1`,
      values
    );
    //res.redirect("/");
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error to update the list");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
