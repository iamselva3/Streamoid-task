// src/pages/SellerUploadPage.jsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { uploadSellerFile } from "../endpoint.js";


export default function SellerUploadPage() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (formData) => {
      
      return uploadSellerFile(formData);
    },
    onSuccess: (data, variables) => {
   
      const columns = data.columns || [];
      const filename = variables.get("file")?.name || "seller.csv";
      sessionStorage.setItem("sellerColumns", JSON.stringify(columns));
      sessionStorage.setItem("sellerFilename", filename);
      
      navigate("/mapping");
    },
    onError: (err) => {
      console.error("Upload failed:", err);
      
      alert("Upload failed: " + (err?.message || "unknown error"));
    },
  });

  const handleUpload = () => {
    if (!file) {
      alert("Select a file first!");
      return;
    }
    const form = new FormData();
    form.append("file", file);
    mutation.mutate(form);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Upload Seller File
      </h2>

     
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Choose CSV / Excel File
        </label>
        <input
          type="file"
          accept=".csv, .xlsx, .xls"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-sm text-gray-700 bg-white border border-gray-300 rounded cursor-pointer file:px-4 file:py-2 file:border-0 file:bg-blue-600 file:text-white file:rounded file:cursor-pointer hover:file:bg-blue-700"
        />
      </div>


      <button
        onClick={handleUpload}
        disabled={mutation.isLoading}
        className="w-full py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition disabled:opacity-60"
      >
        {mutation.isLoading ? "Uploading…" : "Upload"}
      </button>

   
      {mutation.isError && (
        <div className="mt-4 text-sm text-red-600">
          Error: {mutation.error?.message || "Upload failed"}
        </div>
      )}

    
      <ColumnsPreview />
    </div>
  );
}

function ColumnsPreview() {
  const stored = sessionStorage.getItem("sellerColumns");
  const columns = stored ? JSON.parse(stored) : [];
  if (!columns || columns.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-800 mb-3">Detected Columns</h3>

      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
          {columns.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>

      <div className="mt-5 text-center">
        <button
          onClick={() => (window.location.href = "/mapping")}
          className="text-blue-600 hover:underline text-sm"
        >
          Next → Mapping Page
        </button>
      </div>
    </div>
  );
}
