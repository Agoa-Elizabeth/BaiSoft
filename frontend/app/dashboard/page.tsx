'use client';

import { useEffect, useState } from 'react';
import {
  getProducts, createProduct, updateProduct, approveProduct, deleteProduct, logout,
  getUsers, createUser, updateUser, deleteUser,
  getBusinesses, createBusiness, updateBusiness, deleteBusiness
} from '@/lib/api';
import { useRouter } from 'next/navigation';

// Icon Components
const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const PackageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const BuildingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
    <path d="M9 22v-4h6v4"></path>
    <path d="M8 6h.01"></path>
    <path d="M16 6h.01"></path>
    <path d="M12 6h.01"></path>
    <path d="M12 10h.01"></path>
    <path d="M12 14h.01"></path>
    <path d="M16 10h.01"></path>
    <path d="M16 14h.01"></path>
    <path d="M8 10h.01"></path>
    <path d="M8 14h.01"></path>
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const BotIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    <circle cx="12" cy="16" r="1"></circle>
  </svg>
);

export default function Dashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('products');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingDescription, setViewingDescription] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
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

  // Filter and search logic
  const getFilteredData = () => {
    if (activeTab === 'products') {
      return products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'all' || product.status === filterStatus;
        return matchesSearch && matchesFilter;
      });
    } else if (activeTab === 'users') {
      return users.filter(userItem => {
        const matchesSearch = userItem.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          userItem.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          `${userItem.first_name} ${userItem.last_name}`.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterRole === 'all' || userItem.role === filterRole;
        return matchesSearch && matchesFilter;
      });
    } else if (activeTab === 'businesses') {
      return businesses.filter(business =>
        business.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return [];
  };

  const filteredData = getFilteredData();

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getFormFields = () => {
    if (activeTab === 'products') {
      const descriptionWordCount = getWordCount(formData.description || '');
      const isDescriptionTooLong = descriptionWordCount > 100;

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
              style={{
                borderColor: isDescriptionTooLong ? '#dc2626' : undefined
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '0.25rem',
              fontSize: '0.875rem'
            }}>
              <span style={{ color: isDescriptionTooLong ? '#dc2626' : '#6b7280' }}>
                {descriptionWordCount} / 100 words
              </span>
              {isDescriptionTooLong && (
                <span style={{ color: '#dc2626', fontWeight: '500' }}>
                  Description exceeds 100 words
                </span>
              )}
            </div>
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
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{
        width: '250px',
        backgroundColor: '#1f2937',
        color: 'white',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        position: 'fixed',
        height: '100vh',
        left: 0,
        top: 0
      }}>
        <div style={{ marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>Dashboard</h1>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <button
            onClick={() => setActiveTab('products')}
            style={{
              padding: '0.75rem 1rem',
              border: 'none',
              background: activeTab === 'products' ? '#2563eb' : 'transparent',
              color: 'white',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '1rem',
              transition: 'background 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'products') e.currentTarget.style.background = '#374151';
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'products') e.currentTarget.style.background = 'transparent';
            }}
          >
            <PackageIcon /> Products
          </button>
          {isAdmin && (
            <>
              <button
                onClick={() => setActiveTab('users')}
                style={{
                  padding: '0.75rem 1rem',
                  border: 'none',
                  background: activeTab === 'users' ? '#2563eb' : 'transparent',
                  color: 'white',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '1rem',
                  transition: 'background 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'users') e.currentTarget.style.background = '#374151';
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'users') e.currentTarget.style.background = 'transparent';
                }}
              >
                <UsersIcon /> Users
              </button>
              <button
                onClick={() => setActiveTab('businesses')}
                style={{
                  padding: '0.75rem 1rem',
                  border: 'none',
                  background: activeTab === 'businesses' ? '#2563eb' : 'transparent',
                  color: 'white',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '1rem',
                  transition: 'background 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'businesses') e.currentTarget.style.background = '#374151';
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'businesses') e.currentTarget.style.background = 'transparent';
                }}
              >
                <BuildingIcon /> Businesses
              </button>
            </>
          )}

          <a
            href="/products/chatbot"
            style={{
              padding: '0.75rem 1rem',
              border: 'none',
              background: 'transparent',
              color: 'white',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '1rem',
              transition: 'background 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#374151';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <BotIcon /> Zuri AI
          </a>
        </nav>

        {/* Profile Section */}
        <div style={{
          marginTop: 'auto',
          padding: '1rem',
          backgroundColor: '#374151',
          borderRadius: '0.5rem',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: 'bold'
            }}>
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'white',
                margin: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {user?.username}
              </p>
              <p style={{
                fontSize: '0.75rem',
                color: '#9ca3af',
                margin: 0,
                textTransform: 'capitalize'
              }}>
                {user?.role}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: '0.75rem 1rem',
            border: 'none',
            background: '#dc2626',
            color: 'white',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            justifyContent: 'center'
          }}
        >
          <LogoutIcon /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '250px', height: '100vh', overflow: 'hidden' }}>
        {/* Top Bar with Search and Filter */}
        <div style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem 2rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          flexShrink: 0
        }}>
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '0.5rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem'
            }}
          />

          {activeTab === 'products' && (
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                minWidth: '150px'
              }}
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending_approval">Pending</option>
              <option value="approved">Approved</option>
            </select>
          )}

          {activeTab === 'users' && (
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                minWidth: '150px'
              }}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="approver">Approver</option>
              <option value="viewer">Viewer</option>
            </select>
          )}
        </div>

        <div className="container" style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>

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
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={activeTab === 'products' && getWordCount(formData.description || '') > 100}
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </form>
            </div>
          )}

          {/* Content based on active tab */}
          {activeTab === 'products' && (
            <>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Created By</th>
                      <th>Business</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((product) => (
                      <tr key={product.id}>
                        <td style={{ fontWeight: '500' }}>{product.name}</td>
                        <td>
                          <div style={{ maxWidth: '300px' }}>
                            <p style={{
                              margin: 0,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              lineHeight: '1.5'
                            }}>
                              {product.description}
                            </p>
                            <button
                              onClick={() => setViewingDescription(product)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#2563eb',
                                cursor: 'pointer',
                                padding: '0.25rem 0',
                                fontSize: '0.875rem',
                                textDecoration: 'underline'
                              }}
                            >
                              Read more
                            </button>
                          </div>
                        </td>
                        <td style={{ fontWeight: '600', color: '#2563eb' }}>${product.price}</td>
                        <td>
                          <span className={`badge badge-${product.status === 'approved' ? 'approved' : product.status === 'pending_approval' ? 'pending' : 'draft'}`}>
                            {product.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.875rem' }}>{product.created_by_name}</td>
                        <td style={{ fontSize: '0.875rem' }}>{product.business_name}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {canCreate && (
                              <button onClick={() => handleEdit(product)} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <EditIcon /> Edit
                              </button>
                            )}
                            {canApprove && product.status !== 'approved' && (
                              <button onClick={() => handleApprove(product.id)} className="btn btn-success btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <CheckIcon /> Approve
                              </button>
                            )}
                            {canCreate && (
                              <button onClick={() => handleDelete(product.id)} className="btn btn-danger btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <DeleteIcon /> Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Description Modal */}
              {viewingDescription && (
                <div
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                  }}
                  onClick={() => setViewingDescription(null)}
                >
                  <div
                    style={{
                      backgroundColor: 'white',
                      padding: '2rem',
                      borderRadius: '0.5rem',
                      maxWidth: '600px',
                      width: '90%',
                      maxHeight: '80vh',
                      overflow: 'auto',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                      <h3 style={{ margin: 0 }}>{viewingDescription.name}</h3>
                      <button
                        onClick={() => setViewingDescription(null)}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '1.5rem',
                          cursor: 'pointer',
                          color: '#6b7280',
                          padding: '0',
                          lineHeight: 1
                        }}
                      >
                        ×
                      </button>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <span className={`badge badge-${viewingDescription.status === 'approved' ? 'approved' : viewingDescription.status === 'pending_approval' ? 'pending' : 'draft'}`}>
                        {viewingDescription.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Description:</h4>
                      <p style={{ lineHeight: '1.6', color: '#374151' }}>{viewingDescription.description}</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Price:</p>
                        <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2563eb', margin: 0 }}>${viewingDescription.price}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Created by:</p>
                        <p style={{ margin: 0 }}>{viewingDescription.created_by_name}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Business:</p>
                        <p style={{ margin: 0 }}>{viewingDescription.business_name}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Created:</p>
                        <p style={{ margin: 0 }}>{new Date(viewingDescription.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
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
                  {filteredData.map((userItem) => (
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
                          <button onClick={() => handleEdit(userItem)} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <EditIcon /> Edit
                          </button>
                          <button onClick={() => handleDelete(userItem.id)} className="btn btn-danger btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <DeleteIcon /> Delete
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
                  {filteredData.map((business) => (
                    <tr key={business.id}>
                      <td>{business.name}</td>
                      <td>{new Date(business.created_at).toLocaleDateString()}</td>
                      <td>{users.filter(u => u.business === business.id).length}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => handleEdit(business)} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <EditIcon /> Edit
                          </button>
                          <button onClick={() => handleDelete(business.id)} className="btn btn-danger btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <DeleteIcon /> Delete
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
    </div>
  );
}
