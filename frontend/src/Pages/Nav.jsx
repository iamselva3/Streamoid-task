// src/Pages/Nav.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false); 
  const dropdownRef = useRef(null);

  // read user info from localStorage (set at login)
  const name = localStorage.getItem("name") || null;
  const role = localStorage.getItem("role") || null;
  const token = localStorage.getItem("token") || null;

  // hide auth/profile UI on login page
  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    const skip = ["/login", "/logout", "/favicon.ico"];
    if (!skip.includes(location.pathname)) {
      localStorage.setItem("lastVisited", location.pathname);
    }
  }, [location.pathname]);

 
  useEffect(() => {
    function onDoc(e) {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/login");
  };

  // role helpers
  const isAdmin = role === "admin" || role === "superadmin";
  const isSuper = role === "superadmin";
  const isSeller = role === "seller";

  return (
    <nav className="w-full bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        <div className="flex items-center gap-6">
          <Link to="/home" className="text-xl font-bold text-gray-900">
            Mapper
          </Link>

        
          <div className="flex items-center gap-3">
            <Link to="/home" className="text-sm text-gray-600 hover:text-gray-900">Home</Link>

           
            {isAdmin && (
              <Link to="/marketplace-upload" className="text-sm text-gray-600 hover:text-gray-900">
                Template
              </Link>
            )}

            
            {(isSeller || isAdmin) && (
              <Link to="/seller-upload" className="text-sm text-gray-600 hover:text-gray-900">
                Upload
              </Link>
            )}

           
            {(isSeller || isAdmin || isSuper) && (
              <Link to="/mapping" className="text-sm text-gray-600 hover:text-gray-900">
                Map
              </Link>
            )}

            <Link to="/mappings" className="text-sm text-gray-600 hover:text-gray-900">Mappings</Link>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
        
          {!token && !isLoginPage && (
            <Link to="/login" className="px-3 py-1 text-sm text-white bg-blue-600 rounded">
              Login
            </Link>
          )}

          {token && !isLoginPage && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen((s) => !s)}
                className="flex items-center gap-2 px-3 py-1 border rounded hover:shadow-sm"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                  {name ? name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="hidden sm:block text-sm text-gray-700">{name || "User"}</div>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow-lg z-50">
                  <div className="p-3 border-b">
                    <div className="text-sm font-medium">{name || "User"}</div>
                    <div className="text-xs text-gray-500">{role || "role"}</div>
                  </div>

                  <div className="p-2">
                    <Link
                      to="/profile"
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                      onClick={() => setOpen(false)}
                    >
                      Profile
                    </Link>

                  
                    {isAdmin && (
                      <Link
                        to="/marketplace-upload"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                        onClick={() => setOpen(false)}
                      >
                        Create Template
                      </Link>
                    )}

                    {(isSeller || isAdmin) && (
                      <Link
                        to="/seller-upload"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                        onClick={() => setOpen(false)}
                      >
                        Upload File
                      </Link>
                    )}
                  </div>

                  <div className="p-2 border-t">
                    <button
                      onClick={() => { setOpen(false); logout(); }}
                      className="w-full text-left px-3 py-2 bg-red-600 text-white rounded text-sm"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
