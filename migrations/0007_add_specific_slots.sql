-- Migration: Add specific_slots to availability_rules
ALTER TABLE availability_rules ADD COLUMN specific_slots TEXT;
