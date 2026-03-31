USE golf_platform;

-- Charities
INSERT INTO charities (name, description, image_url)
SELECT * FROM (
  SELECT 'Golf for Youth' AS name, 'Youth golf mentoring and access programs.' AS description, 'https://example.com/charities/golf-for-youth.jpg' AS image_url
  UNION ALL
  SELECT 'Green Futures', 'Environmental sustainability initiatives for golf communities.', 'https://example.com/charities/green-futures.jpg'
  UNION ALL
  SELECT 'Swing for Health', 'Community wellness and mental health through sport.', 'https://example.com/charities/swing-for-health.jpg'
) AS seed_charities
WHERE NOT EXISTS (SELECT 1 FROM charities c WHERE c.name = seed_charities.name);

-- Users (admin + player)
INSERT INTO users (name, email, password, role, is_admin, is_blocked, charity_id, charity_percentage)
SELECT 'Admin User', 'admin@golfgives.com', '$2b$10$s/ZibV/ov6XH3cUDO7BAquDslyTidwZIMRa/TW8PUXKOVrAg/l9Wi', 'admin', 1, 0,
       (SELECT id FROM charities WHERE name = 'Golf for Youth' LIMIT 1), 10
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@golfgives.com');

INSERT INTO users (name, email, password, role, is_admin, is_blocked, charity_id, charity_percentage)
SELECT 'John Smith', 'john@example.com', '$2b$10$H0exNBoHb.SBqtxuf8rgMOL6sIpxccCgX8R/8SCrdkmIITGtxJoh2', 'user', 0, 0,
       (SELECT id FROM charities WHERE name = 'Green Futures' LIMIT 1), 15
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'john@example.com');

UPDATE users SET is_admin = 1 WHERE email = 'admin@golfgives.com';
UPDATE users SET is_admin = 0 WHERE email = 'john@example.com';
UPDATE users SET is_blocked = 0 WHERE email IN ('admin@golfgives.com', 'john@example.com');

-- Subscriptions
INSERT INTO subscriptions (user_id, plan, status, renewal_date)
SELECT u.id, 'monthly', 'active', DATE_ADD(CURDATE(), INTERVAL 1 MONTH)
FROM users u
WHERE u.email = 'john@example.com'
  AND NOT EXISTS (
    SELECT 1
    FROM subscriptions s
    WHERE s.user_id = u.id
  );

-- Scores (up to 5)
INSERT INTO scores (user_id, score, date)
SELECT u.id, 38, DATE_SUB(CURDATE(), INTERVAL 2 DAY)
FROM users u
WHERE u.email = 'john@example.com'
  AND NOT EXISTS (SELECT 1 FROM scores s WHERE s.user_id = u.id AND s.score = 38 AND s.date = DATE_SUB(CURDATE(), INTERVAL 2 DAY));

INSERT INTO scores (user_id, score, date)
SELECT u.id, 32, DATE_SUB(CURDATE(), INTERVAL 9 DAY)
FROM users u
WHERE u.email = 'john@example.com'
  AND NOT EXISTS (SELECT 1 FROM scores s WHERE s.user_id = u.id AND s.score = 32 AND s.date = DATE_SUB(CURDATE(), INTERVAL 9 DAY));

INSERT INTO scores (user_id, score, date)
SELECT u.id, 41, DATE_SUB(CURDATE(), INTERVAL 16 DAY)
FROM users u
WHERE u.email = 'john@example.com'
  AND NOT EXISTS (SELECT 1 FROM scores s WHERE s.user_id = u.id AND s.score = 41 AND s.date = DATE_SUB(CURDATE(), INTERVAL 16 DAY));

INSERT INTO scores (user_id, score, date)
SELECT u.id, 27, DATE_SUB(CURDATE(), INTERVAL 23 DAY)
FROM users u
WHERE u.email = 'john@example.com'
  AND NOT EXISTS (SELECT 1 FROM scores s WHERE s.user_id = u.id AND s.score = 27 AND s.date = DATE_SUB(CURDATE(), INTERVAL 23 DAY));

INSERT INTO scores (user_id, score, date)
SELECT u.id, 35, DATE_SUB(CURDATE(), INTERVAL 30 DAY)
FROM users u
WHERE u.email = 'john@example.com'
  AND NOT EXISTS (SELECT 1 FROM scores s WHERE s.user_id = u.id AND s.score = 35 AND s.date = DATE_SUB(CURDATE(), INTERVAL 30 DAY));

-- Draws
INSERT INTO draws (draw_date, num1, num2, num3, num4, num5, status)
SELECT DATE_SUB(CURDATE(), INTERVAL 7 DAY), 7, 12, 28, 35, 41, 'published'
WHERE NOT EXISTS (
  SELECT 1 FROM draws d
  WHERE d.draw_date = DATE_SUB(CURDATE(), INTERVAL 7 DAY)
);

INSERT INTO draws (draw_date, num1, num2, num3, num4, num5, status)
SELECT CURDATE(), 4, 15, 23, 31, 44, 'pending'
WHERE NOT EXISTS (
  SELECT 1 FROM draws d
  WHERE d.draw_date = CURDATE()
);

-- Winners (pending proof payout)
INSERT INTO winners (user_id, draw_id, match_type, prize_amount, proof_url, status)
SELECT u.id, d.id, 3, 50.00, 'https://example.com/proofs/john-proof.png', 'pending'
FROM users u
JOIN draws d ON d.draw_date = DATE_SUB(CURDATE(), INTERVAL 7 DAY)
WHERE u.email = 'john@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM winners w
    WHERE w.user_id = u.id AND w.draw_id = d.id
  );

SELECT 'Seed complete' AS message;
SELECT id, name, email, role, is_admin, is_blocked FROM users;
SELECT id, name FROM charities;
SELECT * FROM winners;
