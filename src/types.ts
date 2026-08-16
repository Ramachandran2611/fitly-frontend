export interface Product {
  id: number;
  name: string;
  brand: string;
  price: string;
  discount_price: string | null;
  stock_quantity: number;
  is_veg: boolean;
  rating_avg: string;
  review_count: number;
  description: string | null;
  image_url: string | null;
  category_name: string;
  category_slug: string;
}
