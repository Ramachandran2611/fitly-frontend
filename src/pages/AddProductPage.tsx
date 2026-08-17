import { useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../api/client";
import { addPracticeProduct, deleteProduct, findProduct, saveProductEdit } from "../practiceProducts";
import type { Product } from "../types";

const emptyForm = { id: "", name: "", details: "", price: "" };

export default function AddProductPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchStatus, setSearchStatus] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingOriginal, setEditingOriginal] = useState<Product | null>(null);

  const [id, setId] = useState(emptyForm.id);
  const [name, setName] = useState(emptyForm.name);
  const [details, setDetails] = useState(emptyForm.details);
  const [price, setPrice] = useState(emptyForm.price);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  function loadIntoForm(product: Product) {
    setEditingId(product.id);
    setEditingOriginal(product);
    setId(String(product.id));
    setName(product.name);
    setDetails(product.description ?? "");
    setPrice(product.price);
    setImageDataUrl(product.image_url);
  }

  function resetForm() {
    setEditingId(null);
    setEditingOriginal(null);
    setId(emptyForm.id);
    setName(emptyForm.name);
    setDetails(emptyForm.details);
    setPrice(emptyForm.price);
    setImageDataUrl(null);
    setSearchStatus(null);
  }

  async function handleSearch() {
    if (!searchQuery.trim()) return;
    setSearchStatus("Searching…");
    try {
      const backendMatches = await apiGet<Product[]>(
        `/products?search=${encodeURIComponent(searchQuery.trim())}`
      );
      const found = findProduct(searchQuery, backendMatches);
      if (found) {
        loadIntoForm(found);
        setSearchStatus(`Loaded "${found.name}" (id ${found.id}) for editing.`);
      } else {
        setSearchStatus("No product found with that name or id.");
      }
    } catch {
      setSearchStatus("No product found with that name or id.");
    }
  }

  function handleSearchKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setImageDataUrl(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  function buildProduct(productId: number): Product {
    const base: Product = editingOriginal ?? {
      id: productId,
      name: "",
      brand: "Practice",
      price: "0",
      discount_price: null,
      stock_quantity: 10,
      is_veg: true,
      rating_avg: "5.0",
      review_count: 0,
      description: null,
      image_url: null,
      category_name: "Practice",
      category_slug: "practice",
    };

    return {
      ...base,
      id: productId,
      name: name || "Untitled product",
      price: price || "0",
      description: details || null,
      image_url: imageDataUrl,
    };
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const payload = { id, name, details, price, image: imageDataUrl };

    // TODO: call your own API here instead of the local save below, e.g.
    // const res = await fetch("http://localhost:4000/products", {
    //   method: editingId ? "PATCH" : "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });
    console.log("Practice payload:", payload);

    if (editingId !== null) {
      saveProductEdit(buildProduct(editingId));
    } else {
      addPracticeProduct(buildProduct(id ? Number(id) : Date.now()));
    }

    navigate("/#all-products");
  }

  function handleDelete() {
    if (editingId === null) return;
    deleteProduct(editingId);
    resetForm();
    navigate("/#all-products");
  }

  return (
    <div className="practice-page">
      <h2>Add Product (practice page)</h2>
      <p className="practice-hint">
        This saves locally and shows up on the products page right away. Swap the local
        save inside <code>handleSubmit</code> in <code>AddProductPage.tsx</code> for your
        own API call whenever you're ready.
      </p>

      <div className="practice-search">
        <input
          placeholder="Find a product by name or id…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
        <button type="button" onClick={handleSearch}>Find</button>
        {editingId !== null && (
          <button type="button" className="practice-search-clear" onClick={resetForm}>
            New product
          </button>
        )}
      </div>
      {searchStatus && <p className="practice-hint">{searchStatus}</p>}

      <form className="practice-form" onSubmit={handleSubmit}>
        <label>
          Product ID
          <input value={id} onChange={(e) => setId(e.target.value)} disabled={editingId !== null} />
        </label>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Details
          <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={4} />
        </label>
        <label>
          Price
          <input value={price} onChange={(e) => setPrice(e.target.value)} />
        </label>
        <label>
          Image
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        {imageDataUrl && (
          <div className="practice-image-holder">
            <img src={imageDataUrl} alt="Product preview" />
            <button type="button" className="practice-image-remove" onClick={() => setImageDataUrl(null)}>
              Remove image
            </button>
          </div>
        )}
        {!imageDataUrl && (
          <div className="practice-image-holder practice-image-empty">No image selected</div>
        )}

        <div className="practice-form-actions">
          <button type="submit">{editingId !== null ? "Save changes" : "Submit"}</button>
          {editingId !== null && (
            <button type="button" className="practice-delete" onClick={handleDelete}>
              Delete product
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
