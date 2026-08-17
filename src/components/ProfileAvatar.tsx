import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { getImage, onImagesChanged, readFileAsDataUrl, removeImage, setImage } from "../practiceImages";

const PROFILE_KEY = "profile";

export default function ProfileAvatar() {
  const [image, setImageState] = useState<string | null>(() => getImage(PROFILE_KEY));
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => onImagesChanged(() => setImageState(getImage(PROFILE_KEY))), []);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    setImage(PROFILE_KEY, dataUrl);
    e.target.value = "";
  }

  return (
    <div className="profile-avatar">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="tile-image-input"
      />
      <button
        type="button"
        className="profile-avatar-circle"
        onClick={() => fileInputRef.current?.click()}
        aria-label="Change profile picture"
      >
        {image ? <img src={image} alt="Profile" /> : <span>+</span>}
      </button>
      {image && (
        <button
          type="button"
          className="profile-avatar-remove"
          onClick={() => removeImage(PROFILE_KEY)}
          aria-label="Remove profile picture"
        >
          ✕
        </button>
      )}
    </div>
  );
}
