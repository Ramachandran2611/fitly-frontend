import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Hero from "../components/Hero";
import type { Product } from "../types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<number | null>(null);
  const { token, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    apiGet<Product[]>("/products")
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

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

      {loading && <p>Loading products…</p>}
      {error && <p>Something went wrong: {error}</p>}

      {!loading && !error && (
        <div className="products-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <h3>{product.name}</h3>
              <p className="brand">{product.brand} · {product.category_name}</p>
              <p className="price">
                {product.discount_price ? (
                  <>
                    <span className="discount">₹{product.discount_price}</span>{" "}
                    <span className="original">₹{product.price}</span>
                  </>
                ) : (
                  <span>₹{product.price}</span>
                )}
              </p>
              <p className="rating">★ {product.rating_avg} ({product.review_count})</p>
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
          ))}
        </div>
      )}
    </>
  );
}
