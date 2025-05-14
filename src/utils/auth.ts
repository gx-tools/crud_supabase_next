import { createClient } from "./supabase/client";

export async function signIn({ email, password }: { email: string; password: string }) {
  console.log("::: Sign In :::");
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  console.log("::: Sign In Success :::");
  console.log(data);
  
  return data;
}

export async function signUp({ email, password }: { email: string; password: string }) {
  console.log("::: Sign Up :::");
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.log("::: Sign Up Error :::");
    console.log(error);
    throw error;
  }

  console.log("::: Sign Up Success :::");
  console.log(data);
  return data;
}