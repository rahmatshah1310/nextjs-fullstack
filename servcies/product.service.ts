export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
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

export async function getProductById(id: number) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function createProduct(product: Product) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function updateProduct(id: number, product: Partial<Product>) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT", // or PATCH
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function deleteProduct(id: number) {
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
