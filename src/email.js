import { supabase } from './supabase';

export const sendEmail = async (type, to, data) => {
  const { data: result, error } = await supabase.functions.invoke('send-email', {
    body: { type, to, data }
  });
  if (error) console.error('Email error:', error);
  return result;
};
