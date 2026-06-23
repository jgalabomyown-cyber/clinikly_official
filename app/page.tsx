"use client";

import React, { useEffect, useState } from "react";
import {
  Activity,
  ArrowRight,
  Award,
  Database,
  FileCheck,
  LockKeyhole,
  Menu,
  Shield,
  ShieldCheck,
  Stethoscope,
  Upload,
  X,
} from "lucide-react";

  const Link = ({ href, children, className, onClick }: any) => {
    return (
      <a 
        href={href} 
        className={className}
        onClick={(e) => {
          e.preventDefault();
          if (onClick) onClick(e);
          console.log(`Navigating to: ${href}`);
          alert(`Redirecting to Next.js route: ${href}\nIn production, this triggers standard Next.js <Link> routing.`);
        }}
      >
        {children}
      </a>
    );
  };

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = () => {
      setTheme(media.matches ? "dark" : "light");
    };

    // Defer initial update to avoid the setState-in-effect lint rule.
    const t = window.setTimeout(apply, 0);
    media.addEventListener?.("change", apply);

    return () => {
      window.clearTimeout(t);
      media.removeEventListener?.("change", apply);
    };
  }, []);

  return (
    <div
      className={`w-full min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-800"
      } flex flex-col font-sans`}
    >
      <header
        className={`sticky top-0 z-50 transition-colors ${
          theme === "dark" ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-100"
        } backdrop-blur-md border-b`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div
              className="flex items-center space-x-2"
              onClick={() => {
                setMobileMenuOpen(false);
                window.location.href = "/";
              }}
              role="button"
              tabIndex={0}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-200 dark:shadow-none">
                <Activity size={22} />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                MedVault
              </span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#how-it-works"
                className={`text-sm font-medium transition-colors ${
                  theme === "dark" ? "text-slate-300 hover:text-blue-400" : "text-slate-600 hover:text-blue-600"
                }`}
              >
                How It Works
              </a>
              <a
                href="#features"
                className={`text-sm font-medium transition-colors ${
                  theme === "dark" ? "text-slate-300 hover:text-blue-400" : "text-slate-600 hover:text-blue-600"
                }`}
              >
                Features
              </a>
              <a
                href="#certifications"
                className={`text-sm font-medium transition-colors ${
                  theme === "dark" ? "text-slate-300 hover:text-blue-400" : "text-slate-600 hover:text-blue-600"
                }`}
              >
                Trust & Safety
              </a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <a
                href="/login"
                className={`text-sm font-medium transition-colors ${
                  theme === "dark" ? "text-slate-300 hover:text-blue-400" : "text-slate-700 hover:text-blue-600"
                }`}
              >
                Sign In
              </a>
              <a
                href="/register/patient"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all duration-200"
              >
                Get Started
              </a>
            </div>

            <div className="flex items-center space-x-2 md:hidden">
              <button
                onClick={() => setMobileMenuOpen((v) => !v)}
                className={`p-2 rounded-lg transition-colors ${
                  theme === "dark" ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"
                }`}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            className={`md:hidden px-4 pt-2 pb-4 space-y-2 border-b ${
              theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
            }`}
          >
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                theme === "dark" ? "text-slate-200 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              How It Works
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                theme === "dark" ? "text-slate-200 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              Features
            </a>
            <a
              href="#certifications"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                theme === "dark" ? "text-slate-200 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              Trust & Safety
            </a>

            <div
              className={`pt-4 flex flex-col space-y-2 border-t ${
                theme === "dark" ? "border-slate-800" : "border-slate-100"
              }`}
            >
              <a
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full text-center py-2.5 rounded-lg font-medium ${
                  theme === "dark" ? "text-slate-200 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                Sign In
              </a>
              <a
                href="/register/patient"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg bg-blue-600 text-white font-semibold"
              >
                Register as Patient
              </a>
              <a
                href="/register/doctor"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg bg-emerald-600 text-white font-semibold"
              >
                Join as Doctor
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div
          className={`absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none -z-10 ${
            theme === "dark" ? "bg-blue-900/20" : "bg-blue-200/40"
          }`}
        />
        <div
          className={`absolute bottom-10 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none -z-10 ${
            theme === "dark" ? "bg-emerald-900/10" : "bg-emerald-200/30"
          }`}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-6 ${
              theme === "dark" ? "bg-blue-950/60 text-blue-400" : "bg-blue-50 text-blue-700"
            }`}
          >
            <Shield size={14} />
            <span>Secure Patient-Doctor Record Network</span>
          </div>

          <h1
            className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}
          >
            Your Medical Records. <br />
            <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Verified, Organized, & Always Safe.
            </span>
          </h1>

          <p
            className={`mt-6 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed ${
              theme === "dark" ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Upload diagnostic records, laboratory results, or prescriptions. Get them quickly reviewed and approved by verified medical professionals in one secure vault.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/register/patient"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-xl hover:scale-[1.01] transition-all"
            >
              Sign Up as Patient
              <ArrowRight className="ml-2" size={18} />
            </a>
            <a
              href="/register/doctor"
              className={`w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold border rounded-2xl shadow-sm hover:scale-[1.01] transition-all ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Stethoscope className="mr-2 text-emerald-500" size={18} />
              Apply as a Doctor
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className={`py-20 border-y ${
          theme === "dark" ? "bg-slate-950/40 border-slate-800" : "bg-white border-slate-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className={`text-3xl font-bold sm:text-4xl ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
              Streamlining Clinical Verification
            </h2>
            <p className={`text-lg mt-4 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
              Here is exactly how patients, doctors, and clinic staff collaborate to secure, audit, and trust health history.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className={`rounded-2xl p-8 border transition-all duration-300 ${
                theme === "dark"
                  ? "bg-slate-900/60 border-slate-800 hover:border-blue-500/50"
                  : "bg-slate-50/50 border-slate-100 hover:bg-white hover:shadow-xl hover:border-blue-100"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg mb-6">
                <Upload size={22} />
              </div>
              <h3 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>1. Upload Securely</h3>
              <p className={`mt-3 leading-relaxed ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                Patients easily upload laboratory, vaccination, or diagnostic PDFs. Assign classifications like type, date, or specific clinics instantly.
              </p>
            </div>

            <div
              className={`rounded-2xl p-8 border transition-all duration-300 ${
                theme === "dark"
                  ? "bg-slate-900/60 border-slate-800 hover:border-emerald-500/50"
                  : "bg-slate-50/50 border-slate-100 hover:bg-white hover:shadow-xl hover:border-emerald-100"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg mb-6">
                <FileCheck size={22} />
              </div>
              <h3 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>2. Review Pipeline</h3>
              <p className={`mt-3 leading-relaxed ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                Licensed medical doctors review files, examine details, and securely verify the medical record, or request detailed updates/revisions.
              </p>
            </div>

            <div
              className={`rounded-2xl p-8 border transition-all duration-300 ${
                theme === "dark"
                  ? "bg-slate-900/60 border-slate-800 hover:border-purple-500/50"
                  : "bg-slate-50/50 border-slate-100 hover:bg-white hover:shadow-xl hover:border-purple-100"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg mb-6">
                <Database size={22} />
              </div>
              <h3 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>3. Immutable Timeline</h3>
              <p className={`mt-3 leading-relaxed ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                Once approved, the file transitions to a permanent, un-editable status with an audit trail, building a verified medical history timeline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section id="certifications" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className={`text-3xl font-bold sm:text-4xl ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Certified Security & Privacy</h2>
            <p className={`text-lg mt-4 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
              We employ strict, institutional-grade compliance structures to protect patient data at every turn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className={`p-8 rounded-2xl border ${
                theme === "dark" ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200/60"
              }`}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl">
                  <LockKeyhole size={24} />
                </div>
                <div>
                  <h4 className={`font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Data Privacy Act</h4>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">Fully Compliant</p>
                </div>
              </div>
              <p className={`text-sm leading-relaxed ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                Adhering completely to the National Data Privacy regulations. Features client-controlled cryptographic keys, robust permission management, and explicit consent tracking models.
              </p>
            </div>

            <div
              className={`p-8 rounded-2xl border ${
                theme === "dark" ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200/60"
              }`}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl">
                  <Award size={24} />
                </div>
                <div>
                  <h4 className={`font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>HIPAA Standards</h4>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">Certified Blueprint</p>
                </div>
              </div>
              <p className={`text-sm leading-relaxed ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                Constructed following the stringent guidelines of Protected Health Information (PHI) storage guidelines. Zero-knowledge authentication ensures private medical profiles remain yours.
              </p>
            </div>

            <div
              className={`p-8 rounded-2xl border ${
                theme === "dark" ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200/60"
              }`}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className={`font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>ISO 27001 InfoSec</h4>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">Audit Ready</p>
                </div>
              </div>
              <p className={`text-sm leading-relaxed ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                Utilizing modern security workflows designed to pass thorough penetration audits. Complete audit logging logs every action made on the platform transparently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`mt-auto py-12 border-t ${theme === "dark" ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-slate-50"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme === "dark" ? "bg-blue-900 text-white" : "bg-blue-600 text-white"}`}>
              <Activity size={18} />
            </div>
            <span className="font-bold">MedVault</span>
          </div>
          <p className={theme === "dark" ? "text-slate-400" : "text-slate-500"}>
            &copy; 2026 MedVault Clinical Record Systems. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

