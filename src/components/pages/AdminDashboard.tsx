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
  CalendarDays,
  FileText,
  Clock,
  Phone,
  MessageSquare,
  Globe,
  MapPin,
  CheckCircle,
  X
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [dbData, setDbData] = useState<{ courses: any[], tests: any[], services: any[] }>({ courses: [], tests: [], services: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("users"); // 'users' or 'bookings'
  const [selectedUserBookings, setSelectedUserBookings] = useState<any[] | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  // Build a fast lookup dictionary for all products and their prices
  const productDictionary = useMemo(() => {
    const dict: Record<string, { title: string; price: number; type: string }> = {};
    
    dbData.courses.forEach(c => dict[c.id || c._id] = { title: c.title, price: c.price, type: 'Course' });
    dbData.tests.forEach(p => dict[p.id || p.testId || p._id] = { title: p.title, price: p.price || 0, type: 'Practice Test' });
    dbData.services.forEach(s => {
      (s.packages || []).forEach((pkg: any) => {
        dict[pkg.id] = { title: `${s.title} - ${pkg.title}`, price: pkg.price, type: 'Service' };
      });
    });
    
    return dict;
  }, [dbData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resUsers, resCourses, resTests, resServices, resLogs, resBookings] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/courses"),
          fetch("/api/practice-tests"),
          fetch("/api/services"),
          fetch("/api/admin/logs"),
          fetch("/api/admin/bookings")
        ]);

        if (resUsers.ok) {
          const data = await resUsers.json();
          setUsers(data.users || []);
        }

        if (resLogs.ok) {
          const data = await resLogs.json();
          setLogs(data.logs || []);
        }

        if (resBookings.ok) {
          const data = await resBookings.json();
          setBookings(data.bookings || []);
        }

        const [courses, tests, services] = await Promise.all([
          resCourses.json(),
          resTests.json(),
          resServices.json()
        ]);

        setDbData({ 
          courses: Array.isArray(courses) ? courses : [], 
          tests: Array.isArray(tests) ? tests : [], 
          services: Array.isArray(services) ? services : [] 
        });

      } catch (e) {
        console.error("Failed to fetch admin data", e);
      } finally {
        setLoading(false);
      }
    };
    if (session && (session.user as any).role === "admin") {
      fetchData();
    } else if (session) {
      setLoading(false);
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
              else country = "Other";
            }

            // Ensure country exists in stats
            if (country && !stats[country]) {
              stats[country] = { total: 0, courses: {} };
            }

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
              <button 
                onClick={() => setActiveTab("users")}
                className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-semibold transition-all ${activeTab === 'users' ? 'bg-white/10 text-white border-l-4 border-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <Users className="w-5 h-5" />
                Users & Sales
              </button>
              <button 
                onClick={() => setActiveTab("bookings")}
                className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-semibold transition-all ${activeTab === 'bookings' ? 'bg-white/10 text-white border-l-4 border-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <CalendarDays className="w-5 h-5" />
                Service Bookings
                {bookings.filter(b => b.status === 'pending').length > 0 && (
                  <span className="ml-auto w-5 h-5 bg-primary text-[#061F33] text-[10px] font-black rounded-full flex items-center justify-center">
                    {bookings.filter(b => b.status === 'pending').length}
                  </span>
                )}
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
              <h1 className="text-3xl font-bold text-teal-600 font-display mb-2">
                {activeTab === 'users' ? 'Admin Command Center' : 'Service Booking Management'}
              </h1>
              <p className="text-gray-500">
                {activeTab === 'users' ? 'Live monitoring of UK, Canada, and US revenue streams.' : 'Review student intake forms and initiate services.'}
              </p>
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

            {/* System Health & Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Revenue Analytics (from before) */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 font-display">Global Market Analytics</h2>
                    <p className="text-xs text-teal-600 font-bold mt-1">ALL REGIONS AND REVENUE STREAMS</p>
                  </div>
                  <div className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wider">Live Sales Data</div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {Object.entries(revenueByCountry).slice(0, 4).map(([country, data]) => (
                    <div key={country} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-sm font-bold text-gray-900">{country}</span>
                      </div>
                      <span className="text-lg font-black text-primary">${data.total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real-time Webhook Logs */}
              <div className="bg-[#061F33] rounded-3xl shadow-xl p-8 text-white">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <h2 className="text-xl font-bold font-display">Stripe Webhook Health</h2>
                  </div>
                  <button 
                    onClick={async () => {
                      const res = await fetch('/api/admin/logs');
                      const data = await res.json();
                      setLogs(data.logs || []);
                    }}
                    className="text-[10px] uppercase tracking-widest font-bold text-primary hover:text-white transition-colors"
                  >
                    Refresh Logs
                  </button>
                </div>

                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                  {logs.length === 0 ? (
                    <div className="text-gray-500 text-sm italic py-4">No events recorded yet.</div>
                  ) : (
                    logs.map((log: any, idx: number) => (
                      <div key={idx} className={`p-3 rounded-xl border ${
                        log.type === 'error' ? 'bg-red-500/10 border-red-500/20' : 
                        log.type === 'webhook' ? 'bg-green-500/10 border-green-500/20' : 
                        'bg-white/5 border-white/10'
                      }`}>
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${
                            log.type === 'error' ? 'text-red-400' : 'text-primary'
                          }`}>
                            {log.message}
                          </span>
                          <span className="text-[9px] text-gray-500">
                            {new Date(log.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        {log.details && (
                          <div className="text-[9px] text-gray-400 font-mono truncate">
                            {JSON.stringify(log.details)}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
                <p className="text-[9px] text-gray-500 mt-4 italic">
                  Monitoring incoming signals from Stripe API. Errors indicate configuration issues in Vercel.
                </p>
              </div>
            </div>

            {activeTab === 'users' ? (
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
                        filteredUsers.map((user) => {
                          const userBookings = bookings.filter(b => b.userId === user._id);
                          return (
                            <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-4">
                                <button 
                                  onClick={() => userBookings.length > 0 && setSelectedUserBookings(userBookings)}
                                  className={`text-left group ${userBookings.length > 0 ? 'cursor-pointer' : 'cursor-default'}`}
                                >
                                  <div className={`font-semibold text-gray-900 ${userBookings.length > 0 ? 'group-hover:text-primary' : ''}`}>{user.name}</div>
                                  <div className="text-gray-500 text-xs">{user.email}</div>
                                  {userBookings.length > 0 && (
                                    <div className="mt-1 flex items-center gap-1 text-[10px] text-primary font-bold">
                                      <FileText className="w-3 h-3" />
                                      {userBookings.length} Service Booking{userBookings.length > 1 ? 's' : ''}
                                    </div>
                                  )}
                                </button>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  user.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                <div className="flex items-center gap-2">
                                  <CalendarDays className="w-4 h-4 text-gray-400" />
                                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                {(!user.purchasedContent || user.purchasedContent.length === 0) ? (
                                  <div className="space-y-2">
                                    <span className="text-gray-400 italic">No purchases</span>
                                    <div className="flex gap-2">
                                      <input 
                                        id={`grant-${user._id}`}
                                        type="text" 
                                        placeholder="Course ID" 
                                        className="text-[10px] px-2 py-1 border rounded w-32"
                                      />
                                      <button 
                                        onClick={async () => {
                                          const idInput = document.getElementById(`grant-${user._id}`) as HTMLInputElement;
                                          const contentId = idInput.value;
                                          if (!contentId) return;
                                          try {
                                            const res = await fetch('/api/admin/grant-access', {
                                              method: 'POST',
                                              headers: { 'Content-Type': 'application/json' },
                                              body: JSON.stringify({ userId: user._id, contentId })
                                            });
                                            if (res.ok) {
                                              alert("Access granted!");
                                              window.location.reload();
                                            }
                                          } catch (e) { console.error(e); }
                                        }}
                                        className="text-[10px] bg-primary text-white px-2 py-1 rounded"
                                      >
                                        Grant
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    <div className="space-y-1">
                                      {user.purchasedContent.map((id: string) => {
                                        if (!id) return null;
                                        const product = productDictionary[id];
                                        const booking = bookings.find(b => b.serviceId === id && b.userId === user._id);
                                        return product ? (
                                          <div key={id} className="text-xs flex items-center justify-between gap-4">
                                            <div className="flex flex-col">
                                              <span className="font-medium text-gray-900">{product.title}</span>
                                              <span className="text-green-600">${product.price}</span>
                                            </div>
                                            {booking && (
                                              <button 
                                                onClick={() => setSelectedBooking(booking)}
                                                className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded hover:bg-primary hover:text-white transition-all"
                                              >
                                                Details
                                              </button>
                                            )}
                                          </div>
                                        ) : (
                                          <div key={id} className="text-xs text-gray-400">Unknown Product ({id})</div>
                                        )
                                      })}
                                    </div>
                                    <div className="flex gap-2 pt-2 border-t border-gray-50">
                                      <input 
                                        id={`grant-${user._id}`}
                                        type="text" 
                                        placeholder="Add more..." 
                                        className="text-[10px] px-2 py-1 border rounded w-24"
                                      />
                                      <button 
                                        onClick={async () => {
                                          const idInput = document.getElementById(`grant-${user._id}`) as HTMLInputElement;
                                          const contentId = idInput.value;
                                          if (!contentId) return;
                                          try {
                                            const res = await fetch('/api/admin/grant-access', {
                                              method: 'POST',
                                              headers: { 'Content-Type': 'application/json' },
                                              body: JSON.stringify({ userId: user._id, contentId })
                                            });
                                            if (res.ok) window.location.reload();
                                          } catch (e) { console.error(e); }
                                        }}
                                        className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded"
                                      >
                                        Add
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookings.map((booking) => {
                    const user = users.find(u => u._id === booking.userId);
                    return (
                      <motion.div 
                        key={booking._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer group"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                            booking.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {booking.status}
                          </div>
                          <div className="text-[10px] text-gray-400 font-medium">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{booking.serviceTitle}</h3>
                        <p className="text-xs text-gray-500 mb-4">{user?.name || 'Unknown Student'}</p>
                        
                        <div className="space-y-2 border-t border-gray-50 pt-4">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            {booking.formData?.preferredDate || 'No date set'}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <MapPin className="w-3.5 h-3.5 text-primary" />
                            {booking.formData?.city || 'No location'}
                          </div>
                        </div>
                        
                        <button className="w-full mt-4 py-2 bg-gray-50 text-gray-600 group-hover:bg-primary group-hover:text-white rounded-lg text-xs font-bold transition-all">
                          View Details
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
                {bookings.length === 0 && (
                  <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
                    <CalendarDays className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900">No bookings yet</h3>
                    <p className="text-gray-500">Service bookings will appear here once students submit their intake forms.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* User Bookings Modal */}
      <AnimatePresence>
        {selectedUserBookings && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#061F33]/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <h3 className="text-xl font-bold text-gray-900">Service Bookings</h3>
                <button onClick={() => setSelectedUserBookings(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
                {selectedUserBookings.map((booking) => (
                  <div 
                    key={booking._id} 
                    className="p-4 rounded-2xl border border-gray-100 hover:border-primary/30 transition-all cursor-pointer bg-white"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setSelectedUserBookings(null);
                    }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-gray-900">{booking.serviceTitle}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${booking.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Submitted on {new Date(booking.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {selectedBooking && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#061F33]/90 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="bg-white rounded-[40px] shadow-2xl w-full max-w-3xl overflow-hidden border border-white/20"
            >
              <div className="relative h-32 bg-primary flex items-center px-10">
                <div className="absolute top-0 right-0 p-8">
                  <button onClick={() => setSelectedBooking(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex items-center gap-6 text-white">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black">{selectedBooking.serviceTitle}</h3>
                    <p className="text-white/70 font-medium">Student Intake Detail Report</p>
                  </div>
                </div>
              </div>

              <div className="p-10 grid md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-black text-primary mb-4 flex items-center gap-2">
                      <Users className="w-3 h-3" /> Student Profile
                    </h4>
                    <div className="space-y-4 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Full Name</p>
                        <p className="text-secondary font-bold">{selectedBooking.formData?.name || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Email Address</p>
                        <p className="text-secondary font-bold">{selectedBooking.formData?.email || 'Not provided'}</p>
                      </div>
                      <div className="flex gap-8">
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">Phone</p>
                          <p className="text-secondary font-bold flex items-center gap-2"><Phone className="w-3 h-3 text-primary" /> {selectedBooking.formData?.phone || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">WhatsApp</p>
                          <p className="text-secondary font-bold flex items-center gap-2"><MessageSquare className="w-3 h-3 text-green-500" /> {selectedBooking.formData?.whatsapp || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-black text-primary mb-4 flex items-center gap-2">
                      <MapPin className="w-3 h-3" /> Location
                    </h4>
                    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <Globe className="w-5 h-5 text-secondary" />
                      <span className="font-bold text-secondary">{selectedBooking.formData?.city}, {selectedBooking.formData?.country}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-black text-primary mb-4 flex items-center gap-2">
                      <Clock className="w-3 h-3" /> Scheduling Preference
                    </h4>
                    <div className="bg-[#061F33] p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <CalendarDays className="w-16 h-16" />
                      </div>
                      <div className="relative z-10">
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Preferred Date</p>
                        <p className="text-xl font-black mb-4">{selectedBooking.formData?.preferredDate || 'TBD'}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Preferred Time Slot</p>
                        <p className="text-xl font-black">{selectedBooking.formData?.preferredTime || 'TBD'}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-black text-primary mb-4 flex items-center gap-2">
                      <FileText className="w-3 h-3" /> Additional Notes
                    </h4>
                    <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 text-amber-900 text-sm leading-relaxed italic">
                      "{selectedBooking.formData?.additionalInfo || 'No extra notes provided by the student.'}"
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${selectedBooking.status === 'pending' ? 'bg-amber-500' : 'bg-green-500'}`} />
                  <span className="text-xs font-bold text-secondary uppercase tracking-widest">Status: {selectedBooking.status}</span>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      const whatsappUrl = `https://wa.me/${selectedBooking.formData?.whatsapp?.replace(/\D/g, '')}`;
                      window.open(whatsappUrl, '_blank');
                    }}
                    className="px-6 py-3 bg-green-600 text-white rounded-2xl font-black text-xs flex items-center gap-2 shadow-lg shadow-green-500/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" /> Contact via WhatsApp
                  </button>
                  <button 
                    disabled={selectedBooking.status === 'scheduled'}
                    onClick={async () => {
                      try {
                        const res = await fetch('/api/admin/bookings/update', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ bookingId: selectedBooking._id, status: 'scheduled' })
                        });
                        if (res.ok) {
                          alert("Status updated to Scheduled!");
                          const updatedRes = await fetch("/api/admin/bookings");
                          const data = await updatedRes.json();
                          setBookings(data.bookings || []);
                          setSelectedBooking(null);
                        }
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                    className={`px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 shadow-lg transition-all ${
                      selectedBooking.status === 'scheduled' 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-primary text-[#061F33] shadow-primary/20 hover:scale-105 active:scale-95'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" /> 
                    {selectedBooking.status === 'scheduled' ? 'Already Scheduled' : 'Mark as Scheduled'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
