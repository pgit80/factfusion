import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ydrivbxmsnlbziznwezf.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlkcml2Ynhtc25sYnppem53ZXpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQwNzYzMzgsImV4cCI6MjAzOTY1MjMzOH0.Qo4v-lR9iazc90IQzZS3YBaJFFyCX5NU2XPBYn_liiE";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
