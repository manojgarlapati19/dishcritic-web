export default function TermsPage() {
  return (
    <div className="bg-[#FBF6EE]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <span className="text-xs font-semibold text-[#C8702A] uppercase tracking-[0.2em]">Legal</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E1208] mt-4 mb-8">Terms of Service</h1>
        <p className="text-sm text-[#A08060] mb-10">Last updated: May 2026</p>

        <div className="prose prose-sm max-w-none text-[#A08060] space-y-8">
          <section>
            <h2 className="font-serif text-xl font-bold text-[#1E1208] mb-3">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing or using DishCritic (&ldquo;the Platform&rdquo;), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Platform.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#1E1208] mb-3">2. Description of Service</h2>
            <p className="leading-relaxed">
              DishCritic is a dish-first restaurant review platform that allows users to search, rate, and review individual dishes at restaurants across India. Users can create profiles, submit reviews, save restaurants, and interact with other food lovers.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#1E1208] mb-3">3. User Accounts</h2>
            <p className="leading-relaxed mb-3">You are responsible for:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and complete information</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#1E1208] mb-3">4. User Content</h2>
            <p className="leading-relaxed mb-3">By submitting reviews, you agree that:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your reviews are honest and based on your genuine experience</li>
              <li>You will not submit fake, misleading, or paid reviews</li>
              <li>You retain ownership of your content</li>
              <li>You grant DishCritic a license to display your content on the Platform</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#1E1208] mb-3">5. Prohibited Conduct</h2>
            <p className="leading-relaxed mb-3">You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use the Platform for any unlawful purpose</li>
              <li>Post false, defamatory, or abusive content</li>
              <li>Attempt to manipulate ratings or rankings</li>
              <li>Harass, threaten, or harm other users</li>
              <li>Scrape or collect data without authorization</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#1E1208] mb-3">6. Intellectual Property</h2>
            <p className="leading-relaxed">
              The DishCritic name, logo, and platform design are our intellectual property. You may not use them without our prior written consent.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#1E1208] mb-3">7. Limitation of Liability</h2>
            <p className="leading-relaxed">
              DishCritic is provided &ldquo;as is&rdquo; without warranties of any kind. We are not liable for any damages arising from your use of the Platform, including reliance on reviews or ratings.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#1E1208] mb-3">8. Termination</h2>
            <p className="leading-relaxed">
              We reserve the right to suspend or terminate accounts that violate these terms, at our sole discretion.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#1E1208] mb-3">9. Changes to Terms</h2>
            <p className="leading-relaxed">
              We may update these terms from time to time. Continued use of the Platform after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#1E1208] mb-3">10. Contact</h2>
            <p className="leading-relaxed">
              For questions about these terms, please contact us at legal@dishcritic.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
