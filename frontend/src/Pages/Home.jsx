import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Product Mapping Tool</h1>
        <p className="mt-2 text-gray-600">
          Quick bulk product mapping utility — upload marketplace template, upload seller file, map columns and save mappings.
        </p>
      </header>

      <main className="grid gap-4 sm:grid-cols-2">
        <Card
          title="1. Create Marketplace Template"
          desc="Add a marketplace template (CSV or manual) — the list of fields you want sellers to map to."
          to="/marketplace-upload"
          cta="Create Template"
        />

        <Card
          title="2. Upload Seller File"
          desc="Upload seller CSV / Excel. The system detects columns and sample rows for mapping."
          to="/seller-upload"
          cta="Upload Seller File"
        />

        <Card
          title="3. Mapping UI"
          desc="Map seller file columns to marketplace attributes and save the mapping for reuse."
          to="/mapping"
          cta="Map Columns"
        />

        <Card
          title="4. Saved Mappings"
          desc="View all mappings you or others have saved. Useful for auditing and reuse."
          to="/mappings"
          cta="View Mappings"
        />
      </main>

      <footer className="mt-8 text-sm text-blue-500">
        Tip: Complete steps 1 and 2 before mapping. Use the 'Next' links on each page for a fast flow.
      </footer>
    </div>
  );
}

function Card({ title, desc, to, cta }) {
  return (
    <Link to={to} className="block p-4 bg-white border rounded-lg shadow hover:shadow-lg transition">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{desc}</p>
      <div className="mt-4">
        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">{cta}</button>
      </div>
    </Link>
  );
}
