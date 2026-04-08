export function getProductImage(product: Product): string {
  return product?.image || "";
}

export interface Product {
  id: number;
  name: string;
  category: string;
  subcategory?: string;
  brand?: string;
  size_pack?: string;
  image: string;
  price: number;
  price_status?: string;
  price_needs_review?: boolean;
  description?: string;
  source?: string;
  visible?: boolean;
  featured?: boolean;
  onPromo?: boolean;
  promoPrice?: number | null;
  promoLabel?: string | null;
  promoStartDate?: string | null;
  promoEndDate?: string | null;
  outOfStock?: boolean;
}

const STORAGE_KEY = "admin_products";

export async function getProducts(): Promise<Product[]> {
  if (typeof window === "undefined") return [];
   
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const products = JSON.parse(stored);
    return products.map((p: Product) => ({
      ...p,
      image: p?.image || "",
    }));
  }
   
  try {
    const response = await fetch("/products.json");
    const products = await response.json();
    const productsWithImages = products.map((p: Product) => ({
      ...p,
      image: p?.image || "",
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(productsWithImages));
    return productsWithImages;
  } catch {
    return [];
  }
}

export async function saveProducts(products: Product[]): Promise<void> {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export async function getProductById(id: number): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find(p => p.id === id);
}
