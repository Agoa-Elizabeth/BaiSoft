'use client';

import { useEffect, useState } from 'react';
import { getPublicProducts } from '@/lib/api';
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingProduct, setViewingProduct] = useState<any>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getPublicProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <nav className="hero-nav">
        <div className="hero-nav-content">
          <h1 className="hero-logo">🛍️ Product Marketplace</h1>
          <div className="nav-links">
            <Link href="/products/chatbot">
              <button className="btn btn-outline">🤖 Zuri AI</button>
            </Link>
            <Link href="/login">
              <button className="btn btn-primary">Login</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Discover Amazing Products</h1>
          <p className="hero-subtitle">
            Explore our curated marketplace featuring the best products from trusted businesses
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <div className="container">
          <div className="products-header">
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Handpicked products from our marketplace</p>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading amazing products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No Products Yet</h3>
              <p>Be the first to discover products when they become available!</p>
              <Link href="/login">
                <button className="btn btn-primary">Get Started</button>
              </Link>
            </div>
          ) : (
            <div className="products-showcase">
              <div className="products-grid">
                {products.map((product) => (
                  <div key={product.id} className="product-card">
                    <div className="product-image">
                      <div className="product-placeholder">
                        <span className="product-icon">🏷️</span>
                      </div>
                    </div>
                    <div className="product-content">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-description" style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {product.description}
                      </p>
                      <button
                        onClick={() => setViewingProduct(product)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#2563eb',
                          cursor: 'pointer',
                          padding: '0.25rem 0',
                          fontSize: '0.875rem',
                          textDecoration: 'underline',
                          marginTop: '0.5rem'
                        }}
                      >
                        Read more
                      </button>
                      <div className="product-footer">
                        <div className="product-price">
                          <span className="price-currency">$</span>
                          <span className="price-amount">{product.price}</span>
                        </div>
                        <div className="product-business">
                          <span className="business-label">by</span>
                          <span className="business-name">{product.business_name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Product Detail Modal */}
      {viewingProduct && (
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
            zIndex: 1000,
            padding: '1rem'
          }}
          onClick={() => setViewingProduct(null)}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '0.75rem',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '85vh',
              overflow: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>
                  {viewingProduct.name}
                </h2>
                <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
                  by <span style={{ fontWeight: '500', color: '#374151' }}>{viewingProduct.business_name}</span>
                </p>
              </div>
              <button
                onClick={() => setViewingProduct(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '2rem',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '0',
                  lineHeight: 1,
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '0.375rem',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              >
                ×
              </button>
            </div>

            <div style={{
              marginBottom: '1.5rem',
              padding: '1.5rem',
              backgroundColor: '#f9fafb',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#6b7280',
                marginBottom: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Description
              </h3>
              <p style={{
                lineHeight: '1.75',
                color: '#374151',
                margin: 0,
                fontSize: '1rem',
                whiteSpace: 'pre-wrap'
              }}>
                {viewingProduct.description}
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.5rem',
              backgroundColor: '#eff6ff',
              borderRadius: '0.5rem',
              border: '1px solid #bfdbfe'
            }}>
              <div>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#1e40af',
                  margin: '0 0 0.25rem 0',
                  fontWeight: '500'
                }}>
                  Price
                </p>
                <p style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#2563eb',
                  margin: 0,
                  lineHeight: 1
                }}>
                  ${viewingProduct.price}
                </p>
              </div>
              <button
                onClick={() => setViewingProduct(null)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Start Selling?</h2>
            <p className="cta-subtitle">Join our marketplace and reach thousands of customers</p>
            <div className="cta-buttons">
              <Link href="/login">
                <button className="btn btn-primary btn-large">Get Started</button>
              </Link>
              <Link href="/products/chatbot">
                <button className="btn btn-outline btn-large">Chat with Zuri AI</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>🛍️ Product Marketplace</h3>
              <p>Your trusted platform for discovering and selling amazing products.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link href="/login">Login</Link></li>
                <li><Link href="/products/chatbot">AI Assistant</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Product Marketplace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
