"use client";

import { useEffect, useState, ElementType, FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Briefcase,
  Building2,
  Code2,
  Target,
  Award,
  ArrowRight,
  Check,
  Sparkles,
  TrendingUp,
  Users,
  Clock,
  Shield,
  Zap,
  ChevronDown,
  Star,
  Play,
  BarChart3,
  Globe
} from 'lucide-react';
import SectionTitle from '@/components/ui/SectionTitle';
import PageHero from '@/components/ui/PageHero';

const iconMap: Record<string, ElementType> = {
  Briefcase,
  Building2,
  Code2,
  Target,
  Award,
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, delay, ease: "easeOut" as any },
});

const Services: FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.error("Failed to fetch services", err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const faqs = [
    {
      q: "How do I choose the right service package?",
      a: "We offer a free 15-minute consultation to assess your current qualifications and recommend the best pathway based on your target country and engineering discipline."
    },
    {
      q: "Are the mentoring sessions one-on-one?",
      a: "Yes, all our premium and standard packages include dedicated one-on-one mentoring sessions with licensed professional engineers in your field."
    },
    {
      q: "What is the typical timeline for licensure?",
      a: "Timelines vary by region: UK CEng typically takes 6-12 months, Canadian P.Eng around 3-6 months after experience review, and US PE depends on exam schedules, usually 8-14 months total."
    },
    {
      q: "Can I switch packages after enrolling?",
      a: "Absolutely. You can upgrade your package at any time and only pay the difference. Downgrades are available within the first 14 days."
    },
    {
      q: "Is there a money-back guarantee?",
      a: "Yes. We offer a moneyback guarantee under fairuse terms if our services do not meet the promised standard. Please note that final registration decisions remain with external institutions."
    }
  ];

  const steps = [
    {
      icon: Target,
      title: "Assess",
      desc: "We evaluate your current qualifications, experience, and career goals to identify the optimal licensure pathway."
    },
    {
      icon: Zap,
      title: "Prepare",
      desc: "Receive a customized roadmap, study materials, document templates, and direct mentoring from licensed engineers."
    },
    {
      icon: Shield,
      title: "Submit",
      desc: "Our experts review every document before submission, ensuring compliance with your target board's requirements."
    },
    {
      icon: Award,
      title: "Succeed",
      desc: "Pass your exams, ace your interviews, and receive your professional engineering license with confidence."
    }
  ];

  return (
    <div className="pt-20 bg-gradient-to-b from-white via-gray-50 to-white">

      <PageHero
        badge="Professional Licensure Pathways"
        heading={
          <>
            Accelerate Your{" "}
            <span className="text-gradient">Career Growth</span>
          </>
        }
        subtitle="Beyond courses, we offer personalized services to help you achieve your professional goals faster and more effectively."
        primaryCta={{ label: "Explore Services", href: "#services" }}
        secondaryCta={{ label: "Book Free Consultation", href: "/contact" }}
      />

      {/* TRUST BAR */}
      <section className="py-12 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { value: '2,000+', label: 'Engineers Mentored', icon: Users },
              { value: '100%', label: 'Success Rate', icon: TrendingUp },
              { value: '24/7', label: 'Expert Support', icon: Clock },
              { value: '10+', label: 'Countries Served', icon: Globe },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-2xl mb-3 group-hover:bg-primary/20 transition-colors"
                >
                  <stat.icon className="w-6 h-6 text-primary" />
                </motion.div>
                <div className="font-display text-3xl font-bold text-secondary mb-1">{stat.value}</div>
                <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeUp(0)} className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              Our Process
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary mb-4">
              Four Steps to Licensure
            </h2>
            <div className="w-20 h-1 bg-primary rounded-full mx-auto mb-4" />
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              A proven methodology that has helped thousands of engineers achieve their professional goals
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative"
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full border border-gray-100 relative z-10"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                    className="w-16 h-16 bg-gradient-to-br from-primary to-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/25"
                  >
                    <step.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  <div className="text-5xl font-bold text-gray-100 mb-2 font-display">0{index + 1}</div>
                  <h3 className="font-display text-xl font-bold text-secondary mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section id="services" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeUp(0)} className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              Solutions
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary mb-4">
              Tailored for Your Success
            </h2>
            <div className="w-20 h-1 bg-primary rounded-full mx-auto mb-4" />
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Comprehensive support packages designed for every stage of your engineering career
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-3xl p-8 h-80 border border-gray-100 shadow-lg">
                  <div className="w-16 h-16 bg-gray-200 rounded-2xl mb-6"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-8"></div>
                </div>
              ))
            ) : services.map((service: any, index: number) => {
              const Icon = iconMap[service.icon] || Briefcase;
              const isFeatured = false; // index === 1; // Highlight middle card (REMOVED: User requested removal of Most Popular badge)

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  <Link href={`/services/${service.id}`} className="block h-full">
                    <motion.div
                      whileHover={{ y: -12, transition: { duration: 0.2 } }}
                      className={`relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col border ${isFeatured ? 'border-primary/30 ring-1 ring-primary/20' : 'border-gray-100'}`}
                    >

                      <div className="flex items-start justify-between mb-6">
                        <motion.div
                          whileHover={{ rotate: 5, scale: 1.1 }}
                          className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20"
                        >
                          <Icon className="w-8 h-8 text-white" />
                        </motion.div>

                        {isFeatured && (
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="w-4 h-4 fill-yellow-500" />
                            <span className="text-sm font-bold">4.9</span>
                          </div>
                        )}
                      </div>

                      <h3 className="font-display text-2xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>

                      <p className="text-gray-600 mb-6 flex-1 leading-relaxed">
                        {service.description}
                      </p>

                      <div className="space-y-3 mb-8">
                        {service.features.slice(0, 3).map((feature: any, i: number) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 + i * 0.05 }}
                            className="flex items-center gap-3 text-sm text-gray-600"
                          >
                            <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 text-primary" />
                            </div>
                            <span className="font-medium">{feature}</span>
                          </motion.div>
                        ))}
                        {service.features.length > 3 && (
                          <p className="text-sm text-primary font-semibold pl-8">
                            +{service.features.length - 3} more features
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                        <span className="text-primary font-bold text-lg">
                          View Details
                        </span>
                        <motion.div
                          whileHover={{ x: 4 }}
                          className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors"
                        >
                          <ArrowRight className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                        </motion.div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
                Why Emphasis Engineering
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary mb-6 leading-tight">
                Trusted by Engineers{" "}
                <span className="text-primary">Worldwide</span>
              </h2>
              <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                We combine deep technical expertise with personalized mentoring to deliver
                results that matter. Our track record speaks for itself.
              </p>

              <div className="space-y-6">
                {[
                  { icon: Shield, title: "Licensed Mentor Network", desc: "Learn directly from CEng, P.Eng, and PE licensed professionals." },
                  { icon: BarChart3, title: "Data-Driven Approach", desc: "Our strategies are backed by success metrics from 50,000+ candidates." },
                  { icon: Play, title: "Flexible Learning", desc: "Self-paced modules combined with live sessions that fit your schedule." },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="flex gap-4 group"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-secondary mb-1">{item.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80"
                  alt="Team collaboration"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent" />
              </div>

              {/* Floating Card */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, type: "spring" }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-xl border border-gray-100 max-w-[200px]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondary">100%</div>
                    <div className="text-xs text-gray-500">Pass Rate</div>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-green-500 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: '95%' }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 1, ease: "easeOut" as any }}
                  />
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* TESTIMONIAL SPOTLIGHT */}
      <section className="py-24 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-[#1a3a52] to-secondary" />
        <motion.div
          className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" as any }}
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
              <Award className="w-8 h-8 text-primary" />
            </div>

            <blockquote className="text-2xl md:text-4xl text-white font-medium leading-relaxed mb-8">
              "After struggling with UK-SPEC evidence, Max's roadmap and DAP review finally secured my CEng.
              His precision during PRI preparation was the deciding factor. Thanks, Emphasis Engineering"
            </blockquote>

            <div className="flex items-center justify-center gap-4">
              <img
                src="https://res.cloudinary.com/dwk1cnlw2/image/upload/v1777458169/nicky_wha_adwauo.jpg"
                alt="Testimonial"
                className="w-14 h-14 rounded-full object-cover border-2 border-primary"
              />
              <div className="text-left">
                <div className="text-white font-bold">Nicky W.</div>
                <div className="text-white/60 text-sm">Chartered Engineer,CEng, MIET</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              FAQ
            </span>
            <h2 className="font-display text-4xl font-bold text-secondary mb-4">
              Common Questions
            </h2>
            <p className="text-gray-600">
              Everything you need to know before getting started
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-secondary pr-4">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-secondary to-[#1a3a52] rounded-3xl p-12 md:p-16 relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 opacity-10"
              animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
              transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse' }}
              style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '50px 50px',
              }}
            />

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring" }}
                className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-6"
              >
                <Sparkles className="w-10 h-10 text-primary" />
              </motion.div>

              <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                Need a Custom Solution?
              </h3>
              <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
                Can't find what you're looking for? Our team is ready to create a customized
                solution tailored to your specific needs.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-primary text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
                  >
                    Contact Us
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <Link href="/services">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/25 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all"
                  >
                    View All Services
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;