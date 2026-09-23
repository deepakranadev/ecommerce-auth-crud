import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { apiRequest } from '../api';
import { useAuth } from '../context/AuthContext';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (isEditing) {
      const fetchProduct = async () => {
        try {
          const res = await apiRequest(`/products/${id}`);
          if (res.ok) {
            const data = await res.json();
            setFormData({
              name: data.name || '',
              description: data.description || '',
              price: data.price !== undefined ? String(data.price) : '',
              stock: data.stock !== undefined ? String(data.stock) : ''
            });
          } else {
            setGeneralError('Failed to load product details');
          }
        } catch {
          setGeneralError('An error occurred while fetching product');
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id, isEditing, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');

    const payload = {
      name: formData.name,
      description: formData.description,
      price: formData.price === '' ? '' : Number(formData.price),
      stock: formData.stock === '' ? '' : Number(formData.stock)
    };

    const endpoint = isEditing ? `/products/${id}` : '/products';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await apiRequest(endpoint, {
        method,
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok) {
        navigate('/');
      } else {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setGeneralError(data.message || 'Operation failed');
        }
      }
    } catch {
      setGeneralError('An error occurred while saving product');
    }
  };

  if (loading) {
    return <div className="container"><p>Loading...</p></div>;
  }

  return (
    <div className="container form-page">
      <div className="card form-card">
        <div className="form-header">
          <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
          <Link to="/" className="btn btn-secondary">Back to Products</Link>
        </div>

        {generalError && <div className="alert alert-error">{generalError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && (
              <span className="field-error">{errors.description}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="price">Price ($)</label>
              <input
                id="price"
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
              {errors.price && <span className="field-error">{errors.price}</span>}
            </div>

            <div className="form-group half-width">
              <label htmlFor="stock">Stock</label>
              <input
                id="stock"
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
              />
              {errors.stock && <span className="field-error">{errors.stock}</span>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Update Product' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
