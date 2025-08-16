import { signIn, signOut } from "next-auth/react";

export interface LoginCredentials {
  email: string;
  password: string;
  company?: string;
}

interface SignupData extends LoginCredentials {
  name: string;
}

export async function login({ email, password }: LoginCredentials) {
  const res = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });
  console.log(res?.error);
  if (res?.error) {
    throw {
      status: 401,
      message: res.error || "Invalid email or password",
    };
  }

  return res;
}

export async function signup(data: SignupData) {
  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    return { success: true };
  } catch (err) {
    return { success: false, message: (err as Error).message };
  }
}

export async function logout() {
  try {
    await signOut({ redirect: false }); // just end session, no redirect yet
    return { success: true };
  } catch (err) {
    return { success: false, message: (err as Error).message };
  }
}
