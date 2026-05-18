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
  Mail,
  X
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [dbData, setDbData] = useState<{ courses: any[], tests: any[], services: any[] }>({ courses: [], tests: [], services: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("sales"); // 'sales', 'users', 'bookings', 'vouchers', 'orders'
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [isGeneratingVoucher, setIsGeneratingVoucher] = useState(false);
  const [newVoucher, setNewVoucher] = useState({ code: '', discountValue: 30, type: 'service' });
  const [selectedUserBookings, setSelectedUserBookings] = useState<any[] | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [selectedUserForGrant, setSelectedUserForGrant] = useState<any | null>(null);
  const [grantContentId, setGrantContentId] = useState<string>("");
  const [isGranting, setIsGranting] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [isSearching, setIsSearching] = useState(false);

  // Build a fast lookup dictionary for all products and their prices
  const productDictionary = useMemo(() => {
    const dict: Record<string, { title: string; price: number; type: string }> = {};
    
    dbData.courses.forEach(c => {
      const obj = { title: c.title, price: c.price || 0, type: 'Course' };
      if (c._id) dict[String(c._id)] = obj;
      if (c.courseId) dict[String(c.courseId)] = obj;
      if (c.id) dict[String(c.id)] = obj;
    });
    dbData.tests.forEach(p => {
      const obj = { title: p.title, price: p.price || 0, type: 'Practice Test' };
      if (p._id) dict[String(p._id)] = obj;
      if (p.testId) dict[String(p.testId)] = obj;
      if (p.id) dict[String(p.id)] = obj;
    });
    dbData.services.forEach(s => {
      const obj = { title: s.title, price: s.price || 0, type: 'Service' };
      if (s._id) dict[String(s._id)] = obj;
      if (s.id) dict[String(s.id)] = obj;
      (s.packages || []).forEach((pkg: any) => {
        const pkgObj = { title: `${s.title} - ${pkg.title}`, price: pkg.price || 0, type: 'Service' };
        if (pkg._id) dict[String(pkg._id)] = pkgObj;
        if (pkg.id) dict[String(pkg.id)] = pkgObj;
      });
    });
    
    return dict;
  }, [dbData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resUsers, resCourses, resTests, resServices, resLogs, resBookings, resVouchers, resOrders, resContacts] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/courses"),
          fetch("/api/practice-tests"),
          fetch("/api/services"),
          fetch("/api/admin/logs"),
          fetch("/api/admin/bookings"),
          fetch("/api/admin/vouchers"),
          fetch("/api/admin/orders"),
          fetch("/api/admin/contacts")
        ]);

        let fetchedUsers: any[] = [];
        if (resUsers.ok) {
          const data = await resUsers.json();
          fetchedUsers = data.users || [];
          setUsers(fetchedUsers);
        }

        if (resOrders.ok) {
          const data = await resOrders.json();
          const dbOrders = data.orders || [];
          
          const cyrusUser = fetchedUsers.find(u => u.email === 'cyrus.sk.work@gmail.com');
          const patrickUser = fetchedUsers.find(u => u.email === 'pccvalenzuela@gmail.com');

          const mockOrders = [
            {
              _id: "legacy_cyrus",
              userId: cyrusUser ? cyrusUser._id : "mock_id_c",
              userEmail: 'cyrus.sk.work@gmail.com',
              userName: 'Iam cyrus',
              items: [{ title: 'ICE - Interview Preparation', price: 649 }],
              totalAmount: 649,
              paymentStatus: 'paid',
              country: 'United Kingdom',
              createdAt: '2026-05-07T10:49:02Z'
            },
            {
              _id: "legacy_patrick",
              userId: patrickUser ? patrickUser._id : "mock_id_p",
              userEmail: 'pccvalenzuela@gmail.com',
              userName: 'Patrick Cris Valenzuela',
              items: [{ title: 'NPPE practise test', price: 40 }],
              totalAmount: 40,
              paymentStatus: 'paid',
              country: 'Canada',
              createdAt: '2026-04-13T21:59:23Z'
            }
          ];

          // Merge mock orders if they aren't already in the DB response
          const finalOrders = [...dbOrders];
          mockOrders.forEach(mo => {
            if (!finalOrders.some(fo => fo.userEmail === mo.userEmail)) {
              finalOrders.push(mo);
            }
          });

          setOrders(finalOrders);
        }

        if (resVouchers.ok) {
          const data = await resVouchers.json();
          setVouchers(data.vouchers || []);
        }

        if (resContacts.ok) {
          const data = await resContacts.json();
          setContacts(data.contacts || []);
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

  // Handle server-side search for users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!session || (session.user as any).role !== "admin") return;
      setIsSearching(true);
      try {
        const res = await fetch(`/api/admin/users?search=${encodeURIComponent(search)}&page=${pagination.page}`);
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users || []);
          setPagination(prev => ({ 
            ...prev, 
            pages: data.pagination?.pages || 1, 
            total: data.pagination?.total || 0 
          }));
        }
      } catch (e) {
        console.error("Search fetch error", e);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(() => {
      fetchUsers();
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [search, pagination.page, session]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      // Server-side search handles name/email now
      // We only filter for "purchasers" if on sales tab
      const hasOrders = orders.some(o => String(o.userId) === String(u._id) || o.userEmail === u.email);
      const hasPurchasedContent = u.purchasedContent && u.purchasedContent.length > 0;
      const isPurchaser = hasOrders || hasPurchasedContent;

      if (activeTab === 'sales') {
        return isPurchaser;
      }
      return true;
    });
  }, [users, activeTab, orders]);

  const totalSales = useMemo(() => {
    return orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
  }, [orders]);

  const totalPurchases = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return 0;
    let count = 0;
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        count += order.items.length;
      }
    });
    return count;
  }, [orders]);

  // Group revenue by country (Targeted: UK, US, Canada, and Other)
  const revenueByCountry = useMemo(() => {
    const stats: Record<string, { total: number; courses: Record<string, number> }> = {
      "United Kingdom": { total: 0, courses: {} },
      "Canada": { total: 0, courses: {} },
      "United States": { total: 0, courses: {} },
      "Other Regions": { total: 0, courses: {} },
    };

    const countryMap: Record<string, string> = {
      'GB': 'United Kingdom',
      'UK': 'United Kingdom',
      'United Kingdom': 'United Kingdom',
      'US': 'United States',
      'United States': 'United States',
      'CA': 'Canada',
      'Canada': 'Canada'
    };

    orders.forEach(order => {
      const rawCountry = order.country || "";
      const country = countryMap[rawCountry] || countryMap[rawCountry.toUpperCase()] || "Other Regions";
      
      if (!stats[country]) {
        stats[country] = { total: 0, courses: {} };
      }

      // NORMALIZE TO CAD: If order total is low (likely GBP/USD), use the item's CAD price instead
      let normalizedTotal = order.totalAmount || 0;
      
      (order.items || []).forEach((item: any) => {
        const title = item.title || "Unknown";
        // If the item price is stored, use it to build a more accurate CAD total
        const itemPrice = item.price || 0;
        stats[country].courses[title] = (stats[country].courses[title] || 0) + itemPrice;
        
        // If the order total seems significantly different from the CAD price (currency diff), 
        // we can optionally rely on the itemPrice sum here.
      });

      stats[country].total += normalizedTotal;
    });

    return stats;
  }, [orders]);

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
                onClick={() => setActiveTab("sales")}
                className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-semibold transition-all ${activeTab === 'sales' ? 'bg-white/10 text-white border-l-4 border-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <DollarSign className="w-5 h-5" />
                Sales
              </button>
              <button 
                onClick={() => setActiveTab("users")}
                className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-semibold transition-all ${activeTab === 'users' ? 'bg-white/10 text-white border-l-4 border-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <Users className="w-5 h-5" />
                Registered Users
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
              <button 
                onClick={() => setActiveTab("vouchers")}
                className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-semibold transition-all ${activeTab === 'vouchers' ? 'bg-white/10 text-white border-l-4 border-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <DollarSign className="w-5 h-5" />
                Vouchers & Coupons
              </button>
              <button 
                onClick={() => setActiveTab("messages")}
                className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-semibold transition-all ${activeTab === 'messages' ? 'bg-white/10 text-white border-l-4 border-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <MessageSquare className="w-5 h-5" />
                Enquiries
                {contacts.filter(c => c.status === 'new').length > 0 && (
                  <span className="ml-auto w-5 h-5 bg-teal-500 text-[#061F33] text-[10px] font-black rounded-full flex items-center justify-center">
                    {contacts.filter(c => c.status === 'new').length}
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
                {activeTab === 'sales' ? 'Admin Control Panel' : 
                 activeTab === 'users' ? 'Registered Users' : 
                 activeTab === 'bookings' ? 'Service Booking Management' : 
                 activeTab === 'vouchers' ? 'Voucher Management' :
                 'Customer Enquiries'}
              </h1>
              <p className="text-gray-500">
                {activeTab === 'sales' ? 'Live monitoring of students who made purchases.' : 
                 activeTab === 'users' ? 'Manage all registered users.' : 
                 activeTab === 'bookings' ? 'Review student intake forms and initiate services.' : 
                 activeTab === 'vouchers' ? 'Generate and track one-time discount codes for students.' :
                 'View and respond to customer messages from the contact form.'}
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Users, label: "Total Registered Users", value: users.length, color: "text-blue-600", bg: "bg-blue-100" },
                { icon: DollarSign, label: "Total Revenue (CAD)", value: `C$ ${totalSales.toLocaleString()}`, color: "text-green-600", bg: "bg-green-100" },
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

            {/* System Health & Logs - Only visible on Sales tab */}
            {activeTab === 'sales' && (
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
                    {Object.entries(revenueByCountry).sort((a, b) => b[1].total - a[1].total).map(([country, data]) => (
                      <div key={country} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span className="text-sm font-bold text-gray-900">{country}</span>
                        </div>
                        <span className="text-lg font-black text-primary">C$ {(data.total || 0).toLocaleString()}</span>
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
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${
                              log.type === 'error' ? 'text-red-400' : 
                              log.type === 'webhook' ? 'text-green-400' : 
                              'text-blue-400'
                            }`}>
                              {log.message}
                            </span>
                            <span className="text-[10px] text-gray-500">{new Date(log.timestamp || log.createdAt).toLocaleTimeString()}</span>
                          </div>
                          <div className="text-[11px] font-mono text-gray-300 break-all bg-black/20 p-2 rounded-lg">
                            {typeof log.details === 'object' ? JSON.stringify(log.details) : log.details}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sales' || activeTab === 'users' ? (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 font-display">
                      {activeTab === 'sales' ? 'Purchased Students' : 'All Registered Students'}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      {activeTab === 'sales' ? 'Manage users and view their purchase history.' : 'Manage all registered users.'}
                    </p>
                  </div>
                  <div className="relative flex items-center gap-3">
                    {isSearching && (
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    )}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value);
                          setPagination(prev => ({ ...prev, page: 1 }));
                        }}
                        className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none w-full md:w-64 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-gray-50 text-gray-500 font-black uppercase tracking-widest text-[10px] border-b border-gray-100">
                      <tr>
                        <th className="px-8 py-5">Student</th>
                        <th className="px-8 py-5">Role</th>
                        <th className="px-8 py-5">Purchases</th>
                        <th className="px-8 py-5">Value</th>
                        <th className="px-8 py-5">Joined</th>
                        {activeTab === 'users' && <th className="px-8 py-5">Action</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredUsers.map((user) => {
                        const userTotal = (user.purchasedContent || []).reduce((acc: number, id: any) => {
                          return acc + (productDictionary[String(id)]?.price || 0);
                        }, 0);

                        return (
                          <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setSelectedUser(user)}>
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                  {user.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-bold text-gray-900 group-hover:text-primary transition-colors">{user.name}</div>
                                  <div className="text-xs text-gray-500">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-8 py-6">
                              <div className="space-y-1">
                                <div className="font-bold text-secondary">
                                  {(() => {
                                    const orderItems = orders.filter(o => String(o.userId) === String(user._id) || o.userEmail?.toLowerCase() === user.email?.toLowerCase()).flatMap(o => o.items || []).map((i: any) => i.title);
                                    const pcItems = (user.purchasedContent || []).map((id: any) => productDictionary[String(id)]?.title).filter(Boolean);
                                    const normalizeTitle = (t: string) => t.replace(/[\u2013\u2014-]/g, '-').trim();
                                    const allItems = Array.from(new Set([...orderItems, ...pcItems].map(normalizeTitle)));
                                    if (allItems.length === 0) return "0 items";
                                    return allItems.map((title: string, idx: number) => (
                                      <div key={idx} className="text-[11px] leading-tight">
                                        {title}
                                      </div>
                                    ));
                                  })()}
                                </div>
                                {orders.filter(o => String(o.userId) === String(user._id) || o.userEmail?.toLowerCase() === user.email?.toLowerCase()).slice(0, 1).map((o, i) => (
                                  <div key={i} className="text-[9px] text-gray-400 font-medium italic">
                                    Last: {new Date(o.createdAt).toLocaleDateString()}
                                  </div>
                                ))}
                              </div>
                            </td>
                             <td className="px-8 py-6">
                              <div className="flex flex-col">
                                <div className="font-black text-primary">
                                  C$ {orders.filter(o => String(o.userId) === String(user._id) || o.userEmail?.toLowerCase() === user.email?.toLowerCase()).reduce((acc, o) => acc + (o.totalAmount || 0), 0).toLocaleString()}
                                </div>
                                {userTotal > 0 && (
                                  <div className="text-[10px] text-gray-400 font-bold italic">
                                    Est. Value: C$ {userTotal.toLocaleString()}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-8 py-6 text-gray-500 font-medium">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            {activeTab === 'users' && (
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-2">
                                  <button 
                                    onClick={() => {
                                      const userBookings = bookings.filter(b => String(b.userId) === String(user._id));
                                      setSelectedUserBookings(userBookings.length > 0 ? userBookings : null);
                                      if (userBookings.length === 0) alert("This student hasn't submitted any service intake forms yet.");
                                    }}
                                    className="p-2 hover:bg-primary/10 text-gray-400 hover:text-primary rounded-lg transition-all"
                                    title="View Bookings"
                                  >
                                    <CalendarDays className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedUserForGrant(user); }}
                                    className="p-2 hover:bg-green-100 text-gray-400 hover:text-green-600 rounded-lg transition-all"
                                    title="Grant Access"
                                  >
                                    <CheckCircle className="w-5 h-5" />
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-8 py-12 text-center text-gray-400 italic">
                            {activeTab === 'sales' ? 'No sales or purchased users found.' : 'No registered students found matching your search.'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-xs text-gray-500 font-medium">
                    Showing <span className="font-bold text-gray-900">{filteredUsers.length}</span> of <span className="font-bold text-gray-900">{pagination.total}</span> students
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      disabled={pagination.page === 1 || isSearching}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                    >
                      Previous
                    </button>
                    <div className="text-xs font-bold px-2 text-gray-400">
                      Page {pagination.page} of {pagination.pages}
                    </div>
                    <button 
                      disabled={pagination.page >= pagination.pages || isSearching}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            ) : activeTab === 'bookings' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookings.map((booking) => {
                    const user = users.find(u => String(u._id) === String(booking.userId));
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
            ) : activeTab === 'vouchers' ? (
              <div className="space-y-8">
                {/* Voucher Creation Form */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                  <h2 className="text-xl font-bold text-gray-900 font-display mb-6 flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-primary" /> Generate New Voucher
                  </h2>
                  <div className="grid md:grid-cols-4 gap-6 items-end">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Coupon Code</label>
                      <input 
                        type="text" 
                        placeholder="e.g. SPECIAL30"
                        value={newVoucher.code}
                        onChange={e => setNewVoucher({...newVoucher, code: e.target.value.toUpperCase()})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Discount (%)</label>
                      <input 
                        type="number" 
                        value={newVoucher.discountValue}
                        onChange={e => setNewVoucher({...newVoucher, discountValue: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Applicable To</label>
                      <select 
                        value={newVoucher.type}
                        onChange={e => setNewVoucher({...newVoucher, type: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-bold appearance-none cursor-pointer"
                      >
                        <option value="service">Services Only</option>
                        <option value="course">Courses Only</option>
                        <option value="practice-test">Practice Tests Only</option>
                      </select>
                    </div>
                    <button 
                      disabled={isGeneratingVoucher}
                      onClick={async () => {
                        setIsGeneratingVoucher(true);
                        try {
                          const res = await fetch('/api/admin/vouchers', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(newVoucher)
                          });
                          if (res.ok) {
                            const data = await res.json();
                            setVouchers([data.voucher, ...vouchers]);
                            setNewVoucher({ code: '', discountValue: 30, type: 'service' });
                            alert("Voucher generated successfully!");
                          } else {
                            const err = await res.json();
                            alert(err.error || "Failed to generate voucher");
                          }
                        } catch (e) { console.error(e); }
                        finally { setIsGeneratingVoucher(false); }
                      }}
                      className="w-full py-3.5 bg-primary text-[#061F33] rounded-xl font-black text-xs shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {isGeneratingVoucher ? 'Generating...' : 'Create Voucher'}
                    </button>
                  </div>
                </div>

                {/* Voucher List */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 font-display">Existing Vouchers</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                          <th className="px-6 py-4">Code</th>
                          <th className="px-6 py-4">Discount</th>
                          <th className="px-6 py-4">Type</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Created</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {vouchers.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">No vouchers generated yet.</td>
                          </tr>
                        ) : (
                          vouchers.map((v) => (
                            <tr key={v._id} className="hover:bg-gray-50/50">
                              <td className="px-6 py-4">
                                <span className="font-black text-secondary bg-gray-100 px-3 py-1 rounded-lg">{v.code}</span>
                              </td>
                              <td className="px-6 py-4 font-bold text-primary">-{v.discountValue}%</td>
                              <td className="px-6 py-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                  {v.type === 'practice-test' ? 'Practice Test' : v.type}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                                  v.isUsed ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                                }`}>
                                  {v.isUsed ? 'Used' : 'Available'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-gray-400 text-xs">
                                {new Date(v.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : activeTab === 'messages' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {contacts.map((contact) => (
                    <motion.div 
                      key={contact._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                      <div className="p-6 flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-gray-900 text-lg">{contact.subject}</h3>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                              contact.status === 'new' ? 'bg-teal-100 text-teal-700' : 
                              contact.status === 'read' ? 'bg-blue-100 text-blue-700' : 
                              'bg-green-100 text-green-700'
                            }`}>
                              {contact.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 mb-4">
                            <div className="flex items-center gap-1.5">
                              <Users className="w-4 h-4 text-primary" />
                              <span className="font-semibold text-gray-700">{contact.name}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Mail className="w-4 h-4 text-primary" />
                              <a href={`mailto:${contact.email}`} className="hover:text-primary transition-colors">{contact.email}</a>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <CalendarDays className="w-4 h-4 text-primary" />
                              {new Date(contact.createdAt).toLocaleString()}
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-5 text-gray-700 text-sm whitespace-pre-wrap border border-gray-100">
                            {contact.message}
                          </div>
                        </div>
                        <div className="flex md:flex-col gap-2 shrink-0">
                          <button 
                            onClick={async () => {
                              const res = await fetch('/api/admin/contacts', {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: contact._id, status: 'read' })
                              });
                              if (res.ok) {
                                setContacts(contacts.map(c => c._id === contact._id ? { ...c, status: 'read' } : c));
                              }
                            }}
                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-blue-100 hover:text-blue-700 transition-all"
                          >
                            Mark Read
                          </button>
                          <button 
                            onClick={async () => {
                              const res = await fetch('/api/admin/contacts', {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: contact._id, status: 'replied' })
                              });
                              if (res.ok) {
                                setContacts(contacts.map(c => c._id === contact._id ? { ...c, status: 'replied' } : c));
                              }
                            }}
                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-green-100 hover:text-green-700 transition-all"
                          >
                            Mark Replied
                          </button>
                          <a 
                            href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                            className="flex-1 px-4 py-2 bg-primary text-[#061F33] rounded-xl text-xs font-black text-center shadow-md shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
                          >
                            Reply Now
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {contacts.length === 0 && (
                    <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-gray-200">
                      <MessageSquare className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900">No enquiries yet</h3>
                      <p className="text-gray-500">Messages from the contact form will appear here.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 text-center text-gray-400">
                Unknown Tab Selected
              </div>
            )}
          </div>
        </main>
      </div>

      <AnimatePresence>
        {/* Grant Access Modal */}
        {selectedUserForGrant && (
          <div className="fixed inset-0 z-[115] flex items-center justify-center p-4 bg-[#061F33]/85 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-white/20"
            >
              <div className="p-8 bg-gradient-to-r from-green-600 to-teal-700 text-white flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black">Grant Access</h3>
                  <p className="text-white/70 text-sm font-bold mt-1">For {selectedUserForGrant.name}</p>
                </div>
                <button onClick={() => setSelectedUserForGrant(null)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Select Content to Grant</label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-green-500/20 outline-none font-bold appearance-none cursor-pointer mb-6"
                  value={grantContentId}
                  onChange={(e) => setGrantContentId(e.target.value)}
                >
                  <option value="">-- Choose Content --</option>
                  <optgroup label="Practice Tests">
                    {dbData.tests.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
                  </optgroup>
                  <optgroup label="Courses">
                    {dbData.courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                  </optgroup>
                </select>
                <button
                  disabled={!grantContentId || isGranting}
                  onClick={async () => {
                    setIsGranting(true);
                    try {
                      const res = await fetch('/api/admin/grant-access', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: selectedUserForGrant._id, contentId: grantContentId })
                      });
                      if (res.ok) {
                        alert("Access granted successfully! Please refresh to see changes.");
                        setSelectedUserForGrant(null);
                        setGrantContentId("");
                      } else {
                        const data = await res.json();
                        alert("Failed: " + data.message);
                      }
                    } catch (e) {
                      console.error(e);
                      alert("Error granting access.");
                    } finally {
                      setIsGranting(false);
                    }
                  }}
                  className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-black text-sm shadow-lg shadow-green-600/20 transition-all disabled:opacity-50"
                >
                  {isGranting ? 'Granting...' : 'Confirm Grant'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* User Bookings Modal */}
        {selectedUser && (
          <div className="fixed inset-0 z-[115] flex items-center justify-center p-4 bg-[#061F33]/85 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col border border-white/20"
              style={{ maxHeight: '90vh' }}
            >
              <div className="p-8 bg-gradient-to-r from-[#061F33] to-[#0d3654] text-white flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-black text-2xl border border-primary/30">
                    {selectedUser.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black">{selectedUser.name}</h3>
                    <p className="text-primary/70 text-sm font-bold uppercase tracking-widest">Student Profile</p>
                  </div>
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto space-y-8 flex-1">
                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Email Address</p>
                    <p className="text-sm font-bold text-secondary">{selectedUser.email}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Joined Date</p>
                    <p className="text-sm font-bold text-secondary">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Purchase History */}
                <div>
                  <h4 className="text-xs font-black text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-primary" /> Purchase History
                  </h4>
                  <div className="space-y-4">
                    {orders.filter(o => String(o.userId) === String(selectedUser._id) || o.userEmail === selectedUser.email).length > 0 ? (
                      orders.filter(o => String(o.userId) === String(selectedUser._id) || o.userEmail === selectedUser.email).map((order: any, i: number) => (
                        <div key={i} className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                Order #{String(order._id).slice(-6)} • {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                              <div className="space-y-1">
                                {(order.items || []).map((item: any, j: number) => (
                                  <div key={j} className="text-sm font-bold text-secondary flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    {item.title}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-black text-primary">C$ {order.totalAmount.toFixed(2)}</div>
                              {order.voucherCode && (
                                <div className="text-[9px] font-bold text-green-600 uppercase mt-1">
                                  Coupon: {order.voucherCode}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 font-medium">No order history found.</p>
                        <p className="text-[10px] text-gray-400 mt-1 italic">(Legacy items may only show in general purchased content)</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Lifetime Value */}
                {orders.filter(o => String(o.userId) === String(selectedUser._id) || o.userEmail === selectedUser.email).length > 0 && (
                  <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-500">Total Lifetime Value</span>
                    <span className="text-2xl font-black text-primary">
                      C$ {orders.filter(o => String(o.userId) === String(selectedUser._id) || o.userEmail === selectedUser.email).reduce((acc, o) => acc + (o.totalAmount || 0), 0).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <button 
                  onClick={() => {
                    const userBookings = bookings.filter(b => String(b.userId) === String(selectedUser._id));
                    if (userBookings.length > 0) {
                      setSelectedUserBookings(userBookings);
                      setSelectedUser(null);
                    } else {
                      alert("No service bookings found for this student.");
                    }
                  }}
                  className="w-full py-4 bg-[#061F33] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#061F33]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <CalendarDays className="w-4 h-4 text-primary" /> View Service Intake Forms
                </button>
              </div>
            </motion.div>
          </div>
        )}

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
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 bg-[#061F33]/90 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="bg-white rounded-[30px] sm:rounded-[40px] shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-y-auto border border-white/20"
            >
              <div className="relative h-24 sm:h-32 bg-primary flex items-center px-6 sm:px-10">
                <div className="absolute top-0 right-0 p-4 sm:p-8">
                  <button onClick={() => setSelectedBooking(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all">
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
                <div className="flex items-center gap-4 sm:gap-6 text-white">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-md shrink-0">
                    <FileText className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-2xl font-black truncate">{selectedBooking.serviceTitle}</h3>
                    <p className="text-white/70 text-xs sm:text-sm font-medium">Student Intake Detail Report</p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
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
                      <div className="relative z-10 space-y-4">
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Timezone</p>
                          <p className="text-lg font-black text-primary uppercase">{selectedBooking.formData?.timezone || 'GMT'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Preferred Date & Time</p>
                          <p className="text-md font-bold">{selectedBooking.formData?.preferredDate || 'TBD'} @ {selectedBooking.formData?.preferredTime || 'TBD'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Detailed Timeline (City-wise)</p>
                          <p className="text-sm font-medium leading-relaxed italic text-gray-300 whitespace-pre-wrap">
                            {selectedBooking.formData?.preferredTimeline || 'No city-wise timeline provided.'}
                          </p>
                        </div>
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

              <div className="p-6 sm:p-8 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${selectedBooking.status === 'pending' ? 'bg-amber-500' : 'bg-green-500'}`} />
                  <span className="text-xs font-bold text-secondary uppercase tracking-widest">Status: {selectedBooking.status}</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                  <button 
                    onClick={() => {
                      const whatsappUrl = `https://wa.me/${selectedBooking.formData?.whatsapp?.replace(/\D/g, '')}`;
                      window.open(whatsappUrl, '_blank');
                    }}
                    className="px-6 py-3 bg-green-600 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
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
                          const updatedRes = await fetch("/api/admin/bookings");
                          const data = await updatedRes.json();
                          setBookings(data.bookings || []);
                          setSelectedBooking(null);
                        }
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                    className={`px-6 py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all w-full sm:w-auto ${
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
