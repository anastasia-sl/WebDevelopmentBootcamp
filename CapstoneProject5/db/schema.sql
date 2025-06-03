CREATE TABLE books (
                       id SERIAL PRIMARY KEY,
                       title TEXT NOT NULL,
                       author TEXT,
                       rating INTEGER,
                       notes TEXT,
                       read_date DATE,
                       cover_id TEXT
);
