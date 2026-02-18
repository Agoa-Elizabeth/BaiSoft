'use client';

import { useEffect, useState } from 'react';
import { getPublicProducts } from '@/lib/api';
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
                      <p className="product-description">{product.description}</p>
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
            <p>&copy; 2024 Product Marketplace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
