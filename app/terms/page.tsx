export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <section className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
          TEAMVASE AI COPILOT
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight">Terms of Service</h1>

        <p className="mt-4 text-slate-600">Last updated: May 17, 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-slate-700">
          <p>
            These Terms of Service govern your use of TeamVase AI Copilot, operated by TEAMVASE,
            INC., a Delaware corporation.
          </p>

          <h2 className="text-xl font-bold text-slate-900">Use of the platform</h2>
          <p>
            TeamVase provides cloud-based project controls, schedule diagnostics, risk analysis,
            dashboards, reporting, and AI-generated insights. You agree to use the platform lawfully
            and only for legitimate business, project management, planning, analytics, and reporting
            purposes.
          </p>

          <h2 className="text-xl font-bold text-slate-900">Account responsibility</h2>
          <p>
            You are responsible for maintaining the confidentiality of your login credentials and
            for all activity under your account.
          </p>

          <h2 className="text-xl font-bold text-slate-900">Subscriptions and billing</h2>
          <p>
            Paid subscriptions are billed through Stripe. By subscribing to a paid plan, you
            authorize recurring billing according to the plan shown at checkout. Subscription
            pricing may be displayed monthly or annually depending on the plan selected.
          </p>

          <h2 className="text-xl font-bold text-slate-900">Cancellation</h2>
          <p>
            You may cancel your subscription through the billing portal or by contacting support. If
            you cancel, your Pro access may continue until the end of the current billing period
            unless otherwise stated.
          </p>

          <h2 className="text-xl font-bold text-slate-900">Refund policy</h2>
          <p>
            Subscription payments are non-refundable after payment is completed. If you believe
            there has been a billing error, contact us at{" "}
            <a className="font-semibold text-blue-600" href="mailto:support@teamvase.com">
              support@teamvase.com
            </a>
            .
          </p>

          <h2 className="text-xl font-bold text-slate-900">Uploaded data</h2>
          <p>
            You retain ownership of files and project data uploaded to TeamVase. You grant TeamVase
            permission to process uploaded files for the purpose of generating dashboards,
            diagnostics, reports, and AI insights.
          </p>

          <h2 className="text-xl font-bold text-slate-900">AI-generated insights</h2>
          <p>
            AI-generated insights are provided for informational and decision support purposes only.
            They should not replace professional judgment, contractual review, engineering review,
            planning validation, or management approval.
          </p>

          <h2 className="text-xl font-bold text-slate-900">Service availability</h2>
          <p>
            We aim to provide reliable service, but we do not guarantee uninterrupted or error-free
            operation. Features may change as the platform evolves.
          </p>

          <h2 className="text-xl font-bold text-slate-900">Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, TEAMVASE, INC. is not liable for indirect,
            incidental, consequential, special, or punitive damages arising from use of the
            platform.
          </p>

          <h2 className="text-xl font-bold text-slate-900">Governing law</h2>
          <p>
            These Terms are governed by the laws of the State of Delaware, United States, without
            regard to conflict of law principles.
          </p>

          <h2 className="text-xl font-bold text-slate-900">Contact</h2>
          <p>
            For questions about these Terms, contact{" "}
            <a className="font-semibold text-blue-600" href="mailto:support@teamvase.com">
              support@teamvase.com
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
