import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/common/Container';
import SectionHeading from '../components/common/SectionHeading';
import { CLINIC_INFO } from '../data/siteData';
import {
  Sparkles,
  Calendar,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Microscope,
  Building2,
  Wind,
  Cpu,
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function TechnologyPage() {
  const equipment = [
    {
      name: 'High-Speed Micro-Vitrectomy System',
      category: 'Surgical Vitreo-Retina',
      spec: 'Alcon Constellation / Equivalent 25G/27G Platform',
      desc: 'High-speed cut rates with dual-pneumatic probe technology, integrated endo-illumination, and intraocular pressure control for safe retinal detachment repair.'
    },
    {
      name: 'Surgical Operating Microscope',
      category: 'Surgical Visualization',
      spec: 'Carl Zeiss Lumera / Ophthalmic Optics with BIOM System',
      desc: 'Brilliant red-reflex stereoscopic visualization and wide-angle non-contact vitrectomy viewing for delicate sub-retinal and macular surgery.'
    },
    {
      name: 'Spectral-Domain Optical Coherence Tomography (SD-OCT)',
      category: 'Diagnostic Retina & Macula',
      spec: 'High-Resolution Axial Micron Precision',
      desc: 'Micro-structural cross-sectional scans of the neurosensory retina, foveal layers, and choroid to detect sub-retinal fluid and macular traction.'
    },
    {
      name: 'Green 532nm Pattern Scanning Retinal Laser',
      category: 'Therapeutic Retinal Laser',
      spec: 'Frequency-Doubled Nd:YAG Laser (532nm)',
      desc: 'Targeted retinal photocoagulation for proliferative diabetic retinopathy, retinal vascular occlusions, and peripheral retinal tears without collateral burns.'
    },
    {
      name: 'Class 100 HEPA Clean Air Modular OT',
      category: 'Sterility & Infection Control',
      spec: 'Positive Pressure Laminar Airflow (ISO 5 / Class 100)',
      desc: 'Engineered air filtration with 0.3-micron particulate capture, surgical scrub zones, and dedicated autoclave sterility to eliminate endophthalmitis risks.'
    },
    {
      name: 'Optical Biometry & Ultrasonic A/B-Scan',
      category: 'Cataract & Structural Diagnostics',
      spec: 'Swept-Source Optical Biometry & 10MHz Ultrasound',
      desc: 'Sub-millimeter axial length calculations for customized toric, multifocal, and monofocal IOL power selection with zero post-refractive surprises.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="relative py-16 lg:py-24 bg-[#061226] text-white border-b border-slate-800">
        <Container>
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
            <Link to="/" className="hover:text-[#DFBF64] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#DFBF64]">Technology & Facility</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-[#C59B27]/20 text-[#DFBF64] border border-[#C59B27]/40">
              <Microscope className="w-3.5 h-3.5" />
              <span>International Medical Infrastructure</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              State-of-the-Art Surgical & Diagnostic Infrastructure
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Sub-millimeter retinal microsurgery demands uncompromising optics, clean-air sterilization, and advanced fluidics. Discover the technology underpinning Nirvaya Eyecare Centre.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to="/pre-book"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#C59B27] hover:bg-[#B38A1F] text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Pre-book an Evaluation</span>
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white text-white hover:text-[#0A1E3F] font-semibold text-sm border border-white/20 transition-all cursor-pointer"
              >
                <span>Visit Our Centre</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Equipment Grid */}
      <section className="py-20 lg:py-24 bg-slate-50 border-b border-slate-200">
        <Container>
          <SectionHeading
            align="left"
            eyebrow="Precision Instrumentation"
            title="Surgical Platforms & Ophthalmic Diagnostics"
            description="Our centre is purpose-built to execute micro-incision vitrectomy and premium cataract procedures with zero compromise."
            className="mb-12 max-w-3xl"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {equipment.map((eq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 hover:border-[#DFBF64]/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between reveal-up"
              >
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100 inline-block mb-3">
                    {eq.category}
                  </span>
                  <h3 className="font-heading text-lg font-bold text-[#0A1E3F] mb-1.5">
                    {eq.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#8C6D1F] mb-3">
                    {eq.spec}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {eq.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Sterility & Class 100 HEPA Cleanroom Section */}
      <section className="py-20 lg:py-24 bg-white border-b border-slate-200">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C59B27] bg-[#FDF9EE] px-3 py-1 rounded-full border border-[#C59B27]/30">
                Infection Control Protocols
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0A1E3F]">
                Zero-Tolerance Sterility & Cleanroom Airflow
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Post-operative endophthalmitis is the most critical risk in intraocular surgery. At Nirvaya, our modular operating theatre is built to Class 100 HEPA air filtration standards, maintaining constant positive pressure air exchange and micro-particulate elimination.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'ISO 5 / Class 100 HEPA laminar airflow directly over surgical field',
                  'Dedicated multi-stage autoclave sterilization protocols',
                  'Single-use sterile surgical consumables and micro-vitrectomy cutters',
                  'Regular microbial air sampling and strict OT entry isolation'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#0A1E3F] text-white rounded-2xl p-8 border border-slate-700 shadow-xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#DFBF64]/15 text-[#DFBF64] flex items-center justify-center">
                <Wind className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white">
                Class 100 HEPA Cleanroom
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Engineered to maintain less than 100 particles of size 0.5 micron per cubic foot of air, matching international ophthalmic surgical cleanroom benchmarks.
              </p>
              <div className="pt-2 border-t border-slate-700 text-xs text-[#DFBF64] font-semibold">
                Designed for safe same-day vitrectomy & cataract discharge.
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
