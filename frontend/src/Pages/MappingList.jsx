import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllMappings } from "../endpoint.js";

export default function MappingListPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["mappings"],
    queryFn: getAllMappings,
    staleTime: 1000 * 60, // 1 minute cache
  });

  const mappings = useMemo(() => data || [], [data]);

  if (isLoading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Saved Mappings</h2>
        <div className="text-gray-600">Loading mappings…</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Saved Mappings</h2>
        <div className="text-red-600">Failed to load mappings: {error?.message || "Unknown error"}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Saved Mappings</h2>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 font-medium text-gray-700">Marketplace</th>
              <th className="p-3 font-medium text-gray-700">Seller File</th>
              <th className="p-3 font-medium text-gray-700">Created At</th>
              <th className="p-3 font-medium text-gray-700 text-center">View</th>
            </tr>
          </thead>

          <tbody>
            {mappings.map((m) => (
              <tr key={m.id || m._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3">{m.marketplaceName}</td>
                <td className="p-3">{m.sellerFilename}</td>
                <td className="p-3">{new Date(m.createdAt).toLocaleString()}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => {
                      // pretty-print mapping JSON in a new window for nicer viewing
                      const w = window.open("", "_blank", "width=700,height=600");
                      if (!w) {
                        alert(JSON.stringify(m, null, 2));
                        return;
                      }
                      w.document.write("<pre>" + JSON.stringify(m, null, 2) + "</pre>");
                      w.document.title = "Mapping Details";
                    }}
                    className="px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                  >
                    View JSON
                  </button>
                </td>
              </tr>
            ))}

            {mappings.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500 italic">
                  No mappings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
