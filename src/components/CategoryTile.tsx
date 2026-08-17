import { useEffect, useRef, useState, type ChangeEvent, type MouseEvent } from "react";
import ProductIcon from "./ProductIcon";
import { getImage, onImagesChanged, readFileAsDataUrl, removeImage, setImage } from "../practiceImages";

export default function CategoryTile({
  slug,
  label,
  seed,
  active,
  onSelect,
}: {
  slug: string;
  label: string;
  seed: number;
  active: boolean;
  onSelect: () => void;
}) {
  const imageKey = `category:${slug}`;
  const [image, setImageState] = useState<string | null>(() => getImage(imageKey));
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => onImagesChanged(() => setImageState(getImage(imageKey))), [imageKey]);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    setImage(imageKey, dataUrl);
    e.target.value = "";
  }

  function handleAddClick(e: MouseEvent) {
    e.stopPropagation();
    fileInputRef.current?.click();
  }

  function handleRemoveClick(e: MouseEvent) {
    e.stopPropagation();
    removeImage(imageKey);
  }

  return (
    <div className={active ? "category-tile active" : "category-tile"} onClick={onSelect}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="tile-image-input"
      />
      {image ? (
        <img className="tile-image" src={image} alt={label} />
      ) : (
        <ProductIcon seed={seed} size={40} />
      )}
      <span>{label}</span>

      {image ? (
        <button type="button" className="tile-image-remove" onClick={handleRemoveClick}>
          ✕
        </button>
      ) : (
        <button type="button" className="tile-image-add" onClick={handleAddClick}>
          + Image
        </button>
      )}
    </div>
  );
}
