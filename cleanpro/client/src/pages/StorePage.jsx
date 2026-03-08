import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bg from "../../assests/bg.jpeg";
import { FaThLarge, FaHandSparkles, FaCar, FaIndustry } from "react-icons/fa";
import { GiKitchenKnives } from "react-icons/gi";
import { MdBathroom, MdSolarPower } from "react-icons/md";
import { BiFoodMenu } from "react-icons/bi";
import { BsBeaker } from "react-icons/bs";
import img from "../../assests/img.jpeg"
const categories = ["All Products", "Kitchen", "Bathroom", "Hand Care", "Automotive", "Industrial", "Solar", "Food Grade"];

const sidebarLinks = [
  { icon: FaThLarge, label: "All Products", active: true },
  { icon: GiKitchenKnives, label: "Kitchen Cleaning" },
  { icon: FaHandSparkles, label: "Hand Washing" },
  { icon: MdBathroom, label: "Bathroom Cleaning" },
  { icon: FaCar, label: "Car Cleaning" },
  { icon: MdSolarPower, label: "Solar Panel Cleaner" },
  { icon: FaIndustry, label: "Industrial Floor" },
  { icon: BiFoodMenu, label: "Food Grade Care" },
  { icon: BsBeaker, label: "Industrial Chemicals" },
];

// Map sidebar labels to API category values
const sidebarCategoryMap = {
  "All Products": "All Products",
  "Kitchen Cleaning": "Kitchen",
  "Hand Washing": "Hand Care",
  "Bathroom Cleaning": "Bathroom",
  "Car Cleaning": "Automotive",
  "Solar Panel Cleaner": "Solar",
  "Industrial Floor": "Industrial",
  "Food Grade Care": "Food Grade",
  "Industrial Chemicals": "Industrial",
};

