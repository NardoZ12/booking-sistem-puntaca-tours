-- ============================================================
-- FIX: Recreate bookings table with QUOTED camelCase columns
-- so they match exactly the keys sent by the app (clientName,
-- meetingPoint, productCode, rawText, createdAt, ...).
--
-- Without quotes, Postgres lowercases column names and the
-- inserts/selects from the app fail ("column not found").
-- ============================================================

-- Drop the old (broken) table. Prior inserts were failing, so
-- there is no valid data to preserve here.
DROP TABLE IF EXISTS bookings CASCADE;

CREATE TABLE bookings (
  "id" BIGINT PRIMARY KEY,
  "source" TEXT NOT NULL CHECK ("source" IN ('viator', 'gyg', 'direct')),
  "tour" TEXT,
  "date" TEXT,
  "clientName" TEXT,
  "phone" TEXT,
  "hotel" TEXT,
  "meetingPoint" TEXT,
  "time" TEXT,
  "guests" INTEGER,
  "adults" INTEGER,
  "children" INTEGER,
  "confirmation" TEXT,
  "amount" TEXT,
  "language" TEXT,
  "origin" TEXT,
  "productCode" TEXT,
  "commission" TEXT,
  "notes" TEXT,
  "rawText" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations" ON bookings;
CREATE POLICY "Allow all operations" ON bookings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Permissions for the anon (public) key used by the app
GRANT ALL ON bookings TO anon;
GRANT ALL ON bookings TO authenticated;

-- Indexes (note the quoted column name)
CREATE INDEX bookings_created_at_idx ON bookings ("createdAt" DESC);
CREATE INDEX bookings_source_idx ON bookings ("source");

-- Enable real-time sync across browsers/devices.
-- Adds this table to the realtime publication so postgres_changes
-- events are broadcast to all connected clients.
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
