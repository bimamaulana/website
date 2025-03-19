import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";
import Login from "./login";
import Signup from "./signup";
import Dashboard from "./dashboard";
import Admin from "./admin";

const App = () => {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <nav className="mb-4 text-center">
          <Link to="/" className="mr-4 text-blue-500">
            | Home |
          </Link>
          <Link to="/admin" className="mr-4 text-blue-500">
            | Admin |
          </Link>
          <Link to="/login" className="mr-4 text-blue-500">
            | Login |
          </Link>
          <Link to="/signup" className="text-blue-500">
            | Sign Up |
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminAccess />} />
          <Route
            path="/dashboard-admin"
            element={
              <ProtectedAdminRoute>
                <Admin />
              </ProtectedAdminRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedUserRoute>
                <Dashboard />
              </ProtectedUserRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

// Middleware untuk proteksi halaman Dashboard User
const ProtectedUserRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("user");
  return isAuthenticated ? children : <Navigate to="/" />;
};

// Middleware untuk proteksi halaman Admin
const ProtectedAdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("aksesAdmin") === "true";
  return isAdmin ? children : <Navigate to="/admin" />;
};

// Halaman Home
const Home = () => (
  <div className="text-center">
    <h1 className="text-2xl font-bold">Selamat Datang</h1>
    <p>Laboratory Management System</p>
  </div>
);

// Halaman Admin Access untuk verifikasi kode
const AdminAccess = () => {
  const [kode, setKode] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const kodeBenar = "12345"; // Kode akses admin

  const handleSubmit = (e) => {
    e.preventDefault();

    if (kode === kodeBenar) {
      localStorage.setItem("aksesAdmin", "true");
      navigate("/dashboard-admin");
    } else {
      setError(true);
    }
  };

  // Jika sudah login sebagai admin, langsung ke dashboard admin
  if (localStorage.getItem("aksesAdmin") === "true") {
    return <Navigate to="/dashboard-admin" />;
  }

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold">Masukkan Kode Akses</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="password"
          value={kode}
          onChange={(e) => setKode(e.target.value)}
          className="border p-2 mr-2"
          placeholder="Masukkan Kode"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Masuk
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">Kode salah, coba lagi!</p>}
    </div>
  );
};

export default App;
