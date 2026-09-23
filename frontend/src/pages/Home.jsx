import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const fetchProducts = async () => {
    try {
      const res = await apiRequest('/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        setError('Failed to fetch products');
      }
    } catch {
      setError('An error occurred while fetching products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const res = await apiRequest(`/products/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setProducts(products.filter((p) => p._id !== id));
      } else {
        alert('Failed to delete product');
      }
    } catch {
      alert('An error occurred while deleting product');
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h2>Product Catalog</h2>
          <p className="subtitle">Explore available products in the store</p>
        </div>
        {user && (
          <Link to="/products/new" className="btn btn-primary">
            + Add Product
          </Link>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <p>No products available yet.</p>
          {user && (
            <Link to="/products/new" className="btn btn-secondary">
              Create the first product
            </Link>
          )}
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product._id} className="card product-card">
              <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <p className="product-desc">{product.description || 'No description provided.'}</p>
                <div className="product-meta">
                  <span className="product-price">${Number(product.price).toFixed(2)}</span>
                  <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
              </div>

              {user && (
                <div className="product-actions">
                  <Link to={`/products/edit/${product._id}`} className="btn btn-small btn-secondary">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="btn btn-small btn-danger"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
