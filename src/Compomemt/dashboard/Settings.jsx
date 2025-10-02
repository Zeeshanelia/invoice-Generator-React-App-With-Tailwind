import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

export const Settings = () => {
  // Company data stored in localStorage
  const [companyData, setCompanyData] = useState(
    JSON.parse(localStorage.getItem("CompanyN") || "{}")
  );

  const [draftData, setDraftData] = useState(companyData); // <- buffer edits
  const [imgUrl, setImgUrl] = useState("");
  const [status, setStatus] = useState("");

  const BUCKET = "profile-images";
  const FOLDER = "profile";

  // Keep Settings synced with localStorage (Dashboard changes)
  useEffect(() => {
    const syncData = () => {
      const saved = JSON.parse(localStorage.getItem("CompanyN") || "{}");
      setCompanyData(saved);
      setDraftData(saved); // reset draft if external changes
      if (saved.image) {
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(saved.image);
        setImgUrl(data.publicUrl);
      }
    };
    window.addEventListener("storage", syncData);
    return () => window.removeEventListener("storage", syncData);
  }, []);

  // Initials when no image
  const initials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : "??";

  // Upload new profile image
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("Updating... changes will reflect soon");

    const userId = companyData?.id ?? "guest";
    const filename = `${userId}_${Date.now()}_${file.name}`;
    const path = `${FOLDER}/${filename}`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, file);

    if (!error) {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

      const updated = { ...companyData, image: path };
      localStorage.setItem("CompanyN", JSON.stringify(updated));
      setCompanyData(updated);
      setDraftData(updated);

      window.dispatchEvent(new Event("storage"));

      setImgUrl(data.publicUrl);
      setStatus("✅ Image updated!");
    } else {
      setStatus("❌ Failed to upload");
    }
  };

  // Draft input changes (not saved yet)
  const handleDraftChange = (e) => {
    const { name, value } = e.target;
    setDraftData({ ...draftData, [name]: value });
  };

  // Commit changes on OK button
  const handleSave = () => {
    localStorage.setItem("CompanyN", JSON.stringify(draftData));
    setCompanyData(draftData);

    // 🔥 Trigger Dashboard update
    window.dispatchEvent(new Event("storage"));

    setStatus("✅ Changes saved!");
  };

  return (
    <div className="flex justify-center  bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm text-center">
        <h2 className="text-lg font-semibold mb-4">Settings</h2>

        {/* Profile Image */}
        {imgUrl ? (
          <img
            src={imgUrl}
            alt="Profile"
            className="w-24 h-24 mx-auto rounded-full border-2 object-cover"
          />
        ) : (
          <div className="w-24 h-24 mx-auto rounded-full border-2 flex items-center justify-center bg-slate-600 text-white text-2xl">
            {initials(companyData?.companyName)}
          </div>
        )}

        {/* Upload Button */}
        <label
          htmlFor="fileInput"
          className="mt-3 inline-block bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
        >
          Change Image
        </label>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Status */}
        {status && <p className="mt-3 text-sm text-gray-600">{status}</p>}

        {/* Company Info */}
        <div className="mt-4 text-left space-y-3">
          <div>
            <label className="block text-sm font-medium">Company</label>
            <input
              type="text"
              name="companyName"
              value={draftData?.companyName || ""}
              onChange={handleDraftChange}
              className="mt-1 block w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={draftData?.email || ""}
              onChange={handleDraftChange}
              className="mt-1 block w-full border rounded px-2 py-1"
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          OK
        </button>
      </div>
    </div>
  );
};
