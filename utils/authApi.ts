import { useMutation } from "@tanstack/react-query";
import { login, logout, signup } from "@/servcies/auth.service";

interface LoginCredentials {
  email: string;
  password: string;
  company?: string;
}

interface SignupData extends LoginCredentials {
  name: string;
}

export function useLoginMutation() {
  return useMutation({ mutationFn: (credentials: LoginCredentials) => login(credentials) });
}

export function useSignupMutation() {
  return useMutation({
    mutationFn: (data: SignupData) => signup(data),
  });
}

export function useLogoutMutation() {
  return useMutation({ mutationFn: logout });
}
