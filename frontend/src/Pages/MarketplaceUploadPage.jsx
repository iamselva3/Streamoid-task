import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";// adjust path
import { uploadMarketplaceTemplate } from "../endpoint.js";

export default function MarketplaceUploadPage() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (formData) => uploadMarketplaceTemplate(formData),
    onSuccess: (data) => {
      alert("Marketplace template created!");
      console.log("Uploaded:", data);
      navigate("/seller-upload"); 
    },
    onError: (err) => {
      console.error(err);
      alert("Upload failed: " + (err.message || "unknown error"));
    },
  });

  const handleUpload = () => {
    if (!file && !name) {
      alert("Provide a template name or upload a CSV file!");
      return;
    }

    const form = new FormData();
    if (file) form.append("file", file);
    if (name) form.append("name", name);

    mutation.mutate(form);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Create Marketplace Template
      </h2>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Template Name (optional)
        </label>
        <input
          type="text"
          placeholder="Enter template name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload CSV Template
        </label>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-sm text-gray-700 bg-white border border-gray-300 rounded cursor-pointer file:px-4 file:py-2 file:border-0 file:bg-blue-600 file:text-white file:rounded hover:file:bg-blue-700"
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={mutation.isLoading}
        className="w-full py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition disabled:opacity-60"
      >
        {mutation.isLoading ? "Uploading…" : "Upload Template"}
      </button>

     
      <div className="mt-6 text-center">
        <a href="/seller-upload" className="text-blue-600 hover:underline text-sm">
          Next → Upload Seller File
        </a>
      </div>
    </div>
  );
}
