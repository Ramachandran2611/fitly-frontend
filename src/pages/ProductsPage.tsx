import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Hero from "../components/Hero";
import ProductIcon from "../components/ProductIcon";
import type { Product } from "../types";

interface Category {
  id: number;
  name: string;
  slug: string;
}

const CARD_COLORS = ["#A21A5C", "#3B3266", "#5A4433", "#D9631E", "#0F6B57"];

function badgeFor(product: Product): { label: string; tone: "best" | "sale" } | null {
  if (Number(product.rating_avg) >= 4.6) return { label: "Bestseller", tone: "best" };
  if (product.discount_price) return { label: "Sale", tone: "sale" };
  return null;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<number | null>(null);
  const { token, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    apiGet<Category[]>("/categories").then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const query = activeCategory ? `?category=${activeCategory}` : "";
    apiGet<Product[]>(`/products${query}`)
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  async function addToCart(productId: number) {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    await apiPost("/cart", { productId: String(productId), quantity: 1 }, token ?? undefined);
    setAddedId(productId);
    setTimeout(() => setAddedId(null), 1500);
  }

  return (
    <>
      <Hero
        eyebrow="Fitly · Gym Supplements"
        headline={<>Strength starts<br />in the kitchen.</>}
      />

      <div className="trust-bar">
        <span>Free shipping on orders above ₹999</span>
        <span>Cash on delivery available</span>
        <span>100% authentic, lab-tested supplements</span>
      </div>

      <div className="category-pills">
        <button
          className={activeCategory === null ? "pill active" : "pill"}
          onClick={() => setActiveCategory(null)}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            className={activeCategory === c.slug ? "pill active" : "pill"}
            onClick={() => setActiveCategory(c.slug)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {loading && <p>Loading products…</p>}
      {error && <p>Something went wrong: {error}</p>}

      {!loading && !error && (
        <div className="products-grid">
          {products.map((product, i) => {
            const badge = badgeFor(product);
            const color = CARD_COLORS[i % CARD_COLORS.length];
            const discountPct = product.discount_price
              ? Math.round(
                  (1 - Number(product.discount_price) / Number(product.price)) * 100
                )
              : 0;

            return (
              <div className="product-card" key={product.id}>
                <div className="product-media" style={{ background: color }}>
                  {badge && <span className={`ribbon ribbon-${badge.tone}`}>{badge.label}</span>}
                  <span className="rating-pill">★ {product.rating_avg}</span>
                  <ProductIcon seed={product.id} />
                </div>
                <div className="product-body">
                  <p className="brand">{product.brand} · {product.category_name}</p>
                  <h3>{product.name}</h3>
                  <p className="price">
                    {product.discount_price ? (
                      <>
                        <span className="discount">₹{product.discount_price}</span>{" "}
                        <span className="original">₹{product.price}</span>{" "}
                        <span className="off-badge">{discountPct}% OFF</span>
                      </>
                    ) : (
                      <span>₹{product.price}</span>
                    )}
                  </p>
                  <p className="mrp-note">MRP inclusive of all taxes</p>
                  <p className={product.stock_quantity > 0 ? "in-stock" : "out-of-stock"}>
                    {product.stock_quantity > 0 ? "In stock" : "Sold out"}
                  </p>
                  <button
                    disabled={product.stock_quantity === 0}
                    onClick={() => addToCart(product.id)}
                  >
                    {addedId === product.id ? "Added ✓" : "Add to Cart"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
