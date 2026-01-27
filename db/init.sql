CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    age INT
);

INSERT INTO users (name, email, age) VALUES
('Alice', 'alice@test.com', 25),
('Bob', 'bob@test.com', 30);
