import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qvmgponteizwvuplcvxc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2bWdwb250ZWl6d3Z1cGxjdnhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2MjI0NTMsImV4cCI6MjA3NDE5ODQ1M30.zteEDAt6KB15M56uxvSMI_dx5oOdZLWz9OmZKzij28I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
