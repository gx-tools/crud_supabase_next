import { createClient } from "./supabase/client";
import { AuthError } from "@supabase/supabase-js";

export async function signIn({ email, password }: { email: string; password: string }) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof AuthError ? error : new AuthError("An unexpected error occurred") 
    };
  }
}

export async function signUp({ email, password }: { email: string; password: string }) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof AuthError ? error : new AuthError("An unexpected error occurred") 
    };
  }
}