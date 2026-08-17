import { useState, type FormEvent } from "react";

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [details, setDetails] = useState("");
  const [price, setPrice] = useState("");
  const [result, setResult] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const payload = { id, name, details, price };

    // TODO: call your own API here, e.g.
    // const res = await fetch("http://localhost:4000/products", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });

    console.log("Practice payload:", payload);
    setResult(JSON.stringify(payload, null, 2));
  }

  return (
    <div className="practice-page">
      <h2>Add Product (practice page)</h2>
      <p className="practice-hint">
        This page is blank on purpose — wire up your own API call inside{" "}
        <code>handleSubmit</code> in <code>AddProductPage.tsx</code>.
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

        <button type="submit">Submit</button>
      </form>

      {result && (
        <pre className="practice-result">{result}</pre>
      )}
    </div>
  );
}