export default function StorePage() {
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [activeSidebar, setActiveSidebar] = useState("All Products");
  const [email, setEmail] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // --- NEW: API state ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const navigate = useNavigate();

  // Fetch products whenever category or search changes
  useEffect(() => {
    fetchProducts();
    setCurrentPage(1);
  }, [activeCategory, search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { status: "active" };
      if (activeCategory !== "All Products") params.category = activeCategory;
      if (search) params.search = search;
      const res = await axios.get("/api/products", { params });
      setProducts(res.data);
      setTotalPages(Math.max(1, Math.ceil(res.data.length / ITEMS_PER_PAGE)));
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Paginate client-side from fetched results
  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle search on Enter key or debounce
  const handleSearchKey = (e) => {
    if (e.key === "Enter") setSearch(searchInput);
  };

  // Handle sidebar click → update pill bar category too
  const handleSidebarClick = (label) => {
    setActiveSidebar(label);
    const mapped = sidebarCategoryMap[label] || "All Products";
    setActiveCategory(mapped);
  };

  const imgSrc = (img) =>
    img ? `/uploads/${img}` : "https://via.placeholder.com/400x400?text=No+Image";

  // Skeleton card for loading state
  const SkeletonCard = () => (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden animate-pulse">
      <div className="aspect-square bg-slate-100" />
      <div className="p-5 space-y-2">
        <div className="h-2.5 bg-slate-100 rounded w-1/4" />
        <div className="h-4 bg-slate-100 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-2/3" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Bebas+Neue&display=swap');
        .product-card:hover .product-img { transform: scale(1.08); }
        .product-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .product-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -8px rgba(19,127,236,0.15); }
        .hero-title { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.02em; }
        .product-img { transition: transform 0.4s ease; }
        .cat-pill { transition: all 0.15s ease; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-3">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-black">C</div>
              <span className="text-lg font-black text-slate-900 tracking-tight">Extra power</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              {["Products", "Solutions", "Safety Data"].map((item) => (
                <a key={item} className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors" href="#">{item}</a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
              <input
                className="rounded-xl border border-slate-200 bg-slate-100 py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                placeholder="Search products..."
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKey}
              />
            </div>
            <a
              className="text-sm font-bold text-blue-600 hover:underline cursor-pointer"
              onClick={() => navigate("/admin/login")}
            >Admin Login</a>
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"> <img src={img} alt="profile" className="w-full h-full object-cover rounded-full " /></div>
          </div>
        </div>
      </header>

      {/* Category pill bar */}
      <div className="bg-white border-b border-slate-200 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 py-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`cat-pill whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${
                activeCategory === cat
                  ? "bg-blue-600 text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <section className="relative mb-12 rounded-2xl overflow-hidden h-[420px] bg-slate-900">
          <img
            src={bg}
            alt="Hero"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/50 to-transparent" />
          <div className="relative h-full flex flex-col justify-center px-10 md:w-3/5">
            <span className="mb-4 inline-block rounded-full bg-blue-500/20 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-blue-400 ring-1 ring-blue-500/40">
              ☀️ Summer Sale
            </span>
            <h1 className="hero-title text-6xl sm:text-7xl text-white leading-none mb-4">
              PROFESSIONAL<br /><span className="text-blue-400">CLEANING</span><br />SOLUTIONS
            </h1>
            <p className="mb-8 text-base text-slate-300 max-w-md">
              High-performance chemical concentrates engineered for industrial, commercial, and residential excellence.
            </p>
            <div className="flex gap-3">
              <button className="rounded-xl bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-colors">
                Shop Best Sellers
              </button>
              <button className="rounded-xl bg-white/10 px-7 py-3 text-sm font-bold text-white backdrop-blur hover:bg-white/20 transition-colors">
                View Catalog
              </button>
            </div>
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-60 flex-shrink-0">
            <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Categories</p>
              <ul className="space-y-1">
                {sidebarLinks.map(({ icon, label }) => (
                  <li key={label}>
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); handleSidebarClick(label); }}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                        activeSidebar === label
                          ? "text-blue-600 bg-blue-50"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-base">{icon}</span>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-xl bg-blue-50 border border-blue-100 p-4">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-wider mb-1">Bulk Orders</p>
                <p className="text-xs text-slate-500 mb-2">Save up to 25% on wholesale chemical orders.</p>
                <a className="text-xs font-bold text-blue-600 hover:underline" href="#">Contact Sales →</a>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-black">
                Featured Products{" "}
                <span className="text-sm font-normal text-slate-400">({products.length} items)</span>
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-slate-400">Sort:</span>
                <select className="rounded-lg border border-slate-200 bg-white py-1.5 px-2 text-sm focus:ring-2 focus:ring-blue-500/40 focus:outline-none">
                  <option>Most Popular</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {loading ? (
                [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
              ) : paginatedProducts.length === 0 ? (
                <div className="col-span-3 text-center py-24">
                  <p className="text-4xl mb-4">🧹</p>
                  <p className="text-slate-500 font-semibold">No products found</p>
                  <p className="text-slate-400 text-sm mt-1">Try a different category or search term</p>
                </div>
              ) : (
                paginatedProducts.map((p) => (
                  <div key={p._id} className="product-card group flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden">
                    <div className="relative aspect-square overflow-hidden bg-slate-100">
                      <img
                        src={imgSrc(p.image)}
                        alt={p.name}
                        className="product-img h-full w-full object-cover"
                      />
                      {p.badge && (
                        <span className={`absolute left-3 top-3 rounded-lg px-2.5 py-1 text-[10px] font-black text-white uppercase tracking-wide ${
                          p.badge === "Best Seller" ? "bg-blue-500" :
                          p.badge === "Eco-Friendly" ? "bg-emerald-500" : "bg-slate-700"
                        }`}>
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{p.category}</p>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1 leading-snug">{p.name}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-4">{p.description}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-xl font-black text-slate-900">${Number(p.price).toFixed(2)}</span>
                        <button className="rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-xl border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-sm transition-colors disabled:opacity-40"
              >‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((n) => n === 1 || n === totalPages || Math.abs(n - currentPage) <= 1)
                .reduce((acc, n, i, arr) => {
                  if (i > 0 && n - arr[i - 1] > 1) acc.push("...");
                  acc.push(n);
                  return acc;
                }, [])
                .map((n, i) =>
                  n === "..." ? (
                    <span key={`ellipsis-${i}`} className="text-slate-400 px-1">…</span>
                  ) : (
                    <button
                      key={n}
                      onClick={() => setCurrentPage(n)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-colors ${
                        currentPage === n ? "bg-blue-600 text-white" : "hover:bg-slate-100 text-slate-600"
                      }`}
                    >{n}</button>
                  )
                )}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-xl border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-sm transition-colors disabled:opacity-40"
              >›</button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-black">C</div>
                <span className="text-base font-black text-slate-900">CleanPro</span>
              </div>
              <p className="text-sm text-slate-500">Leading the industry in professional chemical solutions since 1994. Sustainability and power in every drop.</p>
            </div>
            <div>
              <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Products</p>
              <ul className="space-y-2 text-sm text-slate-500">
                {["Industrial Line", "Eco-Series", "Bulk Supplies", "Safety Equipment"].map((l) => (
                  <li key={l}><a className="hover:text-blue-600 transition-colors" href="#">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Company</p>
              <ul className="space-y-2 text-sm text-slate-500">
                {["About Us", "Compliance", "Contact", "Careers"].map((l) => (
                  <li key={l}><a className="hover:text-blue-600 transition-colors" href="#">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Stay Updated</p>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors">Join</button>
              </div>
            </div>
          </div>
          <div className="mt-10 border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-400">© 2024 CleanPro Chemical Solutions. All rights reserved.</p>
            <div className="flex gap-6 text-xs text-slate-400">
              {["Privacy Policy", "Terms of Service", "SDS Database"].map((l) => (
                <a key={l} className="hover:text-blue-600 transition-colors" href="#">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}