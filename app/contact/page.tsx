export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <section className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
          TEAMVASE AI COPILOT
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight">Contact TeamVase</h1>

        <p className="mt-4 max-w-2xl text-slate-600">
          Need help with your account, subscription, billing, project uploads, dashboards, or
          AI-generated project controls insights? Contact us and we will respond as soon as
          possible.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-bold">Support email</h2>
            <p className="mt-3 text-slate-600">
              For product, billing, account, or subscription support:
            </p>
            <a
              className="mt-4 inline-block font-semibold text-blue-600"
              href="mailto:support@teamvase.com"
            >
              support@teamvase.com
            </a>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-bold">Billing and subscriptions</h2>
            <p className="mt-3 text-slate-600">
              Paid subscriptions are managed securely through Stripe. You can update your payment
              method, view invoices, or cancel your subscription through the billing portal inside
              your TeamVase account.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-bold">Refund policy</h2>
            <p className="mt-3 text-slate-600">
              Subscription payments are non-refundable after payment is completed. If you believe
              there has been a billing error, contact us for review.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-bold">Business information</h2>
            <p className="mt-3 text-slate-600">
              TEAMVASE, INC.
              <br />
              Delaware, United States
              <br />
              Website: teamvase.com
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
