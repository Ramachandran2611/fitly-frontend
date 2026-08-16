import { useEffect, useState } from "react";
import { apiGet } from "../api/client";
import type { Product } from "../types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<Product[]>("/products")
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading products…</p>;
  if (error) return <p>Something went wrong: {error}</p>;

  return (
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
        </div>
      ))}
    </div>
  );
}
