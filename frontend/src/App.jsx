import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductForm from './pages/ProductForm';

const App = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="loading-screen">Loading application...</div>;
  }

  return (
    <div className="app">
      <header className="navbar">
        <div className="nav-container">
          <Link to="/" className="brand">
            ShopCRUD
          </Link>
          <nav className="nav-links">
            <Link to="/" className="nav-link">
              Products
            </Link>
            {user ? (
              <>
                <Link to="/products/new" className="nav-link">
                  Add Product
                </Link>
                <span className="user-greeting">Hello, {user.name}</span>
                <button onClick={handleLogout} className="btn btn-outline btn-small">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-small">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products/new" element={<ProductForm />} />
          <Route path="/products/edit/:id" element={<ProductForm />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
