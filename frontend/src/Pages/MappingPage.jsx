// src/pages/MappingPage.jsx
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getAllMarketplaces, saveMapping } from "../endpoint";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MappingPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const sellerColumns = JSON.parse(sessionStorage.getItem("sellerColumns")) || [];
  const sellerFilename = sessionStorage.getItem("sellerFilename") || "";

  const [selectedId, setSelectedId] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [mapping, setMapping] = useState({});
  const [confirmSaveWithoutMapping, setConfirmSaveWithoutMapping] = useState(false);

  const { data: marketplaces = [], isLoading, isError, error } = useQuery({
    queryKey: ["marketplaces"],
    queryFn: getAllMarketplaces,
    staleTime: 1000 * 60 * 5,
  });

  const mutation = useMutation({
    mutationFn: saveMapping,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["mappings"]);
      toast.success("Mapping saved!", { autoClose: 1400 });
      setTimeout(() => navigate("/mappings"), 1400);
    },
    onError: (err) => {
      console.error("Save mapping error:", err);
      toast.error("Failed to save mapping: " + (err?.message || "unknown"), { autoClose: 3000 });
    },
  });

  useEffect(() => {
    const mp = marketplaces.find((m) => m._id === selectedId);
    setAttributes(mp?.attributes || []);
    setMapping({});
    setConfirmSaveWithoutMapping(false);
  }, [selectedId, marketplaces]);

  const handleSave = () => {
    if (!selectedId) {
      toast.warning("Select marketplace first!", { autoClose: 2000 });
      return;
    }

    // basic validation: at least one mapping required
    if (Object.keys(mapping).length === 0) {
      if (!confirmSaveWithoutMapping) {
        setConfirmSaveWithoutMapping(true);
        toast.info("You haven't mapped any attributes. Click Save again to confirm saving without mappings.", { autoClose: 3500 });
        return;
      }
      // if user already confirmed once, proceed and reset the flag
      setConfirmSaveWithoutMapping(false);
    }

    const body = {
      marketplaceId: selectedId,
      sellerFilename,
      sellerColumns,
      mapping,
      sampleRows: [],
      createdBy: "frontend-user",
    };

    mutation.mutate(body);
  };

  if (isLoading) {
    return <div className="p-6 max-w-4xl mx-auto">Loading marketplaces…</div>;
  }

  if (isError) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-red-600">
        Failed to load marketplaces: {error?.message || "Unknown error"}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ToastContainer />

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Map Seller Columns → Marketplace Attributes</h2>
        <p className="text-sm text-gray-600 mt-1">
          Seller file: <span className="font-medium text-gray-800">{sellerFilename || "— not set —"}</span>
        </p>
      </div>

      <div className="mb-6">
        <label htmlFor="marketplace" className="block text-sm font-medium text-gray-700 mb-2">
          Choose Marketplace
        </label>
        <select
          id="marketplace"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 bg-white"
        >
          <option value="">Select Marketplace</option>
          {marketplaces.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      {attributes.length > 0 ? (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow border p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Attribute mapping</h3>

            <div className="grid gap-3">
              {attributes.map((attr) => (
                <div key={attr.key} className="flex flex-col md:flex-row md:items-center md:gap-4">
                  <div className="w-full md:w-1/3">
                    <span className="text-sm font-medium text-gray-700">{attr.key}</span>
                    <div className="text-xs text-gray-500">{attr.label || ""}</div>
                  </div>

                  <div className="w-full md:w-2/3 mt-2 md:mt-0">
                    <label className="sr-only" htmlFor={`map-${attr.key}`}>
                      Map {attr.key}
                    </label>
                    <select
                      id={`map-${attr.key}`}
                      value={mapping[attr.key] || ""}
                      onChange={(e) =>
                        setMapping((prev) => ({
                          ...prev,
                          [attr.key]: e.target.value,
                        }))
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 bg-white"
                    >
                      <option value="">Select seller column</option>
                      {sellerColumns.map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 border rounded-lg p-4 text-sm text-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Current mapping preview</span>
              <span className="text-xs text-gray-500">{Object.keys(mapping).length} mapped</span>
            </div>

            {Object.keys(mapping).length === 0 ? (
              <div className="italic text-gray-500">No mappings chosen yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(mapping).map(([attrKey, col]) => (
                  <div key={attrKey} className="flex items-center justify-between bg-white border rounded px-3 py-2">
                    <div>
                      <div className="text-sm font-medium text-gray-700">{attrKey}</div>
                      <div className="text-xs text-gray-500">{col}</div>
                    </div>
                    <button
                      onClick={() =>
                        setMapping((prev) => {
                          const copy = { ...prev };
                          delete copy[attrKey];
                          return copy;
                        })
                      }
                      className="text-xs text-red-600 hover:underline"
                      aria-label={`Remove mapping for ${attrKey}`}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 items-center">
            <button
              onClick={handleSave}
              disabled={mutation.isLoading}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
            >
              {mutation.isLoading ? "Saving..." : "Save Mapping"}
            </button>

            <button
              onClick={() => navigate("/mappings")}
              className="text-sm text-gray-600 hover:underline"
            >
              Go to Saved Mappings
            </button>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500 italic">Select a marketplace to see attributes.</div>
      )}
    </div>
  );
}
