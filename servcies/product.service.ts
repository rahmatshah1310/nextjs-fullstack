export interface Product {
  id?: string;
  name: string;
  description?: string;
  price: number;
  quantity?: number;
  category?: string;
  discount?: number;
  isActive?: boolean;
  sizes?: string[];
  colors?: string[];
  image?: File | null;
  imageUrl?: string;
  cloudinaryId?: string;
  createdAt?: string;
  updatedAt?: string;
}

const API_URL = "/api/products";

export async function getProducts() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function getProductById(id: string) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function createProduct(formData: FormData): Promise<Product> {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function updateProduct(id: string, formData: FormData): Promise<Product> {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: formData,
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function deleteProduct(id: string) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(await res.text());
    return { success: true };
  } catch (err) {
    throw new Error((err as Error).message);
  }
}
