import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = ["Kitchen", "Bathroom", "Hand Care", "Automotive", "Industrial", "Solar", "Food Grade", "Cleaning", "Personal Care", "Sanitary", "Hand Washing"];
const NAV = [
  { icon: "🗂", label: "Dashboard" },
  { icon: "📦", label: "Products", active: true },
  { icon: "🛒", label: "Orders" },
  { icon: "⚙️", label: "Settings" },
];

const EMPTY_FORM = { name: "", price: "", category: "", description: "", badge: "", stock: "", status: "active" };

export default function AdminPage() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [activeNav, setActiveNav] = useState("Products");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fileRef = useRef();

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/products");
      setProducts(res.data);
    } catch (err) {
      showToast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleImageChange = (file) => {
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category) {
      showToast("Name, price and category are required", "error");
      return;
    }
    setSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (imageFile) data.append("image", imageFile);

      if (editingId) {
        await api.put(`/api/products/${editingId}`, data);
        showToast("Product updated!");
      } else {
        await api.post("/api/products", data);
        showToast("Product published!");
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      // Provide more specific error messages
      const errorMsg = err.response?.data?.error || err.message;
      let userMsg = "Failed to save product";
      
      if (errorMsg.includes("Invalid file type")) {
        userMsg = "Invalid file type. Only JPG, JPEG, PNG, and WEBP are allowed.";
      } else if (errorMsg.includes("File too large")) {
        userMsg = "File is too large. Maximum size is 10MB.";
      } else if (errorMsg.includes("Cloudinary")) {
        userMsg = "Image upload failed. Please check your internet connection and try again.";
      } else {
        userMsg = errorMsg;
      }
      
      showToast(userMsg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle both Cloudinary URLs and local file paths
  const getImageUrl = (img) => {
    if (!img) return null;
    // If it's already a full URL (Cloudinary or other), use it directly
    if (img.startsWith("http://") || img.startsWith("https://")) {
      return img;
    }
    // Otherwise, it's a local file - prepend /uploads/
    return `/uploads/${img}`;
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setForm({ name: p.name, price: p.price, category: p.category, description: p.description || "", badge: p.badge || "", stock: p.stock || "", status: p.status });
    setImagePreview(getImageUrl(p.image));
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/products/${id}`);
      showToast("Product deleted");
      setDeleteConfirm(null);
      fetchProducts();
    } catch (err) {
      showToast("Failed to delete", "error");
    }
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
  };

  const handleLogout = () => { logout(); navigate("/admin/login"); };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = products.reduce((s, p) => s + Number(p.price) * (Number(p.stock) || 0), 0);
  const activeCount = products.filter((p) => p.status === "active").length;
  const lowStock = products.filter((p) => Number(p.stock) > 0 && Number(p.stock) < 20);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-bold transition-all ${
          toast.type === "error" ? "bg-red-600 text-white" : "bg-emerald-600 text-white"
        }`}>
          {toast.type === "error" ? "❌ " : "✅ "}{toast.msg}
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="font-black text-lg mb-1">Delete Product?</h3>
            <p className="text-slate-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 rounded-xl border border-slate-200 text-sm font-bold hover:bg-slate-50">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        </div>
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:relative z-50 lg:z-auto w-60 h-full flex-shrink-0 border-r border-slate-200 bg-white flex flex-col transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div className="p-5">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-black">A</div>
            <div>
              <h1 className="text-slate-900 text-sm font-black leading-none">Admin Panel</h1>
              <p className="text-slate-400 text-xs mt-0.5">Manage your store</p>
            </div>
          </div>
          <nav className="space-y-0.5">
            {NAV.map(({ icon, label }) => (
              <button key={label} onClick={() => setActiveNav(label)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
                  activeNav === label ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}>
                <span>{icon}</span>
                <span className={`text-sm ${activeNav === label ? "font-bold" : "font-medium"}`}>{label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-5 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-sm">
              {admin?.name?.[0] || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{admin?.name || "Admin"}</p>
              <p className="text-xs text-slate-400 truncate">{admin?.email}</p>
            </div>
            <button onClick={handleLogout} title="Logout" className="text-slate-400 hover:text-red-500 transition-colors text-sm">↩</button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-6 lg:space-y-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-900">Products</h2>
                <p className="text-slate-400 text-sm mt-0.5">Upload and manage your store inventory</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/" className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold bg-white hover:bg-slate-50 text-slate-600 transition-colors">
                👁 Preview Store
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload / Edit Form */}
            <section className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-base font-black">{editingId ? "✏️ Edit Product" : "➕ Upload New Product"}</h3>
                {editingId && <button onClick={resetForm} className="text-xs font-bold text-slate-400 hover:text-slate-600">✕ Cancel edit</button>}
              </div>
              <div className="p-4 lg:p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Product Name *</label>
                    <input className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                      placeholder="e.g. Eco-Friendly Soap" value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Price ($) *</label>
                    <input className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                      placeholder="0.00" type="number" step="0.01" value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Category *</label>
                    <select className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                      <option value="">Select...</option>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Badge</label>
                    <select className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })}>
                      <option value="">None</option>
                      <option>Best Seller</option>
                      <option>Eco-Friendly</option>
                      <option>New Arrival</option>
                      <option>Sale</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Stock</label>
                    <input className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      placeholder="0" type="number" value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Description</label>
                  <textarea className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                    rows={3} placeholder="Describe the key features and benefits..."
                    value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Status</label>
                  <div className="flex gap-3">
                    {["active", "draft"].map((s) => (
                      <button key={s} onClick={() => setForm({ ...form, status: s })}
                        className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-colors ${
                          form.status === s ? (s === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700") : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                        }`}>{s === "active" ? "✅ Active" : "📝 Draft"}</button>
                    ))}
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Product Image</label>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => handleImageChange(e.target.files[0])} />
                  <div onClick={() => fileRef.current.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => { e.preventDefault(); setDragging(false); handleImageChange(e.dataTransfer.files[0]); }}
                    className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
                      dragging ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300"
                    }`}>
                    {imagePreview ? (
                      <div className="relative w-full">
                        <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-xl" />
                        <button onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(null); }}
                          className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow text-slate-600 hover:text-red-500 font-bold text-sm">✕</button>
                      </div>
                    ) : (
                      <>
                        <span className="text-3xl mb-2">☁️</span>
                        <p className="text-sm font-semibold text-slate-600">Drop image here or click to upload</p>
                        <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={resetForm} className="px-5 py-2 rounded-xl font-semibold text-sm text-slate-500 hover:bg-slate-100 transition-colors">Discard</button>
                  <button onClick={handleSubmit} disabled={submitting}
                    className="px-7 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-60 transition-colors shadow-md shadow-blue-600/20">
                    {submitting ? "Saving..." : editingId ? "Update Product" : "Publish Product"}
                  </button>
                </div>
              </div>
            </section>

            {/* Stats */}
            <aside className="space-y-5">
              <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg shadow-blue-600/25">
                <p className="text-blue-200 text-xs font-bold uppercase tracking-wider">Inventory Value</p>
                <h4 className="text-4xl font-black mt-1 tracking-tight">${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
                <div className="mt-4 flex gap-4 text-xs">
                  <div className="bg-white/20 px-2.5 py-1.5 rounded-lg font-semibold">📦 {products.length} total</div>
                  <div className="bg-white/20 px-2.5 py-1.5 rounded-lg font-semibold">✅ {activeCount} active</div>
                </div>
              </div>

              {lowStock.length > 0 && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200">
                  <h4 className="font-black text-sm mb-4">⚠️ Stock Alerts</h4>
                  <div className="space-y-3">
                    {lowStock.slice(0, 5).map((p) => (
                      <div key={p._id} className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${Number(p.stock) < 5 ? "bg-red-100" : "bg-orange-100"}`}>
                          {Number(p.stock) < 5 ? "🔴" : "🟠"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate">{p.name}</p>
                          <p className="text-xs text-slate-400">{p.stock} items left</p>
                        </div>
                        <button onClick={() => handleEdit(p)} className="text-blue-600 text-xs font-bold hover:underline">Edit</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <h4 className="font-black text-sm mb-4">📊 By Category</h4>
                <div className="space-y-2">
                  {Object.entries(products.reduce((acc, p) => { acc[p.category] = (acc[p.category] || 0) + 1; return acc; }, {}))
                    .sort((a, b) => b[1] - a[1]).slice(0, 5).map(([cat, count]) => (
                      <div key={cat} className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 font-medium truncate">{cat}</span>
                        <span className="font-black text-slate-900 ml-2">{count}</span>
                      </div>
                    ))}
                  {products.length === 0 && <p className="text-xs text-slate-400">No products yet</p>}
                </div>
              </div>
            </aside>
          </div>

          {/* Products Table */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
              <h3 className="text-base font-black">All Products</h3>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                <input className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                    <th className="px-6 py-3.5">Product</th>
                    <th className="px-6 py-3.5">Category</th>
                    <th className="px-6 py-3.5">Price</th>
                    <th className="px-6 py-3.5">Stock</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">Loading...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                      {products.length === 0 ? "No products yet. Add your first product above!" : "No products match your search."}
                    </td></tr>
                  ) : filtered.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                            <img src={getImageUrl(p.image) || "https://via.placeholder.com/40"} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-sm font-bold text-slate-800">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{p.category}</td>
                      <td className="px-6 py-4 text-sm font-bold">${Number(p.price).toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{p.stock || 0}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          p.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                        }`}>{p.status}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleEdit(p)} className="w-8 h-8 rounded-lg hover:bg-blue-50 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors text-sm">✏️</button>
                          <button onClick={() => setDeleteConfirm(p._id)} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors text-sm">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-400">Showing {filtered.length} of {products.length} products</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
