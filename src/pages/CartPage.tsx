import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet, apiPatch, apiDelete } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Hero from "../components/Hero";
import type { CartResponse } from "../types";

export default function CartPage() {
  const { token, isLoggedIn } = useAuth();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function loadCart() {
    if (!token) return;
    setLoading(true);
    apiGet<CartResponse>("/cart", token)
      .then(setCart)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function updateQuantity(productId: number, quantity: number) {
    if (!token || quantity < 1) return;
    await apiPatch(`/cart/${productId}`, { quantity }, token);
    loadCart();
  }

  async function removeItem(productId: number) {
    if (!token) return;
    await apiDelete(`/cart/${productId}`, token);
    loadCart();
  }

  return (
    <>
      <Hero eyebrow="Fitly · Your Cart" headline="Ready to check out?" compact />

      {!isLoggedIn && (
        <p>
          <Link to="/login">Log in</Link> to view your cart.
        </p>
      )}
      {isLoggedIn && loading && <p>Loading cart…</p>}
      {isLoggedIn && error && <p>Something went wrong: {error}</p>}
      {isLoggedIn && !loading && !error && (!cart || cart.items.length === 0) && (
        <p>Your cart is empty.</p>
      )}

      {isLoggedIn && cart && cart.items.length > 0 && (
        <div className="cart">
          {cart.items.map((item) => (
            <div className="cart-row" key={item.product_id}>
              <span className="cart-name">{item.name}</span>
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => updateQuantity(item.product_id, Number(e.target.value))}
              />
              <span className="cart-subtotal">₹{item.subtotal.toFixed(2)}</span>
              <button onClick={() => removeItem(item.product_id)}>Remove</button>
            </div>
          ))}
          <p className="cart-total">Total: ₹{cart.total.toFixed(2)}</p>
        </div>
      )}
    </>
  );
}
