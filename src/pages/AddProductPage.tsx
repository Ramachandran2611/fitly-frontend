import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { addPracticeProduct } from "../practiceProducts";
import type { Product } from "../types";

export default function AddProductPage() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [price, setPrice] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const navigate = useNavigate();

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

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const payload = { id, name, details, price, image: imageDataUrl };

    // TODO: call your own API here instead of the local save below, e.g.
    // const res = await fetch("http://localhost:4000/products", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });
    console.log("Practice payload:", payload);

    const product: Product = {
      id: id ? Number(id) : Date.now(),
      name: name || "Untitled product",
      brand: "Practice",
      price: price || "0",
      discount_price: null,
      stock_quantity: 10,
      is_veg: true,
      rating_avg: "5.0",
      review_count: 0,
      description: details || null,
      image_url: imageDataUrl,
      category_name: "Practice",
      category_slug: "practice",
    };

    addPracticeProduct(product);
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

      <form className="practice-form" onSubmit={handleSubmit}>
        <label>
          Product ID
          <input value={id} onChange={(e) => setId(e.target.value)} />
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
          </div>
        )}
        {!imageDataUrl && (
          <div className="practice-image-holder practice-image-empty">No image selected</div>
        )}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
