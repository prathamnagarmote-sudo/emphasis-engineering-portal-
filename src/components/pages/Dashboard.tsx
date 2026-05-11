"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { 
  LayoutDashboard, 
  User, 
  GraduationCap, 
  Star, 
  Gamepad2, 
  Bookmark, 
  ShoppingCart, 
  LogOut,
  BookOpen,
  Trophy,
  Play,
  Loader2,
  Calendar,
  CheckCircle,
  Check,
  Search,
  Mail,
  ShieldCheck,
  Send,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import ServiceIntakeForm from "@/components/forms/ServiceIntakeForm";

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard", active: true },
  { icon: User, label: "My Profile", id: "profile" },
  { icon: ShoppingCart, label: "Order History", id: "orders" },
];

export default function Dashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dbData, setDbData] = useState<{ courses: any[], tests: any[], services: any[] }>({ courses: [], tests: [], services: [] });
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [resCourses, resTests, resServices, resBookings] = await Promise.all([
          fetch("/api/courses"),
          fetch("/api/practice-tests"),
          fetch("/api/services"),
          fetch("/api/services/booking")
        ]);

        const [courses, tests, services, bookingsData] = await Promise.all([
          resCourses.json(),
          resTests.json(),
          resServices.json(),
          resBookings.json()
        ]);

        setDbData({ 
          courses: Array.isArray(courses) ? courses : [], 
          tests: Array.isArray(tests) ? tests : [], 
          services: Array.isArray(services) ? services : [] 
        });
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const purchasedIds = useMemo(() => {
    return (session?.user as any)?.purchasedContent || [];
  }, [session]);

  const myContent = useMemo(() => {
    // Courses and Tests (Access based)
    const baseContent = [
      ...dbData.courses.filter(c => purchasedIds.includes(c.id || c._id)).map(c => ({ ...c, type: 'course', image: c.thumbnail, id: c.id || c._id })),
      ...dbData.tests.filter(p => purchasedIds.includes(p.id || p.testId || p._id)).map(p => ({ ...p, type: 'test', image: p.image, id: p.id || p.testId || p._id })),
    ];

    // Services (Each booking is a separate entry)
    const serviceEntries = bookings.map(booking => {
      const parentService = dbData.services.find(s => s.packages?.some((pkg: any) => (pkg.serviceId || pkg.id) === booking.serviceId));
      return {
        ...booking,
        id: booking._id,
        serviceId: booking.serviceId,
        title: booking.serviceTitle,
        type: 'service',
        image: parentService?.image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
        description: `Purchased on ${new Date(booking.createdAt).toLocaleDateString()}`,
        isScheduled: !!booking.formData?.name
      };
    });

    return [...baseContent, ...serviceEntries];
  }, [purchasedIds, dbData, bookings]);

  const enrolledCount = myContent.filter(c => c.type === 'course').length;
  const testCount = myContent.filter(c => c.type === 'test').length;
  const serviceCount = myContent.filter(c => c.type === 'service').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-12 bg-gray-50 flex justify-center">
      <div className="max-w-[1400px] w-full px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="py-2">
              {SIDEBAR_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-6 py-3.5 text-sm font-semibold transition-colors ${
                    activeTab === item.id
                      ? "bg-[#3F9FA3] text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-[#3F9FA3]"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </div>
            
            <div className="border-t border-gray-100 py-2">
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full flex items-center gap-3 px-6 py-3.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 font-display">Welcome back, {session?.user?.name || "Student"}!</h1>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: BookOpen, label: "Enrolled Courses", value: enrolledCount, color: "text-[#3F9FA3]", bg: "bg-[#3F9FA3]/10" },
                  { icon: Gamepad2, label: "Practice Tests", value: testCount, color: "text-[#3F9FA3]", bg: "bg-[#3F9FA3]/10" },
                  { icon: Trophy, label: "Premium Services", value: serviceCount, color: "text-[#3F9FA3]", bg: "bg-[#3F9FA3]/10" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center"
                  >
                    <div className={`w-14 h-14 rounded-full ${stat.bg} flex items-center justify-center mb-4`}>
                      <stat.icon className={`w-7 h-7 ${stat.color}`} />
                    </div>
                    <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-sm font-medium text-gray-500">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Learning Content */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 font-display mb-4">My Learning Content</h2>
                
                {myContent.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">You haven't purchased anything yet.</h3>
                    <p className="text-gray-500 mb-6">Browse our catalog to get started!</p>
                    <div className="flex justify-center gap-4">
                      <Link href="/courses" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-white font-semibold">
                        Browse Courses
                      </Link>
                      <Link href="/services" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold">
                        View Services
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {myContent.map((content) => (
                      <div key={content.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                        <div className="relative w-full md:w-64 h-48 md:h-auto bg-gray-200 shrink-0">
                          <img 
                            src={content.image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800"} 
                            alt={content.title} 
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div className="absolute top-4 left-4">
                            <span className={`px-3 py-1 text-white text-[10px] font-bold uppercase rounded-md tracking-wider ${
                              content.type === 'course' ? 'bg-primary' : content.type === 'test' ? 'bg-amber-500' : 'bg-purple-600'
                            }`}>
                              {content.type}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-6 flex-1 flex flex-col">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                            {content.title}
                          </h3>
                          <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                            {content.description || content.desc}
                          </p>
                          
                          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-sm text-gray-500 font-medium">
                              {content.type === 'service' && content.isScheduled ? "Meeting Scheduled" : "Purchased & Unlocked"}
                            </span>
                            
                            {content.type === 'service' ? (
                              <div className="flex gap-2">
                                {content.isScheduled ? (
                                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg font-semibold text-sm border border-green-200">
                                    <CheckCircle className="w-4 h-4" />
                                    Details Provided
                                  </div>
                                ) : (
                                  <button 
                                    onClick={() => setSelectedBooking(content)}
                                    className="flex items-center gap-2 px-4 py-2 bg-purple-600/10 text-purple-600 hover:bg-purple-600 hover:text-white rounded-lg font-semibold transition-colors text-sm"
                                  >
                                    <Calendar className="w-4 h-4" />
                                    Schedule Meeting
                                  </button>
                                )}
                              </div>
                            ) : (
                              <Link href={
                                content.type === 'course' ? `/courses/${content.id}` :
                                `/practice-tests/${content.id}`
                              }>
                                <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg font-semibold transition-colors text-sm">
                                  <Play className="w-4 h-4" />
                                  {content.type === 'course' ? 'Continue Learning' : 'Start Exam'}
                                </button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 font-display mb-2">Order History</h1>
                <p className="text-gray-500">Track all your purchases and invoices here.</p>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Item Details</th>
                        <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                        <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Type</th>
                        <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {myContent.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-8 py-20 text-center text-gray-500 italic">
                            No orders found.
                          </td>
                        </tr>
                      ) : (
                        myContent.map((item, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-8 py-6">
                              <div className="font-bold text-gray-900">{item.title}</div>
                              <div className="text-xs text-gray-400 mt-1">Order ID: #{item.id?.toString().slice(-8).toUpperCase()}</div>
                            </td>
                            <td className="px-8 py-6 text-sm text-gray-600">
                              {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recently Purchased"}
                            </td>
                            <td className="px-8 py-6">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                item.type === 'course' ? 'bg-primary/10 text-primary' : 
                                item.type === 'test' ? 'bg-amber-100 text-amber-700' : 
                                'bg-purple-100 text-purple-700'
                              }`}>
                                {item.type}
                              </span>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                                <CheckCircle className="w-4 h-4" />
                                Completed
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {activeTab === "profile" && (
            <div className="max-w-2xl mx-auto space-y-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 font-display mb-2">My Profile</h1>
                <p className="text-gray-500">Manage your personal information and account security.</p>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 space-y-8">
                  {/* Name Section */}
                  <div className="space-y-4">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="text" 
                          id="profile-name"
                          defaultValue={session?.user?.name || ""}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-gray-900"
                        />
                      </div>
                      <button 
                        onClick={async () => {
                          const name = (document.getElementById('profile-name') as HTMLInputElement).value;
                          try {
                            const res = await fetch('/api/user/profile/update', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ name })
                            });
                            if (res.ok) alert("Name updated!");
                          } catch (e) { console.error(e); }
                        }}
                        className="px-8 py-4 bg-primary text-[#061F33] font-bold rounded-2xl hover:scale-105 transition-all shadow-lg shadow-primary/10"
                      >
                        Update
                      </button>
                    </div>
                  </div>

                  {/* Email Section */}
                  <div className="space-y-4 pt-8 border-t border-gray-50">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                    <div className="space-y-4">
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          disabled
                          type="email" 
                          value={session?.user?.email || ""}
                          className="w-full pl-12 pr-4 py-4 bg-gray-100 border border-gray-100 rounded-2xl text-gray-400 font-medium"
                        />
                      </div>
                      
                      <div id="email-update-flow" className="hidden space-y-4">
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                          <input 
                            type="email" 
                            id="new-email"
                            placeholder="New Email Address"
                            className="w-full pl-12 pr-4 py-4 bg-white border border-primary/20 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                          />
                        </div>
                        <div id="otp-input-area" className="hidden flex gap-4">
                          <div className="relative flex-1">
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                            <input 
                              type="text" 
                              id="email-otp"
                              placeholder="Enter 6-digit OTP"
                              maxLength={6}
                              className="w-full pl-12 pr-4 py-4 bg-white border border-primary/20 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold tracking-[0.5em]"
                            />
                          </div>
                          <button 
                            id="verify-email-btn"
                            className="px-8 py-4 bg-secondary text-white font-bold rounded-2xl"
                          >
                            Verify & Save
                          </button>
                        </div>
                        <button 
                          id="send-otp-btn"
                          className="w-full py-4 bg-primary text-[#061F33] font-bold rounded-2xl flex items-center justify-center gap-2"
                        >
                          <Send className="w-4 h-4" /> Send Verification Code
                        </button>
                      </div>

                      <button 
                        id="start-email-change"
                        onClick={() => {
                          document.getElementById('email-update-flow')?.classList.remove('hidden');
                          document.getElementById('start-email-change')?.classList.add('hidden');
                        }}
                        className="text-primary font-bold text-sm flex items-center gap-2 hover:underline"
                      >
                        <ShieldCheck className="w-4 h-4" /> Change Email Address
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Safety Banner */}
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-900">Security Note</h4>
                  <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                    Changing your email will update your login credentials. You will need to use your new email address for all future logins.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Profile Script Logic */}
      <script dangerouslySetInnerHTML={{ __html: `
        document.addEventListener('click', async (e) => {
          if (e.target.id === 'send-otp-btn' || e.target.closest('#send-otp-btn')) {
            const email = document.getElementById('new-email').value;
            if (!email) return alert("Please enter new email");
            
            try {
              const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
              });
              if (res.ok) {
                document.getElementById('otp-input-area').classList.remove('hidden');
                document.getElementById('send-otp-btn').classList.add('hidden');
                alert("OTP sent to " + email);
              }
            } catch (err) { console.error(err); }
          }

          if (e.target.id === 'verify-email-btn') {
            const email = document.getElementById('new-email').value;
            const otp = document.getElementById('email-otp').value;
            try {
              const res = await fetch('/api/user/profile/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
              });
              if (res.ok) {
                alert("Email updated successfully! Please login again.");
                window.location.reload();
              } else {
                const data = await res.json();
                alert(data.message || "Update failed");
              }
            } catch (err) { console.error(err); }
          }
        });
      ` }} />

      {/* Booking Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Schedule Your Session</h3>
              <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-gray-600 p-2">
                <Check className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[80vh]">
              <ServiceIntakeForm 
                bookingId={selectedBooking._id} 
                serviceTitle={selectedBooking.title} 
                onSuccess={() => {
                  setSelectedBooking(null);
                  window.location.reload();
                }} 
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
