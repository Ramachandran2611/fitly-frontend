import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { apiGet, apiPatch, apiDelete, apiPost } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Hero from "../components/Hero";
import type { Address, CartResponse, Order } from "../types";

const emptyAddressForm = { line1: "", city: "", state: "", pincode: "", phone: "" };

export default function CartPage() {
  const { token, isLoggedIn } = useAuth();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [addingNewAddress, setAddingNewAddress] = useState(false);
  const [addressForm, setAddressForm] = useState(emptyAddressForm);
  const [paying, setPaying] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

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

  async function openCheckout() {
    if (!token) return;
    setCheckoutError(null);
    setCheckoutOpen(true);
    try {
      const list = await apiGet<Address[]>("/addresses", token);
      setAddresses(list);
      if (list.length > 0) {
        setSelectedAddressId(String(list[0].id));
        setAddingNewAddress(false);
      } else {
        setAddingNewAddress(true);
      }
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Could not load addresses");
    }
  }

  function closeCheckout() {
    setCheckoutOpen(false);
    setAddressForm(emptyAddressForm);
    setCheckoutError(null);
  }

  async function handlePay(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setPaying(true);
    setCheckoutError(null);

    try {
      let addressId = selectedAddressId;

      if (addingNewAddress) {
        const created = await apiPost<Address>("/addresses", addressForm, token);
        addressId = String(created.id);
      }

      if (!addressId) {
        throw new Error("Please select or add a delivery address");
      }

      const order = await apiPost<Order>("/checkout", { addressId }, token);
      const paid = await apiPost<Order>(`/orders/${order.id}/pay`, {}, token);

      setCompletedOrder(paid);
      setCheckoutOpen(false);
      loadCart();
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setPaying(false);
    }
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
          <button className="checkout-btn" onClick={openCheckout}>
            Proceed to Payment
          </button>
        </div>
      )}

      {checkoutOpen && (
        <div className="modal-overlay" onClick={closeCheckout}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Delivery address</h3>

            {checkoutError && <p className="error">{checkoutError}</p>}

            {addresses.length > 0 && (
              <div className="address-list">
                {addresses.map((addr) => (
                  <label key={addr.id} className="address-option">
                    <input
                      type="radio"
                      name="address"
                      checked={!addingNewAddress && selectedAddressId === String(addr.id)}
                      onChange={() => {
                        setSelectedAddressId(String(addr.id));
                        setAddingNewAddress(false);
                      }}
                    />
                    <span>
                      {addr.line1}, {addr.city}, {addr.state} {addr.pincode} · {addr.phone}
                    </span>
                  </label>
                ))}
                <label className="address-option">
                  <input
                    type="radio"
                    name="address"
                    checked={addingNewAddress}
                    onChange={() => setAddingNewAddress(true)}
                  />
                  <span>Use a new address</span>
                </label>
              </div>
            )}

            <form onSubmit={handlePay}>
              {addingNewAddress && (
                <div className="address-form">
                  <input
                    placeholder="Address line"
                    value={addressForm.line1}
                    onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })}
                    required
                  />
                  <input
                    placeholder="City"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    required
                  />
                  <input
                    placeholder="State"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    required
                  />
                  <input
                    placeholder="Pincode"
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    required
                  />
                  <input
                    placeholder="Phone"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    required
                  />
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="modal-cancel" onClick={closeCheckout}>
                  Cancel
                </button>
                <button type="submit" disabled={paying}>
                  {paying ? "Processing…" : `Pay ₹${cart?.total.toFixed(2) ?? "0.00"}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {completedOrder && (
        <div className="modal-overlay" onClick={() => setCompletedOrder(null)}>
          <div className="modal-card success-card" onClick={(e) => e.stopPropagation()}>
            <div className="success-check">✓</div>
            <h3>Payment successful</h3>
            <p className="practice-hint">
              Order #{completedOrder.id} · ₹{Number(completedOrder.total_amount).toFixed(2)} ·{" "}
              {completedOrder.status}
            </p>
            <button onClick={() => setCompletedOrder(null)}>Continue shopping</button>
          </div>
        </div>
      )}
    </>
  );
}
