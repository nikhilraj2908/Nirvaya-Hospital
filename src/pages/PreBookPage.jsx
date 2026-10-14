import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Container from '../components/common/Container';
import { CLINIC_INFO, SPECIALTIES } from '../data/siteData';
import { getAvailableSlots, bookAppointment, trackEvent } from '../services/api';
import {
  Calendar,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Phone,
  ArrowRight,
  User,
  MapPin,
  Sparkles,
  MessageSquare,
  AlertCircle,
  Building2,
  Award,
  ChevronRight,
  Loader2
} from 'lucide-react';

export default function PreBookPage({ currentLang = 'en' }) {
  const [searchParams] = useSearchParams();
  const querySpecialty = searchParams.get('specialty');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    age: '',
    city: 'Bhopal',
    specialty: querySpecialty || 'Retina & Vitreoretinal Surgery',
    visitType: 'First Clinical Consultation',
    preferredDate: minDate,
    preferredSlot: 'Morning (10:00 AM – 1:30 PM)',
    symptoms: '',
    consent: true
  });

  const [slotData, setSlotData] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  // Log booking intent in CRP funnel
  useEffect(() => {
    trackEvent('booking_intent', {
      source: 'pre_book_page',
      specialty: formData.specialty
    });
  }, []);

  useEffect(() => {
    if (querySpecialty) {
      setFormData(prev => ({ ...prev, specialty: querySpecialty }));
    }
  }, [querySpecialty]);

  // Fetch live slot availability when date changes
  useEffect(() => {
    if (!formData.preferredDate) return;
    let isMounted = true;
    setLoadingSlots(true);

    getAvailableSlots(formData.preferredDate)
      .then((res) => {
        if (isMounted && res) {
          setSlotData(res);
        }
      })
      .catch((err) => {
        console.warn('Slot availability fallback:', err.message);
      })
      .finally(() => {
        if (isMounted) setLoadingSlots(false);
      });

    return () => {
      isMounted = false;
    };
  }, [formData.preferredDate]);

  const specialtiesList = [
    { id: 'retina', title: 'Retina & Vitreoretinal Surgery', desc: 'Detachment, macular hole, trauma' },
    { id: 'cataract', title: 'Cataract Surgery (Phaco & Toric)', desc: 'Micro-incision blade-free phacoemulsification' },
    { id: 'diabetic', title: 'Diabetic Eye Care & Retinopathy', desc: 'Laser photocoagulation & maculopathy management' },
    { id: 'injections', title: 'Intravitreal Injections (Anti-VEGF)', desc: 'Lucentis, Accentrix, Eylea & Biosimilars' },
    { id: 'rop', title: 'Pediatric & ROP Screening', desc: 'Preterm neonatal retinal evaluations' },
    { id: 'comprehensive', title: 'Comprehensive Eye Examination', desc: 'Complete dilated anterior & posterior checkup' }
  ];

  const timeSlots = [
    { label: 'Morning OPD', time: '10:00 AM – 1:30 PM', desc: 'Ideal for detailed dilated fundus scans' },
    { label: 'Evening OPD', time: '4:30 PM – 7:30 PM', desc: 'Post-work / convenient family slots' }
  ];

  const validate = () => {
    const newErrors = {};
    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Please enter the patient’s full name';
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Please select a consultation date';
    }
    if (slotData && slotData.isBlocked) {
      newErrors.preferredDate = `The clinic is closed on this date (${slotData.blockedReason || 'Scheduled Holiday'}). Please select another day.`;
    }
    if (!formData.consent) {
      newErrors.consent = 'Please confirm consent to reserve your appointment';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setErrors((prev) => ({ ...prev, submit: null }));

    try {
      const res = await bookAppointment({
        patientName: formData.patientName.trim(),
        phone: formData.phone.trim(),
        age: formData.age ? Number(formData.age) : undefined,
        city: formData.city.trim(),
        specialty: formData.specialty,
        visitType: formData.visitType,
        preferredDate: formData.preferredDate,
        preferredSlot: formData.preferredSlot,
        symptoms: formData.symptoms.trim()
      });

      const refNo =
        res.appointment?.referenceNumber ||
        res.referenceNumber ||
        ('NIRV-' + Math.floor(100000 + Math.random() * 900000));

      setBookingRef(refNo);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Track successful appointment creation in CRP engine
      trackEvent('appointment_booked', {
        referenceNumber: refNo,
        specialty: formData.specialty,
        preferredDate: formData.preferredDate
      });
    } catch (err) {
      console.error('Booking failed:', err);
      setErrors((prev) => ({
        ...prev,
        submit: err.message || 'Unable to submit booking to server. Please try again or call our clinic.'
      }));
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Nirvaya Eyecare Centre,\nI have reserved an appointment slot:\n\n` +
    `Ref Code: ${bookingRef}\n` +
    `Patient Name: ${formData.patientName}\n` +
    `Phone: ${formData.phone}\n` +
    `Specialty: ${formData.specialty}\n` +
    `Date: ${formData.preferredDate}\n` +
    `Slot: ${formData.preferredSlot}\n` +
    `City: ${formData.city}\n\n` +
    `Please confirm my slot time. Thank you!`
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 lg:py-20">
      <Container>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
          <Link to="/" className="hover:text-[#0A1E3F] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#C59B27] font-semibold">Pre-book Consultation Slot</span>
        </nav>

        {/* Page Heading */}
        <div className="mb-10 lg:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-[#FDF9EE] text-[#C59B27] border border-[#C59B27]/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dedicated Consultation Portal</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A1E3F] tracking-tight">
            Reserve Your Appointment Slot
          </h1>
          <p className="mt-2 text-base text-slate-600 max-w-3xl leading-relaxed">
            Personalised, unhurried vitreo-retinal evaluations and cataract consultations under senior AIIMS specialist <strong className="text-[#0A1E3F]">Dr Sandhya Gaur</strong>.
          </p>
        </div>

        {/* Confirmation State */}
        {isSubmitted ? (
          <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 sm:p-12 shadow-xl border border-slate-200/80 animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                Slot Reservation Received
              </div>

              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0A1E3F]">
                Thank You, {formData.patientName}!
              </h2>

              <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Your consultation request has been logged. Our clinical coordinator will call you to confirm your exact reporting time and dilated scan preparation.
              </p>

              {/* Summary Box */}
              <div className="bg-[#F8FAFC] rounded-xl p-6 border border-slate-200 text-left space-y-3.5 text-xs sm:text-sm my-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-[#0A1E3F] font-bold">
                  <span>Booking Reference:</span>
                  <span className="font-mono text-[#C59B27] text-base">{bookingRef}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[11px] uppercase font-bold">Specialty:</span>
                    <strong className="text-[#0A1E3F]">{formData.specialty}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] uppercase font-bold">Consulting Surgeon:</span>
                    <strong className="text-[#0A1E3F]">Dr Sandhya Gaur (MD AIIMS)</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] uppercase font-bold">Preferred Date:</span>
                    <strong>{formData.preferredDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] uppercase font-bold">Preferred Slot:</span>
                    <strong>{formData.preferredSlot}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] uppercase font-bold">Patient Contact:</span>
                    <strong>+91 {formData.phone}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] uppercase font-bold">Clinic Location:</span>
                    <strong>Ayodhya Bypass Road, Bhopal</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <a
                  href={`https://wa.me/${CLINIC_INFO.whatsappRaw}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Confirmation on WhatsApp</span>
                </a>

                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#0A1E3F] hover:bg-[#16325C] text-white font-semibold text-sm transition-all"
                >
                  <span>Return to Homepage</span>
                </Link>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
                <Phone className="w-3.5 h-3.5 text-[#C59B27]" />
                <span>Need urgent assistance? Call our desk directly at </span>
                <a href={`tel:${CLINIC_INFO.phoneRaw}`} className="font-bold text-[#0A1E3F] hover:underline">
                  {CLINIC_INFO.phone}
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* Main 2-Column Booking Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Form Column (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200">
              <form onSubmit={handleSubmit} noValidate className="space-y-8">
                {/* Section 1: Choose Specialty */}
                <div>
                  <label className="block text-sm font-bold text-[#0A1E3F] mb-1">
                    1. Select Eye Specialty / Clinical Service <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-slate-500 mb-3.5">
                    Choose the primary reason for your visit so we can prepare necessary diagnostic setups.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {specialtiesList.map((spec) => (
                      <label
                        key={spec.id}
                        className={`flex flex-col p-3.5 rounded-xl border cursor-pointer transition-all ${
                          formData.specialty === spec.title
                            ? 'bg-[#FDF9EE] border-[#C59B27] ring-1 ring-[#C59B27]'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-bold ${
                            formData.specialty === spec.title ? 'text-[#8C6D1F]' : 'text-[#0A1E3F]'
                          }`}>
                            {spec.title}
                          </span>
                          <input
                            type="radio"
                            name="specialty"
                            value={spec.title}
                            checked={formData.specialty === spec.title}
                            onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                            className="text-[#C59B27] focus:ring-[#C59B27]"
                          />
                        </div>
                        <span className="text-[11px] text-slate-500 leading-tight">
                          {spec.desc}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Section 2: Visit Type */}
                <div>
                  <label className="block text-sm font-bold text-[#0A1E3F] mb-1">
                    2. Nature of Consultation
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      'First Clinical Consultation',
                      'Second Opinion on Retina Scan',
                      'Pre-Surgery Evaluation'
                    ].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, visitType: type })}
                        className={`p-3 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                          formData.visitType === type
                            ? 'bg-[#0A1E3F] text-white border-[#0A1E3F] shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 3: Date & Preferred OPD Time Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="preferredDate" className="block text-xs font-bold text-[#0A1E3F] mb-1.5">
                      3. Preferred Consultation Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="preferredDate"
                        min={minDate}
                        value={formData.preferredDate}
                        onChange={(e) => {
                          setFormData({ ...formData, preferredDate: e.target.value });
                          if (errors.preferredDate) setErrors({ ...errors, preferredDate: '' });
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-[#0A1E3F] focus:outline-none focus:ring-2 focus:ring-[#C59B27] ${
                          errors.preferredDate ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                        }`}
                      />
                    </div>
                    {errors.preferredDate && (
                      <p className="text-[11px] text-red-500 mt-1">{errors.preferredDate}</p>
                    )}
                    <span className="text-[11px] text-slate-400 mt-1 block">OPD: Mon–Sat (Closed Sundays)</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0A1E3F] mb-1.5">
                      Preferred OPD Timing Slot <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {timeSlots.map((slot) => (
                        <label
                          key={slot.label}
                          className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                            formData.preferredSlot.startsWith(slot.label)
                              ? 'bg-[#FDF9EE] border-[#C59B27]'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <strong className="text-[#0A1E3F]">{slot.label}</strong>
                            <span className="text-slate-500 ml-1.5">({slot.time})</span>
                          </div>
                          <input
                            type="radio"
                            name="preferredSlot"
                            value={`${slot.label} (${slot.time})`}
                            checked={formData.preferredSlot.startsWith(slot.label)}
                            onChange={(e) => setFormData({ ...formData, preferredSlot: e.target.value })}
                            className="text-[#C59B27] focus:ring-[#C59B27]"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section 4: Patient Details */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <h3 className="text-sm font-bold text-[#0A1E3F]">
                    4. Patient Contact & Medical Background
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="patientName" className="block text-xs font-semibold text-slate-700 mb-1">
                        Patient Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="patientName"
                        placeholder="e.g. Ramesh Chandra Sharma"
                        value={formData.patientName}
                        onChange={(e) => {
                          setFormData({ ...formData, patientName: e.target.value });
                          if (errors.patientName) setErrors({ ...errors, patientName: '' });
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-[#0A1E3F] focus:outline-none focus:ring-2 focus:ring-[#C59B27] ${
                          errors.patientName ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                        }`}
                      />
                      {errors.patientName && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.patientName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 mb-1">
                        Mobile Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-2.5 text-xs text-slate-400 font-semibold select-none">+91</span>
                        <input
                          type="tel"
                          id="phone"
                          maxLength={10}
                          placeholder="9876543210"
                          value={formData.phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setFormData({ ...formData, phone: val });
                            if (errors.phone) setErrors({ ...errors, phone: '' });
                          }}
                          className={`w-full pl-12 pr-3.5 py-2.5 rounded-lg border text-sm text-[#0A1E3F] focus:outline-none focus:ring-2 focus:ring-[#C59B27] ${
                            errors.phone ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                          }`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="age" className="block text-xs font-semibold text-slate-700 mb-1">
                        Patient Age (Optional)
                      </label>
                      <input
                        type="number"
                        id="age"
                        placeholder="e.g. 58"
                        min={1}
                        max={110}
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-[#0A1E3F] focus:outline-none focus:ring-2 focus:ring-[#C59B27]"
                      />
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-xs font-semibold text-slate-700 mb-1">
                        City / Locality
                      </label>
                      <input
                        type="text"
                        id="city"
                        placeholder="Bhopal / Sehore / Vidisha / Hoshangabad"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-[#0A1E3F] focus:outline-none focus:ring-2 focus:ring-[#C59B27]"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="symptoms" className="block text-xs font-semibold text-slate-700 mb-1">
                      Brief Symptoms / Medical History (Optional)
                    </label>
                    <textarea
                      id="symptoms"
                      rows={2}
                      placeholder="e.g. Sudden blurriness in right eye, floaters, diabetic for 8 years, advised vitrectomy..."
                      value={formData.symptoms}
                      onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-[#0A1E3F] focus:outline-none focus:ring-2 focus:ring-[#C59B27]"
                    />
                  </div>

                  {/* Consent checkbox */}
                  <div>
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.consent}
                        onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                        className="mt-0.5 rounded text-[#C59B27] focus:ring-[#C59B27]"
                      />
                      <span className="text-xs text-slate-600 leading-snug">
                        I authorize Nirvaya Eyecare Centre to contact me via phone / WhatsApp regarding this consultation and pre-visit dilated eye check guidelines.
                      </span>
                    </label>
                    {errors.consent && (
                      <p className="text-[11px] text-red-500 mt-1">{errors.consent}</p>
                    )}
                  </div>
                </div>

                {/* Submit error alert */}
                {errors.submit && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{errors.submit}</span>
                  </div>
                )}

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 px-6 rounded-xl bg-[#0A1E3F] hover:bg-[#16325C] disabled:bg-slate-400 text-white font-bold text-base shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 text-[#DFBF64] animate-spin" />
                        <span>Reserving Slot in System...</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-5 h-5 text-[#DFBF64]" />
                        <span>Confirm & Reserve Consultation Slot</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] text-slate-500 mt-2.5">
                    No advance payment required. Slot confirmation is free of charge.
                  </p>
                </div>
              </form>
            </div>

            {/* Right Sidebar: Clinic Credential & Pre-Visit Checklist (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Specialist Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-[#C59B27] uppercase tracking-wider mb-3">
                  <Award className="w-4 h-4" />
                  <span>Consulting Specialist</span>
                </div>

                <h3 className="font-heading text-xl font-bold text-[#0A1E3F]">
                  Dr Sandhya Gaur
                </h3>
                <p className="text-xs text-slate-600 font-semibold mt-0.5">
                  MD (Ophthalmology, AIIMS New Delhi) • DNB • FVRS
                </p>
                <p className="text-xs text-[#8C6D1F] font-medium">
                  FAICO (Retina Gold Medalist) • 18+ Peer-Reviewed Papers
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Clinical Approach:</span>
                    <strong className="text-[#0A1E3F]">Unhurried 1-on-1 Care</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Surgeries:</span>
                    <strong className="text-[#0A1E3F]">Vitrectomy & Micro-Phaco</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Facility OT:</span>
                    <strong className="text-emerald-700">Class 100 Clean Air HEPA</strong>
                  </div>
                </div>
              </div>

              {/* Pre-Visit Dilated Scan Guidelines */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50/40 rounded-2xl p-6 border border-amber-200/80">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wide mb-3">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  <span>Important Pre-Visit Information</span>
                </div>

                <ul className="space-y-2.5 text-xs text-amber-900/90 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                    <span><strong>Dilated Retina Exam:</strong> Eye drops will temporarily blur near vision for 3–4 hours. If possible, have an attendant drive you.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                    <span><strong>Old Prescriptions:</strong> Please carry previous glasses, diabetes test reports, and past eye surgery documents.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                    <span><strong>No Fasting Needed:</strong> Routine eye evaluations and OCT scans do not require fasting.</span>
                  </li>
                </ul>
              </div>

              {/* Clinic Timings & Location Box */}
              <div className="bg-[#0A1E3F] text-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-700 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#DFBF64]">
                  <Building2 className="w-4 h-4" />
                  <span>Location & Contact</span>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#DFBF64] shrink-0 mt-0.5" />
                    <span>{CLINIC_INFO.fullAddress}</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-[#DFBF64] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Monday – Saturday:</strong>
                      <span>9:30 AM – 7:30 PM</span>
                      <span className="block text-slate-400 mt-0.5">(Sunday: Prior Emergency Only)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 pt-2 border-t border-slate-700">
                    <Phone className="w-4 h-4 text-[#DFBF64] shrink-0" />
                    <a href={`tel:${CLINIC_INFO.phoneRaw}`} className="text-white hover:text-[#DFBF64] font-semibold transition-colors">
                      {CLINIC_INFO.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
