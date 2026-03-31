-- CREATE DATABASE IF NOT EXISTS sql12821795;
-- USE sql12821795;

CREATE TABLE IF NOT EXISTS users(
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role ENUM('user','admin') DEFAULT 'user',
  is_admin TINYINT(1) NOT NULL DEFAULT 0,
  is_blocked TINYINT(1) NOT NULL DEFAULT 0,
  charity_id INT,
  charity_percentage INT DEFAULT 10,
  CONSTRAINT chk_charity_percentage CHECK (charity_percentage >= 10 AND charity_percentage <= 30),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scores(
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  score INT,
  date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS charities(
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  image_url TEXT
);

CREATE TABLE IF NOT EXISTS subscriptions(
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  plan ENUM('monthly','yearly'),
  status ENUM('active','inactive'),
  renewal_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS draws(
  id INT AUTO_INCREMENT PRIMARY KEY,
  draw_date DATE,
  num1 INT,
  num2 INT,
  num3 INT,
  num4 INT,
  num5 INT,
  status ENUM('pending','published')
);

CREATE TABLE IF NOT EXISTS winners(
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  draw_id INT,
  match_type INT,
  prize_amount DECIMAL(10,2),
  proof_url TEXT,
  status ENUM('pending','paid')
);

SELECT * FROM winners;
