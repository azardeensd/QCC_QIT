import { supabase } from './auth';

// --- ATTENDANCE & SETTINGS (Unchanged) ---
export const saveAttendance = async (submissionData) => {
  const { data, error } = await supabase
    .from('attendance')
    .insert([submissionData]);
  if (error) throw error;
  return data;
};

export const getCompanies = async () => {
  const { data, error } = await supabase
    .from('companies')
    .select('name')
    .order('name', { ascending: true });
  if (error) throw error;
  return data;
};

export const getLocation = async () => {
  const { data, error } = await supabase
    .from('settings')
    .select('current_location')
    .eq('id', 1)
    .single();
  if (error) throw error;
  return data.current_location;
};

export const updateLocation = async (newLocation) => {
  const { error } = await supabase
    .from('settings')
    .update({ current_location: newLocation })
    .eq('id', 1);
  if (error) throw error;
};

// --- NEW CUSTOM AUTH & USER MANAGEMENT ---

// Custom Login: Checks your 'users' table directly using Gen ID
export const loginUser = async (genId, password) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('gen_id', genId) // Matches the database column 'gen_id' to your input
    .eq('password', password)
    .single();

  if (error || !data) {
    throw new Error('Invalid Gen ID or password');
  }
  
  // Return the user data (id, gen_id, role)
  return data;
};

// Get all users for the Admin Dashboard
export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('id', { ascending: true }); 
  if (error) throw error;
  return data;
};

// Admin can directly add new users to the table with Gen ID
export const addUser = async (genId, password, role) => {
  const { data, error } = await supabase
    .from('users')
    .insert([{ gen_id: genId, password, role }]) // Inserts the new Gen ID
    .select();
  if (error) throw error;
  return data;
};

// Admin can update a user's role
export const updateUserRole = async (userId, newRole) => {
  const { data, error } = await supabase
    .from('users')
    .update({ role: newRole })
    .eq('id', userId);
  if (error) throw error;
  return data;
};

// Admin can delete a user
export const deleteUser = async (userId) => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);
  if (error) throw error;
};
