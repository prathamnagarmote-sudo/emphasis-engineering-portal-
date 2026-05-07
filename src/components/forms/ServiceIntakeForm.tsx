"use client";

import { FC, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  Globe, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Search,
  ArrowRight,
  User,
  Mail,
  Send,
  ChevronDown
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';

interface IntakeFormProps {
  bookingId: string;
  serviceTitle: string;
  onSuccess: () => void;
}

const timezones = [
  { label: 'London, UK (GMT/UTC)', value: 'GMT', offset: '+0:00' },
  { label: 'Kolkata, India (IST)', value: 'IST', offset: '+5:30' },
  { label: 'New York, USA (EST)', value: 'EST', offset: '-5:00' },
  { label: 'Toronto, Canada (EST)', value: 'EST', offset: '-5:00' },
  { label: 'Dubai, UAE (GST)', value: 'GST', offset: '+4:00' },
  { label: 'Riyadh, Saudi Arabia (AST)', value: 'AST', offset: '+3:00' },
  { label: 'Lagos, Nigeria (WAT)', value: 'WAT', offset: '+1:00' },
  { label: 'Islamabad, Pakistan (PKT)', value: 'PKT', offset: '+5:00' },
  { label: 'Dhaka, Bangladesh (BST)', value: 'BST', offset: '+6:00' },
  { label: 'Sydney, Australia (AEDT)', value: 'AEDT', offset: '+11:00' },
  { label: 'Singapore (SGT)', value: 'SGT', offset: '+8:00' },
  { label: 'Berlin, Germany (CET)', value: 'CET', offset: '+1:00' },
];

const countryCodes = [
  { code: '+44', country: 'UK' },
  { code: '+1', country: 'USA' },
  { code: '+1 ', country: 'Canada' },
  { code: '+91', country: 'India' },
  { code: '+971', country: 'UAE' },
  { code: '+966', country: 'Saudi Arabia' },
  { code: '+974', country: 'Qatar' },
  { code: '+965', country: 'Kuwait' },
  { code: '+968', country: 'Oman' },
  { code: '+973', country: 'Bahrain' },
  { code: '+234', country: 'Nigeria' },
  { code: '+92', country: 'Pakistan' },
  { code: '+880', country: 'Bangladesh' },
  { code: '+61', country: 'Australia' },
  { code: '+65', country: 'Singapore' },
  { code: '+60', country: 'Malaysia' },
  { code: '+27', country: 'South Africa' },
  { code: '+20', country: 'Egypt' },
  { code: '+962', country: 'Jordan' },
  { code: '+49', country: 'Germany' },
  { code: '+33', country: 'France' },
  { code: '+353', country: 'Ireland' },
  { code: '+82', country: 'South Korea' },
  { code: '+81', country: 'Japan' },
  { code: '+34', country: 'Spain' },
  { code: '+39', country: 'Italy' },
  { code: '+31', country: 'Netherlands' },
  { code: '+41', country: 'Switzerland' },
  { code: '+46', country: 'Sweden' },
  { code: '+47', country: 'Norway' },
  { code: '+45', country: 'Denmark' },
  { code: '+358', country: 'Finland' },
  { code: '+64', country: 'New Zealand' },
  { code: '+351', country: 'Portugal' },
  { code: '+30', country: 'Greece' },
  { code: '+32', country: 'Belgium' },
  { code: '+43', country: 'Austria' },
  { code: '+48', country: 'Poland' },
  { code: '+420', country: 'Czech Republic' },
  { code: '+36', country: 'Hungary' },
  { code: '+40', country: 'Romania' },
  { code: '+380', country: 'Ukraine' },
  { code: '+352', country: 'Luxembourg' },
  { code: '+423', country: 'Liechtenstein' },
  { code: '+376', country: 'Andorra' },
  { code: '+377', country: 'Monaco' },
  { code: '+356', country: 'Malta' },
  { code: '+357', country: 'Cyprus' },
  { code: '+354', country: 'Iceland' },
  { code: '+355', country: 'Albania' },
  { code: '+389', country: 'North Macedonia' },
  { code: '+382', country: 'Montenegro' },
  { code: '+381', country: 'Serbia' },
  { code: '+385', country: 'Croatia' },
  { code: '+386', country: 'Slovenia' },
  { code: '+387', country: 'Bosnia and Herzegovina' },
  { code: '+370', country: 'Lithuania' },
  { code: '+371', country: 'Latvia' },
  { code: '+372', country: 'Estonia' },
  { code: '+7', country: 'Russia' },
  { code: '+375', country: 'Belarus' },
  { code: '+373', country: 'Moldova' },
  { code: '+995', country: 'Georgia' },
  { code: '+374', country: 'Armenia' },
  { code: '+994', country: 'Azerbaijan' },
  { code: '+90', country: 'Turkey' },
  { code: '+972', country: 'Israel' },
  { code: '+961', country: 'Lebanon' },
  { code: '+963', country: 'Syria' },
  { code: '+964', country: 'Iraq' },
  { code: '+967', country: 'Yemen' },
  { code: '+98', country: 'Iran' },
  { code: '+93', country: 'Afghanistan' },
  { code: '+7', country: 'Kazakhstan' },
  { code: '+998', country: 'Uzbekistan' },
  { code: '+992', country: 'Tajikistan' },
  { code: '+993', country: 'Turkmenistan' },
  { code: '+996', country: 'Kyrgyzstan' },
  { code: '+976', country: 'Mongolia' },
  { code: '+86', country: 'China' },
  { code: '+886', country: 'Taiwan' },
  { code: '+852', country: 'Hong Kong' },
  { code: '+853', country: 'Macau' },
  { code: '+84', country: 'Vietnam' },
  { code: '+66', country: 'Thailand' },
  { code: '+63', country: 'Philippines' },
  { code: '+62', country: 'Indonesia' },
  { code: '+855', country: 'Cambodia' },
  { code: '+856', country: 'Laos' },
  { code: '+95', country: 'Myanmar' },
  { code: '+673', country: 'Brunei' },
  { code: '+670', country: 'East Timor' },
  { code: '+94', country: 'Sri Lanka' },
  { code: '+960', country: 'Maldives' },
  { code: '+977', country: 'Nepal' },
  { code: '+975', country: 'Bhutan' },
  { code: '+212', country: 'Morocco' },
  { code: '+213', country: 'Algeria' },
  { code: '+216', country: 'Tunisia' },
  { code: '+218', country: 'Libya' },
  { code: '+249', country: 'Sudan' },
  { code: '+251', country: 'Ethiopia' },
  { code: '+254', country: 'Kenya' },
  { code: '+255', country: 'Tanzania' },
  { code: '+256', country: 'Uganda' },
  { code: '+250', country: 'Rwanda' },
  { code: '+257', country: 'Burundi' },
  { code: '+252', country: 'Somalia' },
  { code: '+253', country: 'Djibouti' },
  { code: '+231', country: 'Liberia' },
  { code: '+232', country: 'Sierra Leone' },
  { code: '+233', country: 'Ghana' },
  { code: '+225', country: 'Ivory Coast' },
  { code: '+221', country: 'Senegal' },
  { code: '+220', country: 'Gambia' },
  { code: '+224', country: 'Guinea' },
  { code: '+245', country: 'Guinea-Bissau' },
  { code: '+223', country: 'Mali' },
  { code: '+226', country: 'Burkina Faso' },
  { code: '+227', country: 'Niger' },
  { code: '+235', country: 'Chad' },
  { code: '+236', country: 'Central African Republic' },
  { code: '+237', country: 'Cameroon' },
  { code: '+241', country: 'Gabon' },
  { code: '+242', country: 'Congo' },
  { code: '+243', country: 'DR Congo' },
  { code: '+240', country: 'Equatorial Guinea' },
  { code: '+239', country: 'Sao Tome and Principe' },
  { code: '+244', country: 'Angola' },
  { code: '+260', country: 'Zambia' },
  { code: '+263', country: 'Zimbabwe' },
  { code: '+264', country: 'Namibia' },
  { code: '+267', country: 'Botswana' },
  { code: '+266', country: 'Lesotho' },
  { code: '+268', country: 'Eswatini' },
  { code: '+265', country: 'Malawi' },
  { code: '+2Mozambique', country: '258' },
  { code: '+261', country: 'Madagascar' },
  { code: '+230', country: 'Mauritius' },
  { code: '+248', country: 'Seychelles' },
  { code: '+269', country: 'Comoros' },
  { code: '+238', country: 'Cape Verde' },
  { code: '+222', country: 'Mauritania' },
  { code: '+211', country: 'South Sudan' },
  { code: '+52', country: 'Mexico' },
  { code: '+502', country: 'Guatemala' },
  { code: '+503', country: 'El Salvador' },
  { code: '+504', country: 'Honduras' },
  { code: '+505', country: 'Nicaragua' },
  { code: '+506', country: 'Costa Rica' },
  { code: '+507', country: 'Panama' },
  { code: '+53', country: 'Cuba' },
  { code: '+509', country: 'Haiti' },
  { code: '+1', country: 'Dominican Republic' },
  { code: '+1', country: 'Jamaica' },
  { code: '+1', country: 'Trinidad and Tobago' },
  { code: '+1', country: 'Bahamas' },
  { code: '+1', country: 'Barbados' },
  { code: '+1', country: 'Saint Lucia' },
  { code: '+1', country: 'Saint Vincent and the Grenadines' },
  { code: '+1', country: 'Grenada' },
  { code: '+1', country: 'Antigua and Barbuda' },
  { code: '+1', country: 'Saint Kitts and Nevis' },
  { code: '+501', country: 'Belize' },
  { code: '+592', country: 'Guyana' },
  { code: '+597', country: 'Suriname' },
  { code: '+58', country: 'Venezuela' },
  { code: '+57', country: 'Colombia' },
  { code: '+593', country: 'Ecuador' },
  { code: '+51', country: 'Peru' },
  { code: '+591', country: 'Bolivia' },
  { code: '+55', country: 'Brazil' },
  { code: '+595', country: 'Paraguay' },
  { code: '+598', country: 'Uruguay' },
  { code: '+56', country: 'Chile' },
  { code: '+54', country: 'Argentina' },
  { code: '+679', country: 'Fiji' },
  { code: '+6Papua New Guinea', country: '675' },
  { code: '+6 Solomon Islands', country: '677' },
  { code: '+6 Vanuatu', country: '678' },
  { code: '+6 Samoa', country: '685' },
  { code: '+6 Tonga', country: '676' },
  { code: '+6 Kiribati', country: '686' },
  { code: '+6 Tuvalu', country: '688' },
  { code: '+6 Nauru', country: '674' },
  { code: '+6 Marshall Islands', country: '692' },
  { code: '+6 Palau', country: '680' },
  { code: '+6 Micronesia', country: '691' },
].sort((a, b) => a.country.localeCompare(b.country));

const ServiceIntakeForm: FC<IntakeFormProps> = ({ bookingId, serviceTitle, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTimezoneList, setShowTimezoneList] = useState(false);
  const timezoneRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phonePrefix: '+44',
    phone: '',
    whatsappPrefix: '+44',
    whatsapp: '',
    city: '',
    country: '',
    preferredDate: '',
    preferredTime: '',
    preferredTimeline: '', // City-wise timeline (e.g. "Kolkata 10 AM GMT+5:30")
    timezone: '',
    additionalDetails: ''
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timezoneRef.current && !timezoneRef.current.contains(event.target as Node)) {
        setShowTimezoneList(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredTimezones = timezones.filter(tz => 
    tz.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tz.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      nextStep();
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/services/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          bookingId, 
          formData: {
            ...formData,
            phone: `${formData.phonePrefix} ${formData.phone}`,
            whatsapp: `${formData.whatsappPrefix} ${formData.whatsapp}`
          } 
        }),
      });
      if (res.ok) {
        setStep(3); // Success step
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phone) {
        alert("Please fill in your name, email, and contact number before continuing.");
        return;
      }
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => setStep(prev => prev - 1);

  if (step === 3) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[40px] p-10 text-center shadow-2xl relative overflow-hidden"
      >
        <div className="relative mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto relative z-10"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.5 }}
            className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl"
          />
        </div>

        <h3 className="text-3xl font-black text-[#061F33] mb-4">You're All Set!</h3>
        <p className="text-gray-600 text-base leading-relaxed max-w-sm mx-auto mb-10 font-medium">
          Your details for <strong>{serviceTitle}</strong> have been received. 
          Expect a WhatsApp/Email from your instructor within 24 hours.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/dashboard" className="w-full">
            <Button className="w-full py-4 text-base shadow-xl shadow-primary/20">
              Go to My Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <button 
            onClick={onSuccess}
            className="w-full py-4 rounded-xl border-2 border-gray-100 text-gray-500 font-bold hover:bg-gray-50 transition-all text-sm"
          >
            Close Details
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-50">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <Clock className="w-4 h-4" /> Response time: &lt; 24 Hours
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Stepper */}
      <div className="flex items-center justify-between mb-12 relative px-4 max-w-sm mx-auto">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -translate-y-1/2 z-0" />
        {[1, 2].map((s) => (
          <div key={s} className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
              step >= s ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-white text-gray-400 border-2 border-gray-100'
            }`}>
              {step > s ? <CheckCircle className="w-6 h-6" /> : s}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${step >= s ? 'text-primary' : 'text-gray-400'}`}>
              {s === 1 ? 'Contact' : 'Schedule'}
            </span>
          </div>
        ))}
      </div>

      <motion.div 
        layout
        className="bg-white/70 backdrop-blur-xl rounded-[30px] sm:rounded-[40px] p-6 sm:p-12 shadow-2xl border border-white/20"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-secondary">Contact Information</h4>
                  <p className="text-xs text-gray-500">How should our instructors reach out to you?</p>
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <input
                      required
                      type="text"
                      placeholder="Full Name"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-semibold"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <input
                      required
                      type="email"
                      placeholder="Email Address"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-semibold"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Phone Number</label>
                       <div className="flex border border-gray-100 rounded-2xl bg-gray-50/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all overflow-hidden">
                        <select 
                          className="px-3 py-4 bg-transparent border-r border-gray-100 outline-none font-bold text-[10px] appearance-none min-w-[90px] cursor-pointer"
                          value={formData.phonePrefix}
                          onChange={(e) => setFormData({ ...formData, phonePrefix: e.target.value })}
                        >
                          {countryCodes.map(c => (
                            <option key={`${c.country}-${c.code}`} value={c.code}>{c.code} ({c.country})</option>
                          ))}
                        </select>
                        <input
                          required
                          type="tel"
                          placeholder="Number"
                          className="flex-1 px-4 py-4 bg-transparent outline-none font-semibold text-sm min-w-0"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">WhatsApp (Optional)</label>
                       <div className="flex border border-gray-100 rounded-2xl bg-gray-50/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all overflow-hidden">
                        <select 
                          className="px-3 py-4 bg-transparent border-r border-gray-100 outline-none font-bold text-[10px] appearance-none min-w-[90px] cursor-pointer"
                          value={formData.whatsappPrefix}
                          onChange={(e) => setFormData({ ...formData, whatsappPrefix: e.target.value })}
                        >
                          {countryCodes.map(c => (
                            <option key={`${c.country}-${c.code}-wa`} value={c.code}>{c.code} ({c.country})</option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          placeholder="WhatsApp Number"
                          className="flex-1 px-4 py-4 bg-transparent outline-none font-semibold text-sm min-w-0"
                          value={formData.whatsapp}
                          onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-secondary">Location & Availability</h4>
                  <p className="text-xs text-gray-500">Assigning the right regional expert for your schedule.</p>
                </div>

                <div className="space-y-6">
                  {/* Location Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                      <input
                        required
                        type="text"
                        placeholder="City"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-semibold text-sm"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                      <input
                        required
                        type="text"
                        placeholder="Country"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-semibold text-sm"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Timezone */}
                  <div className="relative" ref={timezoneRef}>
                    <div 
                      onClick={() => setShowTimezoneList(!showTimezoneList)}
                      className="w-full pl-12 pr-10 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-semibold cursor-pointer flex items-center justify-between"
                    >
                      <Globe className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${formData.timezone ? 'text-primary' : 'text-gray-400'}`} />
                      <span className={`text-sm ${formData.timezone ? 'text-secondary' : 'text-gray-400'}`}>
                        {formData.timezone || 'Select Your Timezone *'}
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-all ${showTimezoneList ? 'rotate-180 text-primary' : 'text-gray-400'}`} />
                    </div>
                    <AnimatePresence>
                      {showTimezoneList && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-60 overflow-y-auto"
                        >
                          <div className="sticky top-0 bg-white p-3 border-b border-gray-50">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                              <input 
                                type="text"
                                placeholder="Search timezone..."
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-xl text-xs outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                              />
                            </div>
                          </div>
                          {filteredTimezones.map((tz) => (
                            <div 
                              key={tz.label}
                              onClick={() => {
                                setFormData({ ...formData, timezone: tz.label });
                                setShowTimezoneList(false);
                              }}
                              className="px-4 py-3 hover:bg-primary/5 cursor-pointer flex items-center justify-between group"
                            >
                              <span className="text-xs font-semibold text-gray-600 group-hover:text-primary">{tz.label}</span>
                              <span className="text-[10px] font-bold text-gray-300">{tz.offset}</span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Date & Time Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Preferred Date</label>
                       <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                        <input
                          required
                          type="date"
                          className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-semibold text-sm"
                          value={formData.preferredDate}
                          onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Preferred Time</label>
                       <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                        <input
                          required
                          type="time"
                          className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-semibold text-sm"
                          value={formData.preferredTime}
                          onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* City-wise timeline */}
                  <div className="relative">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2 block mb-2">Detailed Availability</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-5 w-4 h-4 text-primary" />
                      <textarea
                        required
                        placeholder="e.g. Kolkata 10 AM GMT+5:30"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-semibold resize-none h-24 text-sm"
                        value={formData.preferredTimeline}
                        onChange={(e) => setFormData({ ...formData, preferredTimeline: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="relative">
                    <textarea
                      placeholder="Additional details (Optional)"
                      className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-semibold resize-none h-24 text-sm"
                      value={formData.additionalDetails}
                      onChange={(e) => setFormData({ ...formData, additionalDetails: e.target.value })}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-4 pt-4">
            {step > 1 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={prevStep}
                className="flex-1"
              >
                Back
              </Button>
            )}
            {step < 2 ? (
              <Button 
                type="button" 
                onClick={nextStep}
                className="flex-[2] shadow-xl shadow-primary/20"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                isLoading={loading}
                className="flex-[2] shadow-xl shadow-primary/20"
              >
                Schedule Session
                <Send className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ServiceIntakeForm;
