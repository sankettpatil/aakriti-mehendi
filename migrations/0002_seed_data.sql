-- ═══════════════════════════════════════════════════════
--  Aakriti Mehndi — Seed Data
-- ═══════════════════════════════════════════════════════

-- ─────────────────────────────────────────────
--  Services
-- ─────────────────────────────────────────────
INSERT INTO services (name, slug, description, duration_min, price_from, price_to, is_active, display_order, booking_mode) VALUES
  ('Bridal Mehndi', 'bridal-mehndi', 'Full bridal mehndi for both hands and both feet. Intricate, personalised designs that tell your story.', 210, 8000, 25000, 1, 1, 'full_day'),
  ('Occasion Mehndi', 'occasion-mehndi', 'Beautiful mehndi for engagements, festivals, and special occasions. One or both hands.', 75, 2500, 6000, 1, 2, 'time_slot'),
  ('Group / Home Visit', 'group-home-visit', 'Mehndi for families, bridesmaids, and parties. I come to you with everything needed.', 150, NULL, NULL, 1, 3, 'half_day'),
  ('Kids Mehndi', 'kids-mehndi', 'Light, fun designs for little ones. Quick and fuss-free.', 40, 500, 1500, 1, 4, 'time_slot');

-- ─────────────────────────────────────────────
--  Availability Rules (Mon–Sat 8 AM – 7 PM, Sunday off)
-- ─────────────────────────────────────────────
INSERT INTO availability_rules (day_of_week, start_time, end_time, slot_gap_min, is_active) VALUES
  (1, '08:00', '19:00', 30, 1),   -- Monday
  (2, '08:00', '19:00', 30, 1),   -- Tuesday
  (3, '08:00', '19:00', 30, 1),   -- Wednesday
  (4, '08:00', '19:00', 30, 1),   -- Thursday
  (5, '08:00', '19:00', 30, 1),   -- Friday
  (6, '08:00', '19:00', 30, 1);   -- Saturday
  -- Sunday (0) not inserted = not available

-- ─────────────────────────────────────────────
--  Sample Testimonials
-- ─────────────────────────────────────────────
INSERT INTO testimonials (customer_name, occasion, city, year, quote, is_visible, display_order) VALUES
  ('Priya Sharma', 'Wedding', 'Delhi', 2024, 'The detail in my bridal mehndi was breathtaking. Every guest asked who the artist was. She understood exactly what I wanted before I could even explain it.', 1, 1),
  ('Ananya Gupta', 'Engagement', 'Jaipur', 2024, 'I was nervous about my engagement mehndi but she made the whole experience so calming. The design was elegant and the colour came out so dark — exactly what I hoped for.', 1, 2),
  ('Meera Patel', 'Wedding', 'Lucknow', 2023, 'She travelled to Lucknow for my wedding and was worth every penny. My mehndi lasted over three weeks and I still look at the photos. Truly an artist.', 1, 3);
