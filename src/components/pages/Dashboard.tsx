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
  MessageCircleQuestion, 
  Settings, 
  LogOut,
  BookOpen,
  Trophy,
  Play,
  Loader2,
  Calendar,
  CheckCircle,
  Check
} from "lucide-react";
import Link from "next/link";

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard", active: true },
  { icon: User, label: "My Profile", id: "profile" },
  { icon: GraduationCap, label: "Enrolled Courses", id: "enrolled" },
  { icon: Star, label: "Reviews", id: "reviews" },
  { icon: Gamepad2, label: "My Quiz Attempts", id: "quizzes" },
  { icon: Bookmark, label: "Wishlist", id: "wishlist" },
  { icon: ShoppingCart, label: "Order History", id: "orders" },
  { icon: MessageCircleQuestion, label: "Question & Answer", id: "qa" },
];

export default function Dashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dbData, setDbData] = useState<{ courses: any[], tests: any[], services: any[] }>({ courses: [], tests: [], services: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [resCourses, resTests, resServices] = await Promise.all([
          fetch("/api/courses"),
          fetch("/api/practice-tests"),
          fetch("/api/services")
        ]);

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

  const scheduledIds = useMemo(() => {
    return (session?.user as any)?.scheduledServiceIds || [];
  }, [session]);

  const myContent = useMemo(() => {
    const allContent = [
      ...dbData.courses.map(c => ({ ...c, type: 'course', image: c.thumbnail, id: c.id || c._id })),
      ...dbData.tests.map(p => ({ ...p, type: 'test', image: p.image, id: p.id || p.testId || p._id })),
      ...dbData.services.flatMap(s => (s.services || []).map((pkg: any) => ({
        ...s,
        id: pkg.serviceId || pkg.id, // Use serviceId for matching
        title: `${s.title} – ${pkg.title}`,
        type: 'service',
        image: s.image,
        calendlyUrl: pkg.calendlyUrl || "https://cal.com/emphasis-engineering-cbfkch/30min"
      })))
    ];
    return allContent.filter(c => purchasedIds.includes(c.id));
  }, [purchasedIds, dbData]);

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
                className="w-full flex items-center gap-3 px-6 py-3.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-[#3F9FA3] transition-colors"
              >
                <Settings className="w-5 h-5" />
                Settings
              </button>
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
                              Purchased & Unlocked
                            </span>
                            
                            {content.type === 'service' ? (
                              <div className="w-full">
                                {scheduledIds.includes(content.id) ? (
                                  <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold text-sm border border-green-200">
                                    <CheckCircle className="w-4 h-4" />
                                    Scheduled
                                  </div>
                                ) : (
                                  <a 
                                    href={content.calendlyUrl || "https://cal.com/emphasis-engineering-cbfkch/30min"} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    onClick={async () => {
                                      try {
                                        await fetch('/api/purchase/schedule', {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ serviceId: content.id })
                                        });
                                        window.location.reload();
                                      } catch (e) {
                                        console.error("Failed to mark as scheduled", e);
                                      }
                                    }}
                                  >
                                    <button className="flex items-center gap-2 px-4 py-2 bg-purple-600/10 text-purple-600 hover:bg-purple-600 hover:text-white rounded-lg font-semibold transition-colors text-sm">
                                      <Calendar className="w-4 h-4" />
                                      Schedule Meeting
                                    </button>
                                  </a>
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
          
          {activeTab !== "dashboard" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LayoutDashboard className="w-8 h-8 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Coming Soon</h2>
                <p className="text-gray-500">This section is currently under development.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
