DELETE FROM services;
INSERT INTO services (name, slug, description, duration_min, is_active, display_order) VALUES
('Bridal', 'bridal', 'Exclusive bridal mehendi design', 60, 1, 1),
('Destination Wedding', 'destination_wedding', 'Mehendi artist travel to venue', 60, 1, 2),
('Wedding Mehendi Function', 'wedding_function', 'Mehendi for family and guests', 60, 1, 3),
('Pre-Wedding', 'pre_wedding', 'Engagement, haldi, and sangeet ceremonies', 60, 1, 4),
('Festival', 'festival', 'Traditional festival celebrations', 60, 1, 5),
('Birthdays and Gatherings', 'birthday_party', 'Birthday, kitty party, and baby shower gatherings', 60, 1, 6),
('Corporate Event', 'corporate_event', 'Brand activations and office events', 60, 1, 7),
('Casual and Personal', 'casual', 'Personal mehendi sessions', 60, 1, 8);
