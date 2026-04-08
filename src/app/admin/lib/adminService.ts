export const PLACEHOLDER_IMAGE = "/products/placeholder.svg";

export interface Product {
  id: number;
  sku?: string;
  slug?: string;
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
  in_stock?: boolean;
  tags?: string[];
  compare_at_price?: number;
  onPromo?: boolean;
  promoPrice?: number | null;
  promoLabel?: string | null;
  promoStartDate?: string | null;
  promoEndDate?: string | null;
  outOfStock?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  featured?: boolean;
  product_count?: number;
}

export interface Promotion {
  id: string;
  title: string;
  subtitle?: string;
  active?: boolean;
  linked_products?: number[];
  banner_image?: string;
  discount_percent?: number;
  start_date?: string;
  end_date?: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  method: 'whatsapp' | 'pickup' | 'delivery';
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  items: { product_id: number; name: string; quantity: number; price: number }[];
  total: number;
  created_at: string;
  notes?: string;
}

export interface StoreSettings {
  name: string;
  tagline?: string;
  phone: string;
  whatsapp: string;
  email?: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  pickup_text?: string;
  payment_info?: string;
  delivery_threshold: number;
  free_delivery_message?: string;
  social?: {
    facebook?: string;
    instagram?: string;
  };
  departmentImages: Record<string, string>;
  heroBanners: string[];
}

const defaultSettings: StoreSettings = {
  name: "Marché LT Eben-Ezer",
  tagline: "Épicerie Africaine à Montréal",
  phone: "+1 (514) 467-0229",
  whatsapp: "15144670229",
  email: "contact@marchelt.com",
  address: "4821 Boul Henri-Bourassa Est",
  city: "Montréal",
  province: "QC",
  postal_code: "H1H 1M5",
  hours: {
    monday: "9h – 19h",
    tuesday: "9h – 19h",
    wednesday: "9h – 19h",
    thursday: "9h – 19h",
    friday: "9h – 19h",
    saturday: "9h – 18h",
    sunday: "11h – 17h",
  },
  pickup_text: "Venez récupérer votre commande au 4821 Boul Henri-Bourassa Est, Montréal",
  payment_info: "Paiement en magasin par EFT, comptant ou carte bancaire",
  delivery_threshold: 299,
  free_delivery_message: "LIVRAISON Gratuite AU QUÉBEC",
  social: {
    facebook: "https://facebook.com/marchelt",
    instagram: "https://instagram.com/marchelt",
  },
  departmentImages: {
    "epicerie": "/product_images/food/001-farine-de-manioc-kinazi-1kg.jpg",
    "surgeles": "/product_images/frozen-fish/090-raw-shrimp-16-20.jpg",
    "boissons": "/product_images/drinks/001-jus-de-bissap-hibiscus-1l.jpg",
    "legumes": "/product_images/fresh-vegetables/217-pondu.jpg",
    "snacks": "/product_images/snacks/205-v-c-dig-thins-wild-fruits.jpg",
    "cosmetiques": "/product_images/cosmetics/222-ever-sheen-cocoa-butter-hand-and-body-lotion.jpg",
    "condiments": "/product_images/spices/120-hot-paprika.jpg",
    "maison": "/product_images/household/211-old-dutch-bleach.jpg",
  },
  heroBanners: [
    "/hero_banners/hero1.jpg",
    "/hero_banners/store-in1.jpg",
    "/hero_banners/store-in2.jpg",
    "/hero_banners/store-in3.jpg",
    "/hero_banners/store.jpg",
    "/hero_banners/store1.jpg",
    "/hero_banners/store3.jpg",
    "/hero_banners/store4.jpg",
    "/hero_banners/store5.jpg",
  ],
};

export const defaultCategories: Category[] = [
  { id: "pantry-staples", name: "Épicerie Africaine", slug: "pantry-staples", description: "Farines, riz, haricots, epices", product_count: 0, featured: true },
  { id: "frozen-foods", name: "Poissons & Surgelés", slug: "frozen-foods", description: "Poissons, viande surgelees", product_count: 0, featured: true },
  { id: "beverages", name: "Boissons", slug: "beverages", description: "Jus, tisanes, sodas", product_count: 0, featured: true },
  { id: "produce-greens", name: "Legumes & Feuilles", slug: "produce-greens", description: "Legumes frais et feuilles", product_count: 0, featured: false },
  { id: "snacks", name: "Snacks", slug: "snacks", description: "Chips, biscuits, arachides", product_count: 0, featured: true },
  { id: "cosmetics", name: "Cosmetiques", slug: "cosmetics", description: "Huiles, beurres, savons", product_count: 0, featured: false },
  { id: "condiments", name: "Condiments", slug: "condiments", description: "Sauces, epices, assaisonnements", product_count: 0, featured: false },
  { id: "canned-goods", name: "Conserves", slug: "canned-goods", description: "Poissons et legumes en conserve", product_count: 0, featured: false },
];

export const defaultPromotions: Promotion[] = [
  {
    id: "promo-1",
    title: "Speciaux de la semaine",
    subtitle: "Jusqu'a 20% de rabais",
    active: true,
    discount_percent: 20,
    start_date: "2026-04-01",
    end_date: "2026-04-30",
  },
];

