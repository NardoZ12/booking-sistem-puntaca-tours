-- Create bookings table
-- IMPORTANT: column names are quoted to preserve camelCase. Without
-- quotes Postgres lowercases them and inserts/selects from the app
-- (which uses clientName, meetingPoint, createdAt, ...) would fail.
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

-- Enable RLS (Row Level Security)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for public access)
-- In production, you should restrict this to authenticated users only
CREATE POLICY "Allow all operations" ON bookings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Permissions for the anon (public) key used by the app
GRANT ALL ON bookings TO anon;
GRANT ALL ON bookings TO authenticated;

-- Create index on createdAt for faster queries
CREATE INDEX bookings_created_at_idx ON bookings ("createdAt" DESC);

-- Create index on source for filtering
CREATE INDEX bookings_source_idx ON bookings ("source");

-- Enable real-time sync across browsers/devices
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
