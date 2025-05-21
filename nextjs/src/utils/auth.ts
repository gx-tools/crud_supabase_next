import { createClient } from "./supabase/client";
import { authApi } from "@/services/api";
import { handleError } from "@/helpers/handlers";

export async function signIn({ email, password }: { email: string; password: string }) {
  try {
    const supabase = createClient();
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  } catch (error) {
    console.error("Supabase signIn error:", error);
    throw error;
  }
}

export async function signUp({ email, password }: { email: string; password: string }) {
  try {
    const supabase = createClient();
    return await supabase.auth.signUp({
      email,
      password,
    });
  } catch (error) {
    console.error("Supabase signUp error:", error);
    throw error;
  }
}

export async function apiSignIn({ email, password }: { email: string; password: string }) {
  try {
    return await authApi.login({ email, password });
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function apiSignUp({ email, password }: { email: string; password: string }) {
  try {
    return await authApi.signup({ email, password });
  } catch (error) {
    handleError(error);
  }
}

export async function apiLogout() {
  try {
    return await authApi.logout();
  } catch (error) {
    handleError(error);
    throw error;
  }
}