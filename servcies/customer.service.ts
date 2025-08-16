export interface Customer {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  profileImageUrl?: string;
  cloudinaryId?: string;
  status?: "active" | "inactive" | "blocked";
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const API_URL = "/api/customers";

export async function getCustomers(): Promise<Customer[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getCustomerById(id: string): Promise<Customer> {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createCustomer(formData: FormData): Promise<Customer> {
  const res = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateCustomer(id: string, formData: FormData): Promise<Customer> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    body: formData,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteCustomer(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
  return { success: true };
}
