"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  DollarSign, 
  ShoppingBag,
  LayoutDashboard,
  Search,
  LogOut,
  CalendarDays
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { courses } from "@/data/courses";
import { practiceTests } from "@/data/practiceTests";
import { services } from "@/data/services";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Build a fast lookup dictionary for all products and their prices
  const productDictionary = useMemo(() => {
    const dict: Record<string, { title: string; price: number; type: string }> = {};
    
    courses.forEach(c => dict[c.id] = { title: c.title, price: c.price, type: 'Course' });
    practiceTests.forEach(p => dict[p.id] = { title: p.title, price: p.price || 0, type: 'Practice Test' });
    services.forEach(s => {
      (s.packages || []).forEach(pkg => {
        dict[pkg.id] = { title: `${s.title} - ${pkg.title}`, price: pkg.price, type: 'Service' };
      });
    });
    
    return dict;
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users || []);
        }
      } catch (e) {
        console.error("Failed to fetch users", e);
      } finally {
        setLoading(false);
      }
    };
    if (session && (session.user as any).role === "admin") {
      fetchUsers();
    } else if (session) {
      setLoading(false); // They aren't admin, UI will handle redirect via page.tsx
    }
  }, [session]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.name.toLowerCase().includes(search.toLowerCase()) || 
      u.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const totalSales = useMemo(() => {
    let total = 0;
    if (!users || !Array.isArray(users)) return 0;
    users.forEach(user => {
      if (user && user.purchasedContent && Array.isArray(user.purchasedContent)) {
        user.purchasedContent.forEach((id: string) => {
          if (id && productDictionary[id]) {
            total += (productDictionary[id].price || 0);
          }
        });
      }
    });
    return total;
  }, [users, productDictionary]);

  const totalPurchases = useMemo(() => {
    let count = 0;
    if (!users || !Array.isArray(users)) return 0;
    users.forEach(user => {
      if (user && user.purchasedContent && Array.isArray(user.purchasedContent)) {
        count += user.purchasedContent.length;
      }
    });
    return count;
  }, [users]);

  // Group revenue by country (Target markets only)
  const revenueByCountry = useMemo(() => {
    const stats: Record<string, { total: number; courses: Record<string, number> }> = {
      "United Kingdom": { total: 0, courses: {} },
      "Canada": { total: 0, courses: {} },
      "United States": { total: 0, courses: {} },
    };

    if (!users || !Array.isArray(users)) return stats;

    users.forEach(user => {
      if (!user) return;
      // Filter out non-target countries
      if (user.country === "India" || user.country === "UAE" || user.country === "Dubai" || user.country === "United Arab Emirates") return;

      if (user.purchasedContent && Array.isArray(user.purchasedContent)) {
        user.purchasedContent.forEach((id: string) => {
          if (!id) return;
          const product = productDictionary[id];
          if (product) {
            // Determine country based on product or user data
            let country = user.country;
            if (!country || country === "Unknown") {
              const lowerId = id.toLowerCase();
              if (lowerId.includes('imech') || lowerId.includes('iet') || lowerId.includes('ice')) country = "United Kingdom";
              else if (lowerId.includes('peng')) country = "Canada";
              else if (lowerId.includes('pe') || lowerId.includes('ncees')) country = "United States";
            }

            // Only track revenue for our 3 main markets
            if (country && stats[country]) {
              stats[country].total += (product.price || 0);
              const title = product.title || "Unknown Product";
              stats[country].courses[title] = (stats[country].courses[title] || 0) + (product.price || 0);
            }
          }
        });
      }
    });
    return stats;
  }, [users, productDictionary]);

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 flex justify-center">
      <div className="max-w-[1400px] w-full px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-[#061F33] rounded-2xl shadow-xl overflow-hidden text-white sticky top-28">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Admin Panel</h2>
                  <p className="text-xs text-gray-400">Emphasis Engineering</p>
                </div>
              </div>
            </div>
            <div className="py-2">
              <button className="w-full flex items-center gap-3 px-6 py-4 text-sm font-semibold bg-white/10 text-white border-l-4 border-primary">
                <Users className="w-5 h-5" />
                Users & Sales
              </button>
            </div>
            <div className="border-t border-white/10 py-2 mt-12">
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full flex items-center gap-3 px-6 py-4 text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-teal-600 font-display mb-2">Admin Command Center v3</h1>
              <p className="text-gray-500">Live monitoring of UK, Canada, and US revenue streams.</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Users, label: "Total Registered Users", value: users.length, color: "text-blue-600", bg: "bg-blue-100" },
                { icon: DollarSign, label: "Total Revenue (Mock)", value: `$${totalSales.toLocaleString()}`, color: "text-green-600", bg: "bg-green-100" },
                { icon: ShoppingBag, label: "Total Items Sold", value: totalPurchases, color: "text-purple-600", bg: "bg-purple-100" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5"
                >
                  <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center shrink-0`}>
                    <stat.icon className={`w-7 h-7 ${stat.color}`} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">{stat.label}</div>
                    <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Revenue by Country (Excluding India) */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 font-display">Target Market Analytics</h2>
                  <p className="text-xs text-teal-600 font-bold mt-1">UK, CANADA & US ONLY (ALL OTHERS REMOVED)</p>
                </div>
                <div className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wider">Live Sales Data</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(revenueByCountry).map(([country, data]) => (
                  <div key={country} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-bold text-gray-900">{country}</span>
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      </div>
                      <div className="space-y-2">
                        {Object.entries(data.courses).length === 0 ? (
                           <div className="text-[10px] text-gray-400 italic py-2">No sales yet</div>
                        ) : (
                          Object.entries(data.courses).slice(0, 3).map(([title, rev]) => (
                            <div key={title} className="flex justify-between items-center text-[10px]">
                              <span className="text-gray-500 truncate mr-2">{title}</span>
                              <span className="font-medium text-gray-900">${rev}</span>
                            </div>
                          ))
                        )}
                        {Object.keys(data.courses).length > 3 && (
                          <div className="text-[9px] text-gray-400 italic">+{Object.keys(data.courses).length - 3} more...</div>
                        )}
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">Total Revenue</div>
                      <div className="text-2xl font-black text-primary">${data.total.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-bold text-gray-900 font-display">Registered Users</h2>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search users..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 font-medium">
                    <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Joined Date</th>
                      <th className="px-6 py-4">Purchases</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                          No users found matching "{search}"
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900">{user.name}</div>
                            <div className="text-gray-500 text-xs">{user.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              user.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600 flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-gray-400" />
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            {(!user.purchasedContent || user.purchasedContent.length === 0) ? (
                              <span className="text-gray-400 italic">No purchases</span>
                            ) : (
                              <div className="space-y-1">
                                {user.purchasedContent.map((id: string) => {
                                  if (!id) return null;
                                  const product = productDictionary[id];
                                  return product ? (
                                    <div key={id} className="text-xs">
                                      <span className="font-medium text-gray-900">{product.title}</span>
                                      <span className="text-green-600 ml-2">${product.price}</span>
                                    </div>
                                  ) : (
                                    <div key={id} className="text-xs text-gray-400">Unknown Product ({id})</div>
                                  )
                                })}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
