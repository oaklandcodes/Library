

todo...

```
CREATE TABLE book_note (
    id SERIAL PRIMARY KEY,
    note_content TEXT NOT NULL,
    note_date DATE NOT NULL,
    book_id INT,
    FOREIGN KEY (book_id) REFERENCES book(id)
);
```