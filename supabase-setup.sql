-- ============================================================
-- BattleX Leaderboard — Supabase SQL Setup
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Create the leaderboard scores table
CREATE TABLE IF NOT EXISTS leaderboard_scores (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  game             text NOT NULL,                  -- e.g. 'parking-jam'
  player_name      text NOT NULL,
  speedrun_time_ms integer,                        -- null if speedrun not enabled
  score            integer NOT NULL DEFAULT 0,     -- coins collected
  level            integer NOT NULL DEFAULT 1,     -- highest level reached (1-4)
  speedrun_enabled boolean NOT NULL DEFAULT false,
  ip_hash          text,                           -- hashed for duplicate detection
  submitted_at     timestamptz DEFAULT now() NOT NULL,

  -- Anti-cheat constraints
  CONSTRAINT valid_time  CHECK (speedrun_time_ms IS NULL OR speedrun_time_ms > 0),
  CONSTRAINT valid_score CHECK (score >= 0 AND score <= 10000),
  CONSTRAINT valid_level CHECK (level >= 1 AND level <= 10),
  CONSTRAINT name_length CHECK (char_length(player_name) BETWEEN 1 AND 24)
);

-- Indexes for fast leaderboard queries
CREATE INDEX IF NOT EXISTS idx_scores_game_time
  ON leaderboard_scores (game, speedrun_time_ms ASC)
  WHERE speedrun_enabled = true;

CREATE INDEX IF NOT EXISTS idx_scores_game_score
  ON leaderboard_scores (game, score DESC);

CREATE INDEX IF NOT EXISTS idx_scores_submitted
  ON leaderboard_scores (submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_scores_ip_hash
  ON leaderboard_scores (game, ip_hash, submitted_at DESC);

-- Enable Row Level Security
ALTER TABLE leaderboard_scores ENABLE ROW LEVEL SECURITY;

-- Allow anyone to READ scores (public leaderboard)
CREATE POLICY "Anyone can read scores"
  ON leaderboard_scores
  FOR SELECT
  USING (true);

-- Allow anyone to INSERT scores (submitted via API with validation)
CREATE POLICY "Anyone can insert scores"
  ON leaderboard_scores
  FOR INSERT
  WITH CHECK (true);

-- No UPDATE or DELETE via client (API handles everything)

-- ============================================================
-- Useful queries for testing
-- ============================================================

-- Top 10 speedrun times for parking-jam
-- SELECT rank() OVER (ORDER BY speedrun_time_ms ASC) AS rank,
--        player_name, speedrun_time_ms, score, level, submitted_at
-- FROM leaderboard_scores
-- WHERE game = 'parking-jam' AND speedrun_enabled = true
-- ORDER BY speedrun_time_ms ASC
-- LIMIT 10;

-- Top 10 scores for parking-jam
-- SELECT rank() OVER (ORDER BY score DESC) AS rank,
--        player_name, score, level, submitted_at
-- FROM leaderboard_scores
-- WHERE game = 'parking-jam'
-- ORDER BY score DESC
-- LIMIT 10;

-- Count entries per game
-- SELECT game, COUNT(*) as entries FROM leaderboard_scores GROUP BY game;


-- ============================================================
-- Table Tennis Leaderboard Table
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

CREATE TABLE IF NOT EXISTS table_tennis_scores (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name     text NOT NULL,
  opponent_name   text NOT NULL DEFAULT 'CPU',
  opponent_type   text NOT NULL DEFAULT 'cpu',   -- 'cpu' | 'online'
  player_score    integer NOT NULL DEFAULT 0,
  opponent_score  integer NOT NULL DEFAULT 0,
  won             boolean NOT NULL DEFAULT false,
  duration_ms     integer NOT NULL DEFAULT 0,    -- match duration in ms
  times_played    integer NOT NULL DEFAULT 1,    -- cumulative games count
  total_points    integer NOT NULL DEFAULT 0,    -- total points scored across session
  ip_hash         text,
  submitted_at    timestamptz DEFAULT now() NOT NULL,

  CONSTRAINT valid_scores   CHECK (player_score >= 0 AND player_score <= 30),
  CONSTRAINT valid_opponent CHECK (opponent_type IN ('cpu', 'online')),
  CONSTRAINT valid_duration CHECK (duration_ms >= 0),
  CONSTRAINT name_length    CHECK (char_length(player_name) BETWEEN 1 AND 24)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tt_player_name
  ON table_tennis_scores (player_name, submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_tt_submitted
  ON table_tennis_scores (submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_tt_opponent_type
  ON table_tennis_scores (opponent_type, submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_tt_won
  ON table_tennis_scores (won, submitted_at DESC);

-- Row Level Security
ALTER TABLE table_tennis_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read tt scores"
  ON table_tennis_scores FOR SELECT USING (true);

CREATE POLICY "Anyone can insert tt scores"
  ON table_tennis_scores FOR INSERT WITH CHECK (true);

-- ============================================================
-- Snakes & Ladders Leaderboard Tables
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Match table: one row per game session
CREATE TABLE IF NOT EXISTS snl_matches (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  match_code      text NOT NULL,            -- room code or 'local-TIMESTAMP'
  player_count    integer NOT NULL DEFAULT 2,
  duration_ms     integer NOT NULL DEFAULT 0,
  played_at       timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT valid_player_count CHECK (player_count BETWEEN 1 AND 6)
);

-- Player results: one row per player per match
CREATE TABLE IF NOT EXISTS snl_results (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id        uuid NOT NULL REFERENCES snl_matches(id) ON DELETE CASCADE,
  player_name     text NOT NULL,
  position        integer NOT NULL,         -- 1st, 2nd, 3rd ... 6th
  score           integer NOT NULL DEFAULT 0,
  points          integer NOT NULL DEFAULT 0, -- 100/90/80/70/60/50
  duration_ms     integer NOT NULL DEFAULT 0, -- time taken to finish
  submitted_at    timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT valid_position CHECK (position BETWEEN 1 AND 6),
  CONSTRAINT valid_points   CHECK (points IN (100,90,80,70,60,50,0)),
  CONSTRAINT name_length    CHECK (char_length(player_name) BETWEEN 1 AND 24)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_snl_results_name
  ON snl_results (player_name, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_snl_results_match
  ON snl_results (match_id);
CREATE INDEX IF NOT EXISTS idx_snl_results_points
  ON snl_results (points DESC, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_snl_matches_code
  ON snl_matches (match_code, played_at DESC);

-- RLS
ALTER TABLE snl_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE snl_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read snl_matches"  ON snl_matches FOR SELECT USING (true);
CREATE POLICY "Anyone can insert snl_matches" ON snl_matches FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read snl_results"  ON snl_results FOR SELECT USING (true);
CREATE POLICY "Anyone can insert snl_results" ON snl_results FOR INSERT WITH CHECK (true);
