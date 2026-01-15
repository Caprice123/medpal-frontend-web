-- Add skripsi_diagrams table for storing diagram history separately from messages
-- This migration adds a dedicated table for diagram builder history

CREATE TABLE IF NOT EXISTS skripsi_diagrams (
  id SERIAL PRIMARY KEY,
  tab_id INTEGER NOT NULL,
  diagram_type VARCHAR(255) NOT NULL,
  detail_level VARCHAR(255) NOT NULL,
  orientation VARCHAR(255) NOT NULL,
  layout_style VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  diagram_data TEXT NOT NULL,
  credits_used DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_skripsi_diagrams_tab
    FOREIGN KEY (tab_id)
    REFERENCES skripsi_tabs(id)
    ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_skripsi_diagrams_tab_id ON skripsi_diagrams(tab_id);
CREATE INDEX IF NOT EXISTS idx_skripsi_diagrams_type ON skripsi_diagrams(diagram_type);
CREATE INDEX IF NOT EXISTS idx_skripsi_diagrams_created_at ON skripsi_diagrams(created_at);
