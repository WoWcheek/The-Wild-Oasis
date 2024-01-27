import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://xmchjrzwfdsdrashoznf.supabase.co";
const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtY2hqcnp3ZmRzZHJhc2hvem5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDYzODk5MjQsImV4cCI6MjAyMTk2NTkyNH0.eqFb1tzIO7JB8uwO6qcyZNumiA2XLD10sEy4CayUsQg";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
