"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "motion/react";
import { Scale, Calendar, ArrowLeft } from "lucide-react";

export default function TermsOfService() {
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
                <Scale className="w-5 h-5" />
              </div>
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                Legal Document
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Terms of Service
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>Effective Date: 16 April 2026</span>
              <span className="w-1 h-1 rounded-full bg-slate-350 dark:bg-slate-700" />
              <span>Applies to ANSH parent platform and all SaaS apps</span>
            </div>
          </div>

          {/* Content Sections */}
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-10 text-slate-600 dark:text-slate-300 leading-relaxed">
            <p className="text-lg text-slate-500 dark:text-slate-400">
              These Terms and Conditions (&quot;Terms&quot;) govern your use of ANSH websites, products, and SaaS applications, including Ansh Booking and other current or future ANSH apps. By accessing or using our services, you agree to these Terms and our Privacy Policy. If you do not agree, do not use the services.
            </p>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                1. Acceptance of Terms
              </h2>
              <p>
                By creating an account, upgrading to premium plans, or using our websites and services, you enter into a legally binding contract with ANSH. If you represent an organization or business, you warrant that you have authority to bind that entity to these Terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                2. ANSH Parent Platform Relationship
              </h2>
              <p>
                ANSH is the parent brand and platform operator for multiple products and services. Product-specific terms, feature notices, pricing pages, and onboarding disclosures may apply in addition to these Terms. In case of conflict, product-specific terms for that service prevail only for that limited scope.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                3. Eligibility and Account Responsibility
              </h2>
              <p>
                You represent that you are legally competent to contract under applicable law and that the information provided by you is accurate and current. You are responsible for maintaining account confidentiality, restricting unauthorized access, and all activity under your account.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                4. Service Access and Acceptable Use
              </h2>
              <p>
                You agree not to misuse the services, including unauthorized access, reverse engineering (except where legally permitted), malware distribution, fraudulent conduct, rights infringement, or unlawful processing of third-party data.
              </p>
              <p>
                We may suspend or restrict access where misuse, security risk, legal risk, or non-payment is reasonably suspected.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                5. Subscription, Billing, and Taxes
              </h2>
              <p>
                Certain ANSH services are paid subscriptions. Fees, billing cycle, and plan features are shown at the checkout or proposal stage. You authorize applicable payment charges. Prices are exclusive of applicable taxes unless expressly stated otherwise. Late or failed payments may result in service suspension, downgrade, or termination.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                6. Cancellation and No-Refund Policy
              </h2>
              <p>
                You may cancel the renewal of your paid subscription at any time before the next billing cycle. Cancellation stops future renewals.
              </p>
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 rounded-2xl p-6 text-sm">
                <p className="font-extrabold text-amber-900 dark:text-amber-400 mb-1">No Refund Policy</p>
                <p className="text-amber-850 dark:text-amber-300">
                  All fees paid are non-refundable and non-creditable, including in cases of early cancellation, non-usage, partial usage, feature preference changes, or account closure. If cancellation is initiated after a billing cycle starts, access may continue until the current period ends, but no pro-rata refund will be provided.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                7. Account Deletion and Data Consequences
              </h2>
              <p>
                You may request account deletion by contacting <a href="mailto:legal@anshapps.com" className="text-indigo-650 dark:text-indigo-400 hover:underline">legal@anshapps.com</a> from your registered email ID. Deletion may lead to permanent loss of records, configurations, and service history across linked ANSH apps. Please export required data before requesting deletion. We may retain limited records where required for legal compliance, fraud prevention, audit, or enforcement.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                8. Intellectual Property
              </h2>
              <p>
                All rights, title, and interest in ANSH services, software, branding, and content remain with ANSH and its licensors. No ownership transfer occurs through service usage. You retain ownership of your lawful business data uploaded to ANSH apps, while granting us limited rights necessary to operate and improve services.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                9. Third-Party Services
              </h2>
              <p>
                Services may integrate with third-party tools, gateways, or APIs. Their availability, uptime, and policies are outside our direct control. ANSH is not responsible for third-party platform terms or outages.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                10. Disclaimers
              </h2>
              <p>
                Services are provided on an &quot;as is&quot; and &quot;as available&quot; basis. To the maximum extent permitted by law, we disclaim implied warranties including merchantability, fitness for a particular purpose, and non-infringement. We do not guarantee uninterrupted, error-free, or fully secure operation at all times.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                11. Limitation of Liability
              </h2>
              <p>
                To the extent permitted by law, ANSH will not be liable for indirect, incidental, special, consequential, or punitive damages, or loss of data, profits, goodwill, or business opportunity. ANSH&apos;s aggregate liability for any claim relating to paid services is limited to fees actually paid by you to the relevant service in the 3 months preceding the claim event.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                12. Indemnity
              </h2>
              <p>
                You agree to indemnify and hold harmless ANSH, its founders, employees, and affiliates from claims, losses, liabilities, and expenses arising from your misuse of services, breach of these Terms, or violation of applicable law.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                13. Governing Law and Dispute Resolution
              </h2>
              <p>
                These Terms are governed by the laws of India. Subject to mandatory legal rights, courts at Pune, Maharashtra shall have exclusive jurisdiction. Before initiating legal proceedings, parties should attempt good-faith resolution through written notice.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                14. Changes to Terms
              </h2>
              <p>
                We may revise these Terms to reflect legal, business, or service updates. Material changes may be notified through website/app notice or email. Continued use after the effective date constitutes acceptance.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                15. Contact
              </h2>
              <p>
                For legal notices, cancellations, account deletion requests, and terms-related questions:
              </p>
              <div className="bg-white/80 dark:bg-slate-900/80 border border-outline-variant/10 rounded-2xl p-6 space-y-2 text-sm">
                <p><strong>Email:</strong> <a href="mailto:legal@anshapps.com" className="text-indigo-650 dark:text-indigo-400 hover:underline">legal@anshapps.com</a></p>
                <p><strong>Address:</strong> Pune, Maharashtra, India</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
