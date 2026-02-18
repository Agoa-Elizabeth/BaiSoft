'use client';

import { useEffect, useState } from 'react';
import {
  getProducts, createProduct, updateProduct, approveProduct, deleteProduct, logout,
  getUsers, createUser, updateUser, deleteUser,
  getBusinesses, createBusiness, updateBusiness, deleteBusiness
} from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('products');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    loadProducts();
    if (parsedUser.role === 'admin') {
      loadUsers();
      loadBusinesses();
    }
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadBusinesses = async () => {
    try {
      const data = await getBusinesses();
      setBusinesses(data);
    } catch (error) {
      console.error('Error loading businesses:', error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleCreateNew = () => {
    resetForm();
    if (activeTab === 'products') {
      setFormData({ name: '', description: '', price: '', status: 'draft' });
    } else if (activeTab === 'users') {
      setFormData({ username: '', email: '', first_name: '', last_name: '', role: 'viewer', business: '', password: '' });
    } else if (activeTab === 'businesses') {
      setFormData({ name: '' });
    }
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === 'products') {
        const productData = { ...formData, business: user.business };
        if (editingItem) {
          await updateProduct(editingItem.id, productData);
        } else {
          await createProduct(productData);
        }
        loadProducts();
      } else if (activeTab === 'users') {
        if (editingItem) {
          await updateUser(editingItem.id, formData);
        } else {
          await createUser(formData);
        }
        loadUsers();
      } else if (activeTab === 'businesses') {
        if (editingItem) {
          await updateBusiness(editingItem.id, formData);
        } else {
          await createBusiness(formData);
        }
        loadBusinesses();
      }
      resetForm();
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    if (activeTab === 'products') {
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price,
        status: item.status
      });
    } else if (activeTab === 'users') {
      setFormData({
        username: item.username,
        email: item.email,
        first_name: item.first_name,
        last_name: item.last_name,
        role: item.role,
        business: item.business
      });
    } else if (activeTab === 'businesses') {
      setFormData({
        name: item.name
      });
    }
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`)) {
      try {
        if (activeTab === 'products') {
          await deleteProduct(id);
          loadProducts();
        } else if (activeTab === 'users') {
          await deleteUser(id);
          loadUsers();
        } else if (activeTab === 'businesses') {
          await deleteBusiness(id);
          loadBusinesses();
        }
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await approveProduct(id);
      loadProducts();
    } catch (error) {
      console.error('Error approving product:', error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const canCreate = user?.role === 'admin' || user?.role === 'editor' || user?.role === 'approver';
  const canApprove = user?.role === 'admin' || user?.role === 'approver';
  const isAdmin = user?.role === 'admin';

  const getFormFields = () => {
    if (activeTab === 'products') {
      return (
        <>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              step="0.01"
              value={formData.price || ''}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.status || 'draft'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="draft">Draft</option>
              <option value="pending_approval">Pending Approval</option>
            </select>
          </div>
        </>
      );
    } else if (activeTab === 'users') {
      return (
        <>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={formData.username || ''}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              value={formData.first_name || ''}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={formData.last_name || ''}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            />
          </div>
          {!editingItem && (
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={formData.password || ''}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          )}
          <div className="form-group">
            <label>Role</label>
            <select
              value={formData.role || 'viewer'}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="approver">Approver</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div className="form-group">
            <label>Business</label>
            <select
              value={formData.business || ''}
              onChange={(e) => setFormData({ ...formData, business: e.target.value })}
              required
            >
              <option value="">Select Business</option>
              {businesses.map((business) => (
                <option key={business.id} value={business.id}>
                  {business.name}
                </option>
              ))}
            </select>
          </div>
        </>
      );
    } else if (activeTab === 'businesses') {
      return (
        <div className="form-group">
          <label>Business Name</label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
      );
    }
  };

  return (
    <div>
      <nav className="nav">
        <h1>Dashboard</h1>
        <div className="nav-links">
          <span>Welcome, {user?.username} ({user?.role})</span>
          <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
        </div>
      </nav>

      <div className="container">
        {/* Tab Navigation */}
        <div style={{ marginBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setActiveTab('products')}
              className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
              style={{
                padding: '0.75rem 1rem',
                border: 'none',
                background: activeTab === 'products' ? '#2563eb' : 'transparent',
                color: activeTab === 'products' ? 'white' : '#6b7280',
                borderRadius: '0.375rem 0.375rem 0 0',
                cursor: 'pointer'
              }}
            >
              Products
            </button>
            {isAdmin && (
              <>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
                  style={{
                    padding: '0.75rem 1rem',
                    border: 'none',
                    background: activeTab === 'users' ? '#2563eb' : 'transparent',
                    color: activeTab === 'users' ? 'white' : '#6b7280',
                    borderRadius: '0.375rem 0.375rem 0 0',
                    cursor: 'pointer'
                  }}
                >
                  Users
                </button>
                <button
                  onClick={() => setActiveTab('businesses')}
                  className={`tab-button ${activeTab === 'businesses' ? 'active' : ''}`}
                  style={{
                    padding: '0.75rem 1rem',
                    border: 'none',
                    background: activeTab === 'businesses' ? '#2563eb' : 'transparent',
                    color: activeTab === 'businesses' ? 'white' : '#6b7280',
                    borderRadius: '0.375rem 0.375rem 0 0',
                    cursor: 'pointer'
                  }}
                >
                  Businesses
                </button>
              </>
            )}
          </div>
        </div>

        {/* Header with Create Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {activeTab === 'products' && (
              <button onClick={loadProducts} className="btn btn-secondary">
                Refresh
              </button>
            )}
            {((activeTab === 'products' && canCreate) || (activeTab === 'users' && isAdmin) || (activeTab === 'businesses' && isAdmin)) && (
              <button onClick={() => showForm ? resetForm() : handleCreateNew()} className="btn btn-primary">
                {showForm ? 'Cancel' : `Add ${activeTab.slice(0, -1)}`}
              </button>
            )}
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="card">
            <h3>{editingItem ? `Edit ${activeTab.slice(0, -1)}` : `Create ${activeTab.slice(0, -1)}`}</h3>
            <form onSubmit={handleSubmit}>
              {getFormFields()}
              <button type="submit" className="btn btn-primary">
                {editingItem ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        )}

        {/* Content based on active tab */}
        {activeTab === 'products' && (
          <div className="grid">
            {products.map((product) => (
              <div key={product.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <h3>{product.name}</h3>
                  <span className={`badge badge-${product.status === 'approved' ? 'approved' : product.status === 'pending_approval' ? 'pending' : 'draft'}`}>
                    {product.status.replace('_', ' ')}
                  </span>
                </div>
                <p style={{ margin: '0.5rem 0', color: '#6b7280' }}>{product.description}</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>
                  ${product.price}
                </p>
                <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                  Created by: {product.created_by_name}
                </p>
                <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                  Business: {product.business_name}
                </p>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {canCreate && (
                    <button onClick={() => handleEdit(product)} className="btn btn-secondary">
                      Edit
                    </button>
                  )}
                  {canApprove && product.status !== 'approved' && (
                    <button onClick={() => handleApprove(product.id)} className="btn btn-success">
                      Approve
                    </button>
                  )}
                  {canCreate && (
                    <button onClick={() => handleDelete(product.id)} className="btn btn-danger">
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'users' && isAdmin && (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Business</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userItem) => (
                  <tr key={userItem.id}>
                    <td>{userItem.username}</td>
                    <td>{userItem.first_name} {userItem.last_name}</td>
                    <td>{userItem.email}</td>
                    <td>
                      <span className={`badge badge-${userItem.role}`}>
                        {userItem.role}
                      </span>
                    </td>
                    <td>{businesses.find(b => b.id === userItem.business)?.name || 'N/A'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleEdit(userItem)} className="btn btn-secondary btn-sm">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(userItem.id)} className="btn btn-danger btn-sm">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'businesses' && isAdmin && (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Business Name</th>
                  <th>Created Date</th>
                  <th>Users Count</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {businesses.map((business) => (
                  <tr key={business.id}>
                    <td>{business.name}</td>
                    <td>{new Date(business.created_at).toLocaleDateString()}</td>
                    <td>{users.filter(u => u.business === business.id).length}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleEdit(business)} className="btn btn-secondary btn-sm">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(business.id)} className="btn btn-danger btn-sm">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
