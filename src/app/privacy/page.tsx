"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "motion/react";
import { Shield, Calendar, ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-24 min-h-screen relative overflow-hidden bg-slate-50 dark:bg-slate-950">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-mesh pointer-events-none opacity-60" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 py-12 md:py-20 z-10">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {/* Page Header */}
          <div className="border-b border-outline-variant/10 pb-8 mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                Legal Document
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Privacy Policy
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>Effective Date: 16 April 2026</span>
              <span className="w-1 h-1 rounded-full bg-slate-350 dark:bg-slate-700" />
              <span>Covers ANSH parent brand and all SaaS offerings</span>
            </div>
          </div>

          {/* Content Sections */}
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-10 text-slate-600 dark:text-slate-300 leading-relaxed">
            <p className="text-lg text-slate-500 dark:text-slate-400">
              This Privacy Policy explains how ANSH (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) collects, uses, stores, discloses, and protects personal data across the ANSH ecosystem, including parent platform services and product applications such as Ansh Booking and other current or future ANSH apps.
              This policy applies to all users, visitors, customers, and partners who access our websites, apps, and related SaaS services in India or otherwise.
            </p>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                1. Scope and Applicability
              </h2>
              <p>
                This policy covers all platforms operated under the ANSH parent ecosystem. By using our services, you consent to the data collection and usage practices described in this document. If you do not agree with this policy, please do not access or use our services.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                2. Personal Data We Collect
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Identity and contact details:</strong> Name, email address, mobile number, company/business details, and billing details.
                </li>
                <li>
                  <strong>Account and authentication data:</strong> Login credentials, profile data, account settings, and linked device/session metadata.
                </li>
                <li>
                  <strong>Usage and technical data:</strong> IP address, browser type, operating system, app activity logs, crash logs, diagnostics, cookies, and analytics events.
                </li>
                <li>
                  <strong>Customer-provided business data:</strong> Data uploaded into ANSH apps, including booking records, CRM records, attendance data, and related operational content.
                </li>
                <li>
                  <strong>Support and communications data:</strong> Messages, attachments, and feedback shared with our support team.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                3. Legal Basis and Purpose of Processing
              </h2>
              <p>
                We process personal data for lawful purposes including account creation, service delivery, subscription management, product improvement, customer support, security monitoring, legal compliance, fraud prevention, and communication of service updates.
              </p>
              <p>
                Where required by applicable law, we rely on consent. In other cases, processing may be required for the performance of a contract, legal obligations, or legitimate business purposes that are not overridden by your rights. You may withdraw consent where consent is the basis of processing, though withdrawal may impact service availability.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                4. Children
              </h2>
              <p>
                Our services are not intended for children and should be used only by persons competent to contract under applicable law. If you believe a child has shared data with us, contact us for prompt deletion review at <a href="mailto:legal@anshapps.com" className="text-indigo-650 dark:text-indigo-400 hover:underline">legal@anshapps.com</a>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                5. Cookies and Similar Technologies
              </h2>
              <p>
                We use cookies and similar technologies for authentication, session management, security, performance analytics, language preference, and feature improvement. You can control cookies through browser settings, but some features may not function properly if essential cookies are disabled.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                6. How We Share Data
              </h2>
              <p>
                We may share data with vetted service providers (for hosting, analytics, messaging, payments, and customer support), group entities, legal advisors, auditors, and government/law enforcement authorities when legally required.
              </p>
              <p>
                We do not sell personal data. Any sharing is limited to legitimate purposes and contractual safeguards.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                7. Cross-Border Transfers
              </h2>
              <p>
                Where data is processed outside India, we implement reasonable contractual, technical, and organizational safeguards to ensure an adequate level of protection under applicable law.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                8. Data Retention
              </h2>
              <p>
                We retain personal data only for as long as required for service delivery, legal compliance, dispute resolution, enforcement of agreements, and security purposes. When retention is no longer necessary, we securely delete, anonymize, or de-identify data, unless continued retention is required by law.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                9. Your Rights
              </h2>
              <p>
                Subject to applicable law, you may request access to your personal data, correction of inaccurate or incomplete data, deletion/erasure, withdrawal of consent, and grievance redressal. You may also request account closure. We may retain limited data where required for legal, regulatory, fraud-prevention, or legitimate operational purposes. To exercise rights, email us at <a href="mailto:legal@anshapps.com" className="text-indigo-650 dark:text-indigo-400 hover:underline">legal@anshapps.com</a>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                10. Account Deletion
              </h2>
              <p>
                You may request account deletion by emailing <a href="mailto:legal@anshapps.com" className="text-indigo-650 dark:text-indigo-400 hover:underline">legal@anshapps.com</a> from your registered email ID with the subject line &quot;Account Deletion Request&quot;. We may verify identity before processing. Once validated, we initiate deletion/anonymization of personal data associated with your account, subject to lawful retention obligations.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                11. Security Practices
              </h2>
              <p>
                We maintain reasonable security practices and procedures including access controls, encryption in transit, monitoring, periodic reviews, and administrative safeguards designed to protect data against unauthorized access, disclosure, loss, or misuse. No system is completely secure. You are responsible for maintaining confidentiality of your credentials and promptly notifying us of suspected misuse.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                12. Grievance Officer and Contact
              </h2>
              <p>
                For privacy concerns, rights requests, or grievances, contact our Grievance Officer:
              </p>
              <div className="bg-white/80 dark:bg-slate-900/80 border border-outline-variant/10 rounded-2xl p-6 space-y-2 text-sm">
                <p><strong>Name:</strong> Legal Operations Director</p>
                <p><strong>Email:</strong> <a href="mailto:legal@anshapps.com" className="text-indigo-650 dark:text-indigo-400 hover:underline">legal@anshapps.com</a></p>
                <p><strong>Address:</strong> Pune, Maharashtra, India</p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                13. Policy Updates
              </h2>
              <p>
                We may update this policy from time to time to reflect legal, operational, or product changes. Material updates will be notified through website/app notice or email. Continued use after the effective date constitutes acceptance of the revised terms.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
