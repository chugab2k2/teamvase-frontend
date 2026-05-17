export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <section className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
          TEAMVASE AI COPILOT
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight">Privacy Policy</h1>

        <p className="mt-4 text-slate-600">Last updated: May 17, 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-slate-700">
          <p>
            TEAMVASE, INC. operates TeamVase AI Copilot, a cloud-based project controls and schedule
            analytics platform for engineering, construction, and project management teams.
          </p>

          <h2 className="text-xl font-bold text-slate-900">Information we collect</h2>
          <p>
            We may collect account information such as your name, email address, login details,
            subscription status, billing identifiers, and support communications. We may also
            process project files, Primavera P6 schedule uploads, schedule data, reports, and
            analysis outputs that users submit to the platform.
          </p>

          <h2 className="text-xl font-bold text-slate-900">How we use information</h2>
          <p>
            We use information to provide schedule diagnostics, project controls analytics,
            AI-generated insights, user authentication, subscription management, customer support,
            platform security, and service improvement.
          </p>

          <h2 className="text-xl font-bold text-slate-900">Uploaded project data</h2>
          <p>
            Users retain ownership of the project files and data they upload. TeamVase may
            temporarily store and process uploaded files and related analysis data to generate
            reports, dashboards, diagnostics, and AI insights. We do not claim ownership of your
            uploaded project data.
          </p>

          <h2 className="text-xl font-bold text-slate-900">AI processing</h2>
          <p>
            TeamVase may use AI systems to interpret schedule data and generate project insights.
            AI-generated outputs are provided for decision support and should be reviewed by
            qualified project professionals before being relied upon for commercial, contractual, or
            operational decisions.
          </p>

          <h2 className="text-xl font-bold text-slate-900">Aggregated analytics</h2>
          <p>
            We may use anonymized and aggregated usage, performance, and schedule analytics to
            improve platform reliability, product functionality, benchmarking, and reporting
            quality. We do not use this information to identify a specific customer without
            permission.
          </p>

          <h2 className="text-xl font-bold text-slate-900">Billing information</h2>
          <p>
            Payments and subscriptions are processed by Stripe. TeamVase does not store full credit
            card numbers. Stripe may process payment details, billing records, invoices, and
            subscription information according to its own policies.
          </p>

          <h2 className="text-xl font-bold text-slate-900">Data sharing</h2>
          <p>
            We may share limited information with service providers required to operate the
            platform, including hosting, database, analytics, payment, email, and AI infrastructure
            providers. We do not sell customer project data.
          </p>

          <h2 className="text-xl font-bold text-slate-900">Security</h2>
          <p>
            We use reasonable technical and organizational safeguards to protect user accounts and
            uploaded data. However, no internet-based service can guarantee absolute security.
          </p>

          <h2 className="text-xl font-bold text-slate-900">Contact</h2>
          <p>
            For privacy questions, contact us at{" "}
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
