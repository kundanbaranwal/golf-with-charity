USE golf_platform;

SET @has_is_blocked := (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = 'golf_platform'
    AND table_name = 'users'
    AND column_name = 'is_blocked'
);

SET @add_col_sql := IF(
  @has_is_blocked = 0,
  'ALTER TABLE users ADD COLUMN is_blocked TINYINT(1) NOT NULL DEFAULT 0 AFTER is_admin',
  'SELECT "is_blocked already exists"'
);

PREPARE stmt FROM @add_col_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE users SET is_blocked = 0 WHERE is_blocked IS NULL;

SELECT id, name, email, is_admin, is_blocked FROM users;
