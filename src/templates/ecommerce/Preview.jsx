import { useEffect, useRef } from 'react'
import './preview.css'

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Garden']
const RATINGS = [5, 4, 3, 2]

const PRODUCTS = [
  { id: 1, name: 'Wireless Headphones', price: 89, sale: false },
  { id: 2, name: 'Canvas Sneakers', price: 54, sale: true, salePrice: 39 },
  { id: 3, name: 'Ceramic Mug Set', price: 29, sale: false },
  { id: 4, name: 'Leather Notebook', price: 24, sale: false },
  { id: 5, name: 'Desk Lamp Pro', price: 67, sale: false },
  { id: 6, name: 'Bamboo Watch', price: 49, sale: false },
]

export default function EcommercePreview({ activeTab }) {
  const shopRef = useRef(null)
  const rootRef = useRef(null)

  useEffect(() => {
    if (activeTab === 'shop') {
      shopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      rootRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [activeTab])

  return (
    <div className="ec-root" ref={rootRef}>
      <nav className="ec-nav">
        <div className="ec-nav-inner">
          <span className="ec-logo cf-logo-text">Cova</span>
          <div className="ec-search">
            <input className="ec-search-input" type="text" placeholder="Search products…" readOnly />
          </div>
          <div className="ec-nav-actions">
            <button className="ec-icon-btn">♡</button>
            <button className="ec-icon-btn ec-cart-btn">
              <span>🛒</span>
              <span className="ec-cart-badge">3</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="ec-category-bar">
        <div className="ec-category-inner">
          {CATEGORIES.map((c, i) => (
            <button key={c} className={`ec-cat-btn${i === 0 ? ' ec-cat-btn--active' : ''}`}>{c}</button>
          ))}
        </div>
      </div>

      <div className="ec-body" ref={shopRef}>
        <aside className="ec-filters">
          <h3 className="ec-filter-title">Filters</h3>

          <div className="ec-filter-section">
            <h4 className="ec-filter-label">Price Range</h4>
            <input type="range" className="ec-range" min="0" max="200" defaultValue="100" />
            <div className="ec-range-labels"><span>$0</span><span>$200</span></div>
          </div>

          <div className="ec-filter-section">
            <h4 className="ec-filter-label">Category</h4>
            {['Electronics', 'Clothing', 'Books', 'Home'].map(c => (
              <label key={c} className="ec-check-row">
                <input type="checkbox" className="ec-check" />
                <span>{c}</span>
              </label>
            ))}
          </div>

          <div className="ec-filter-section">
            <h4 className="ec-filter-label">Rating</h4>
            {RATINGS.map(r => (
              <label key={r} className="ec-check-row">
                <input type="checkbox" className="ec-check" defaultChecked={r === 4} />
                <span className="ec-stars">{'★'.repeat(r)}{'☆'.repeat(5 - r)}</span>
                <span>& up</span>
              </label>
            ))}
          </div>

          <button className="ec-filter-apply">Apply Filters</button>
        </aside>

        <main className="ec-products">
          <div className="ec-products-header">
            <p className="ec-result-count">Showing <strong>6</strong> of 24 products</p>
            <select className="ec-sort">
              <option>Sort: Featured</option>
              <option>Price: Low → High</option>
              <option>Price: High → Low</option>
            </select>
          </div>

          <div className="ec-product-grid">
            {PRODUCTS.map(product => (
              <div className="ec-product-card cf-card" key={product.id}>
                <div className="ec-product-img">
                  {product.sale && <span className="ec-sale-badge">Sale</span>}
                </div>
                <div className="ec-product-body">
                  <h4 className="ec-product-name">{product.name}</h4>
                  <div className="ec-product-meta">
                    <span className="ec-stars-sm">★★★★☆</span>
                    <span className="ec-review-count">(24)</span>
                  </div>
                  <div className="ec-product-price-row">
                    {product.sale ? (
                      <>
                        <span className="ec-sale-price">${product.salePrice}</span>
                        <span className="ec-original-price">${product.price}</span>
                      </>
                    ) : (
                      <span className="ec-price">${product.price}</span>
                    )}
                  </div>
                  <button className="ec-add-btn cf-btn-primary">Add to Cart</button>
                </div>
              </div>
            ))}
          </div>

          <div className="ec-pagination">
            <button className="ec-page-btn ec-page-btn--active">1</button>
            <button className="ec-page-btn">2</button>
            <button className="ec-page-btn">3</button>
            <span>…</span>
            <button className="ec-page-btn">8</button>
          </div>
        </main>
      </div>

      <footer className="ec-footer">
        <div className="ec-footer-inner">
          <span className="ec-logo cf-logo-text">Cova</span>
          <div className="ec-footer-cols">
            <div>
              <strong>Shop</strong>
              <a href="#">New Arrivals</a>
              <a href="#">Best Sellers</a>
              <a href="#">Sale</a>
            </div>
            <div>
              <strong>Support</strong>
              <a href="#">Help Center</a>
              <a href="#">Returns</a>
              <a href="#">Contact</a>
            </div>
            <div>
              <strong>Company</strong>
              <a href="#">About</a>
              <a href="#">Careers</a>
              <a href="#">Press</a>
            </div>
          </div>
          <p className="ec-footer-copy">© 2024 Cova. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
