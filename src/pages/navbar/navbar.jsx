import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove JWT
    navigate("/", { replace: true }); // go to login/home
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-xl font-bold tracking-wide cursor-pointer" onClick={() => navigate("/")}>
          Todo App
        </h1>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-gray-300 transition">Home</Link>
          <Link to="/tasks" className="hover:text-gray-300 transition">Tasks</Link>
          <Link to="/profile" className="hover:text-gray-300 transition">Profile</Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-800 px-6 pt-4 pb-6 flex flex-col gap-3">
          <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-gray-300 transition">Home</Link>
          <Link to="/tasks" onClick={() => setMenuOpen(false)} className="hover:text-gray-300 transition">Tasks</Link>
          <Link to="/profile" onClick={() => setMenuOpen(false)} className="hover:text-gray-300 transition">Profile</Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
