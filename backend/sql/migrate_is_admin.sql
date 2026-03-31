USE golf_platform;

ALTER TABLE users
ADD COLUMN IF NOT EXISTS is_admin TINYINT(1) NOT NULL DEFAULT 0 AFTER role;

UPDATE users
SET is_admin = 1
WHERE email = 'admin@golfgives.com';

SELECT id, name, email, role, is_admin FROM users;
