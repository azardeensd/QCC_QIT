import { supabase } from './auth';

export const saveAttendance = async (submissionData) => {
  const { data, error } = await supabase
    .from('attendance')
    .insert([submissionData]);
  if (error) throw error;
  return data;
};

// Add this function:
export const getCompanies = async () => {
  const { data, error } = await supabase
    .from('companies')
    .select('name')
    .order('name', { ascending: true });
  
  if (error) throw error;
  return data;
};

// Add to D:\QCC_QTT_Attendance\frontend\src\services\api.js

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