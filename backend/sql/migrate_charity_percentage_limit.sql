USE golf_platform;

UPDATE users
SET charity_percentage = 30
WHERE charity_percentage > 30;

UPDATE users
SET charity_percentage = 10
WHERE charity_percentage < 10;


ALTER TABLE users
ADD CONSTRAINT chk_charity_percentage
CHECK (charity_percentage >= 10 AND charity_percentage <= 100);

SELECT id, name, email, charity_percentage FROM users;
