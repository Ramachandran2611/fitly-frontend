import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { apiGet, apiPost } from "../api/client";
import { useAuth } from "../context/AuthContext";
import ProductIcon from "../components/ProductIcon";
import HeroIllustration from "../components/HeroIllustration";
import CategoryTile from "../components/CategoryTile";
import { applyPracticeEdits, getPracticeProducts, onPracticeProductsChanged } from "../practiceProducts";
import type { Product } from "../types";

interface Category {
  id: number;
  name: string;
  slug: string;
}

function badgeFor(product: Product): { label: string; tone: "best" | "sale" } | null {
  if (Number(product.rating_avg) >= 4.6) return { label: "Bestseller", tone: "best" };
  if (product.discount_price) return { label: "Sale", tone: "sale" };
  return null;
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const activeCategory = searchParams.get("category");
  const activeBrand = searchParams.get("brand");
  const sort = searchParams.get("sort");
  const location = useLocation();

  const [products, setProducts] = useState<Product[]>([]);
  const [practiceProducts, setPracticeProducts] = useState<Product[]>(getPracticeProducts());
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<number | null>(null);
  const [cartError, setCartError] = useState<{ productId: number; message: string } | null>(null);
  const { token, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    apiGet<Category[]>("/categories").then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    return onPracticeProductsChanged(() => setPracticeProducts(getPracticeProducts()));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeCategory) params.set("category", activeCategory);
    if (activeBrand) params.set("brand", activeBrand);
    if (search) params.set("search", search);
    if (sort) params.set("sort", sort);
    const query = params.toString() ? `?${params.toString()}` : "";
    apiGet<Product[]>(`/products${query}`)
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [activeCategory, activeBrand, search, sort]);

  useEffect(() => {
    if (!location.hash) return;
    const el = document.querySelector(location.hash);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.hash, loading]);

  function selectCategory(slug: string | null) {
    const next = new URLSearchParams(searchParams);
    if (slug) next.set("category", slug);
    else next.delete("category");
    setSearchParams(next);
  }

  function selectBrand(brand: string | null) {
    const next = new URLSearchParams(searchParams);
    if (brand) next.set("brand", brand);
    else next.delete("brand");
    setSearchParams(next);
  }

  function showDealsOnly() {
    navigate("/?deals=1");
  }

  async function addToCart(productId: number, isPractice: boolean) {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (isPractice) {
      setCartError({
        productId,
        message: "This is a practice product (saved locally) — it doesn't exist in the real database yet, so it can't be added to the cart.",
      });
      setTimeout(() => setCartError(null), 4000);
      return;
    }

    try {
      await apiPost("/cart", { productId: String(productId), quantity: 1 }, token ?? undefined);
      setAddedId(productId);
      setTimeout(() => setAddedId(null), 1500);
    } catch (err) {
      setCartError({
        productId,
        message: err instanceof Error ? err.message : "Could not add this product to the cart.",
      });
      setTimeout(() => setCartError(null), 4000);
    }
  }

  const practiceIds = new Set(practiceProducts.map((p) => p.id));
  const allProducts = [...practiceProducts, ...applyPracticeEdits(products)];
  const dealsOnly = searchParams.get("deals") === "1";
  const visibleProducts = dealsOnly ? allProducts.filter((p) => p.discount_price) : allProducts;
  const topDeals = allProducts.filter((p) => p.discount_price).slice(0, 4);
  const brands = Array.from(new Set(allProducts.map((p) => p.brand))).sort();

  return (
    <>
      <div className="home-hero">
        <div className="home-hero-copy">
          <p className="home-hero-eyebrow">BUILD YOUR BEST</p>
          <h1 className="home-hero-headline">
            Stronger.
            <br />
            Fitter.
            <br />
            <span className="accent">Better.</span>
          </h1>
          <p>Premium quality fitness equipment and supplements to power your fitness journey.</p>
          <div className="home-hero-ctas">
            <button className="cta-primary" onClick={() => selectCategory(null)}>
              Shop now
            </button>
            <button className="cta-secondary" onClick={showDealsOnly}>
              Explore deals
            </button>
          </div>
        </div>
        <div className="home-hero-media">
          <HeroIllustration />
        </div>
      </div>

      <div className="trust-bar">
        <span>Free shipping on orders above ₹999</span>
        <span>Cash on delivery available</span>
        <span>100% authentic, lab-tested supplements</span>
      </div>

      <p className="section-title" id="categories">Shop by category</p>
      <div className="category-tiles">
        <CategoryTile
          slug="all"
          label="All"
          seed={0}
          active={activeCategory === null}
          onSelect={() => selectCategory(null)}
        />
        {categories.map((c) => (
          <CategoryTile
            key={c.id}
            slug={c.slug}
            label={c.name}
            seed={c.id}
            active={activeCategory === c.slug}
            onSelect={() => selectCategory(c.slug)}
          />
        ))}
      </div>

      {brands.length > 0 && (
        <>
          <p className="section-title" id="brands">Shop by brand</p>
          <div className="category-pills">
            <button
              className={activeBrand === null ? "pill active" : "pill"}
              onClick={() => selectBrand(null)}
            >
              All brands
            </button>
            {brands.map((b) => (
              <button
                key={b}
                className={activeBrand === b ? "pill active" : "pill"}
                onClick={() => selectBrand(b)}
              >
                {b}
              </button>
            ))}
          </div>
        </>
      )}

      {!dealsOnly && topDeals.length > 0 && (
        <>
          <p className="section-title">Top deals for you</p>
          <div className="deals-row">
            {topDeals.map((p) => {
              const pct = Math.round((1 - Number(p.discount_price) / Number(p.price)) * 100);
              return (
                <div className="deal-card" key={p.id}>
                  <div className="deal-media">
                    <ProductIcon seed={p.id} size={56} />
                  </div>
                  <span className="deal-badge">-{pct}%</span>
                  <p className="deal-name">{p.name}</p>
                  <span className="deal-price">₹{p.discount_price}</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      <p className="section-title" id="all-products">
        {dealsOnly ? "Deals" : "All products"}
      </p>

      {loading && <p>Loading products…</p>}
      {error && <p>Something went wrong: {error}</p>}

      {!loading && !error && (
        <div className="products-grid">
          {visibleProducts.map((product) => {
            const badge = badgeFor(product);
            const discountPct = product.discount_price
              ? Math.round(
                  (1 - Number(product.discount_price) / Number(product.price)) * 100
                )
              : 0;

            return (
              <div className="product-card" key={product.id}>
                <div className="product-media">
                  {badge && <span className={`ribbon ribbon-${badge.tone}`}>{badge.label}</span>}
                  <span className="rating-pill">★ {product.rating_avg}</span>
                  {product.image_url ? (
                    <img className="product-image" src={product.image_url} alt={product.name} />
                  ) : (
                    <ProductIcon seed={product.id} />
                  )}
                </div>
                <div className="product-body">
                  <p className="brand">{product.brand} · {product.category_name}</p>
                  <h3>{product.name}</h3>
                  <p className="price">
                    {product.discount_price ? (
                      <>
                        ₹{product.discount_price}{" "}
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
                    onClick={() => addToCart(product.id, practiceIds.has(product.id))}
                  >
                    {addedId === product.id ? "Added ✓" : "Add to Cart"}
                  </button>
                  {cartError?.productId === product.id && (
                    <p className="cart-error">{cartError.message}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
