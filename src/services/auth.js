import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://csmrklvjpdxtewftwlky.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzbXJrbHZqcGR4dGV3ZnR3bGt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyOTI2MzQsImV4cCI6MjA5Mjg2ODYzNH0.2ZuixwpgPH5pnHsA1WtE5jKDfX-ptJs4C6dDop7YsXs';

export const supabase = createClient(supabaseUrl, supabaseKey);