export interface CartItem {
  product_id: number;
  quantity: number;
  name: string;
  price: string;
  discount_price: string | null;
  image_url: string | null;
  stock_quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface CartResponse {
  items: CartItem[];
  total: number;
}

export interface Address {
  id: number;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface OrderItem {
  product_id: number;
  name: string;
  quantity: number;
  price_at_purchase: string;
}

export interface Payment {
  status: string;
  method: string;
  mock_transaction_id: string;
}

export interface Order {
  id: number;
  address_id: number;
  total_amount: string;
  status: string;
  items: OrderItem[];
  payment: Payment | null;
}

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