const STORAGE_KEYS = {
  products: "admin_products",
  categories: "admin_categories",
  promotions: "admin_promotions",
  orders: "admin_orders",
  settings: "admin_settings",
};

class AdminService {
  async getProducts(): Promise<Product[]> {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEYS.products);
    if (stored) {
      const products = JSON.parse(stored);
      return products.map((p: Product) => ({
        ...p,
        image: p?.image || PLACEHOLDER_IMAGE,
      }));
    }
    try {
      const response = await fetch("/products.json");
      const products = await response.json();
      const productsWithImages = products.map((p: Product) => ({
        ...p,
        image: p?.image || PLACEHOLDER_IMAGE,
      }));
      localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(productsWithImages));
      return productsWithImages;
    } catch {
      return [];
    }
  }

  async saveProducts(products: Product[]): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const products = await this.getProducts();
    return products.find(p => p.id === id);
  }

  async createProduct(product: Omit<Product, "id">): Promise<Product> {
    const products = await this.getProducts();
    const newProduct = { 
      ...product, 
      id: Math.max(...products.map(p => p.id), 0) + 1,
      image: product?.image || PLACEHOLDER_IMAGE,
    };
    products.push(newProduct);
    await this.saveProducts(products);
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined> {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { 
        ...products[index], 
        ...updates,
        image: updates.image !== undefined ? (updates.image || PLACEHOLDER_IMAGE) : products[index].image,
      };
      await this.saveProducts(products);
      return products[index];
    }
    return undefined;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const products = await this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length !== products.length) {
      await this.saveProducts(filtered);
      return true;
    }
    return false;
  }

  async getCategories(): Promise<Category[]> {
    if (typeof window === "undefined") return defaultCategories;
    const stored = localStorage.getItem(STORAGE_KEYS.categories);
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(defaultCategories));
    return defaultCategories;
  }

  async saveCategories(categories: Category[]): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(categories));
  }

  async getPromotions(): Promise<Promotion[]> {
    if (typeof window === "undefined") return defaultPromotions;
    const stored = localStorage.getItem(STORAGE_KEYS.promotions);
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem(STORAGE_KEYS.promotions, JSON.stringify(defaultPromotions));
    return defaultPromotions;
  }

  async savePromotions(promotions: Promotion[]): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.promotions, JSON.stringify(promotions));
  }

  async updatePromotion(id: string, updates: Partial<Promotion>): Promise<Promotion | undefined> {
    const promotions = await this.getPromotions();
    const index = promotions.findIndex(p => p.id === id);
    if (index !== -1) {
      promotions[index] = { ...promotions[index], ...updates };
      await this.savePromotions(promotions);
      return promotions[index];
    }
    return undefined;
  }

  async getOrders(): Promise<Order[]> {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEYS.orders);
    if (stored) {
      return JSON.parse(stored);
    }
    const mockOrders: Order[] = [
      {
        id: "ORD-001",
        customer_name: "Amina K.",
        customer_phone: "+15141234567",
        method: "whatsapp",
        status: "pending",
        items: [
          { product_id: 1, name: "Maquereau Surgele - Grand", quantity: 2, price: 31.28 },
          { product_id: 6, name: "Gari Jaune", quantity: 1, price: 115.60 },
        ],
        total: 178.16,
        created_at: "2026-04-04T10:30:00Z",
      },
      {
        id: "ORD-002",
        customer_name: "Jean-Paul M.",
        customer_phone: "+15142345678",
        method: "pickup",
        status: "confirmed",
        items: [
          { product_id: 2, name: "Tilapia Surgele", quantity: 3, price: 16.32 },
        ],
        total: 48.96,
        created_at: "2026-04-03T14:20:00Z",
      },
      {
        id: "ORD-003",
        customer_name: "Sandrine N.",
        customer_phone: "+15143456789",
        method: "delivery",
        status: "ready",
        items: [
          { product_id: 18, name: "Huile de Palme Rouge", quantity: 2, price: 18.99 },
          { product_id: 39, name: "Haricots Rouges", quantity: 2, price: 8.99 },
        ],
        total: 55.96,
        created_at: "2026-04-02T09:15:00Z",
      },
    ];
    localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(mockOrders));
    return mockOrders;
  }

  async getSettings(): Promise<StoreSettings> {
    if (typeof window === "undefined") return defaultSettings;
    const stored = localStorage.getItem(STORAGE_KEYS.settings);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultSettings, ...parsed };
    }
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(defaultSettings));
    return defaultSettings;
  }

  async saveSettings(settings: StoreSettings): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
  }
}

export const adminService = new AdminService();

export async function getStorefrontProducts(): Promise<Product[]> {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEYS.products);
  if (stored) {
    const products = JSON.parse(stored);
    return products.map((p: Product) => ({
      ...p,
      image: p?.image || PLACEHOLDER_IMAGE,
    }));
  }
  try {
    const response = await fetch("/products.json");
    const products = await response.json();
    return products.map((p: Product) => ({
      ...p,
      image: p?.image || PLACEHOLDER_IMAGE,
    }));
  } catch {
    return [];
  }
}

export function getProductImage(product: Product | undefined | null): string {
  return product?.image || PLACEHOLDER_IMAGE;
}

export async function getStorefrontSettings(): Promise<StoreSettings> {
  return adminService.getSettings();
}
