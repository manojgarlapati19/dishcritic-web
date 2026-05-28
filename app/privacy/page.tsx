export default function PrivacyPage() {
  return (
    <div className="bg-cream text-ink">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">Legal</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink mt-4 mb-2">Privacy Policy</h1>
        <p className="text-sm text-brown-muted mb-10">Last updated: May 2025</p>

        <div className="space-y-10">
          <section>
            <h2 className="font-serif text-xl font-bold text-ink mb-3">Information We Collect</h2>
            <p className="text-brown-muted leading-relaxed mb-3">
              We collect information you provide directly when using DishCritic:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-brown-muted leading-relaxed">
              <li><strong className="text-ink">Account Information:</strong> Your name, email address, phone number, and profile photo when you create an account.</li>
              <li><strong className="text-ink">Reviews & Content:</strong> Dish reviews, ratings, photos, and any other content you submit to the platform.</li>
              <li><strong className="text-ink">Profile Data:</strong> Your city, dietary preferences, cuisine preferences, and saved restaurants.</li>
              <li><strong className="text-ink">Communication Data:</strong> Messages you send to restaurants or other users through our platform.</li>
              <li><strong className="text-ink">Usage Data:</strong> Information about how you interact with DishCritic, including search queries, dishes viewed, and pages visited.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-ink mb-3">How We Use Your Information</h2>
            <p className="text-brown-muted leading-relaxed mb-3">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-brown-muted leading-relaxed">
              <li>To provide and maintain the DishCritic platform, including personalized dish recommendations and rankings.</li>
              <li>To connect you with restaurants and help you discover new dishes in your city.</li>
              <li>To improve our scoring algorithms and ensure review authenticity.</li>
              <li>To send you relevant notifications, updates, and promotional content (with your consent).</li>
              <li>To detect, prevent, and address fraud, spam, or abuse on the platform.</li>
              <li>To comply with legal obligations and enforce our Terms of Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-ink mb-3">Data Sharing</h2>
            <p className="text-brown-muted leading-relaxed mb-3">
              We respect your privacy and do not sell your personal information. We may share your data in the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-brown-muted leading-relaxed">
              <li><strong className="text-ink">With Restaurants:</strong> When you review a dish or restaurant, the restaurant may see your review and profile information.</li>
              <li><strong className="text-ink">Service Providers:</strong> We engage trusted third-party services for hosting, analytics, email delivery, and payment processing.</li>
              <li><strong className="text-ink">Legal Compliance:</strong> We may disclose information if required by law or to protect our rights and safety.</li>
              <li><strong className="text-ink">Aggregated Data:</strong> We may share anonymized, aggregate data for research or reporting purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-ink mb-3">Cookies</h2>
            <p className="text-brown-muted leading-relaxed mb-3">
              DishCritic uses cookies and similar tracking technologies to enhance your experience:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-brown-muted leading-relaxed">
              <li><strong className="text-ink">Essential Cookies:</strong> Required for the platform to function properly, including authentication and session management.</li>
              <li><strong className="text-ink">Analytics Cookies:</strong> Help us understand how you use DishCritic so we can improve the experience.</li>
              <li><strong className="text-ink">Preference Cookies:</strong> Remember your settings and preferences for future visits.</li>
            </ul>
            <p className="text-brown-muted leading-relaxed mt-3">
              You can control cookie preferences through your browser settings. Disabling certain cookies may affect platform functionality.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-ink mb-3">Your Rights</h2>
            <p className="text-brown-muted leading-relaxed mb-3">
              You have the following rights regarding your personal data:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-brown-muted leading-relaxed">
              <li><strong className="text-ink">Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong className="text-ink">Correction:</strong> Update or correct inaccurate information in your profile.</li>
              <li><strong className="text-ink">Deletion:</strong> Request deletion of your account and associated data.</li>
              <li><strong className="text-ink">Portability:</strong> Request a machine-readable copy of your data.</li>
              <li><strong className="text-ink">Opt-Out:</strong> Unsubscribe from marketing communications at any time.</li>
              <li><strong className="text-ink">Withdraw Consent:</strong> Withdraw any consent you&apos;ve previously given.</li>
            </ul>
            <p className="text-brown-muted leading-relaxed mt-3">
              To exercise any of these rights, please contact us at privacy@dishcritic.in. We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-ink mb-3">Contact Us</h2>
            <p className="text-brown-muted leading-relaxed">
              If you have any questions, concerns, or requests regarding this Privacy Policy, please reach out to us:
            </p>
            <div className="mt-4 p-4 rounded-xl bg-cream-dark border border-brown-muted/10 text-brown-muted leading-relaxed">
              <p><strong className="text-ink">Email:</strong> privacy@dishcritic.in</p>
              <p className="mt-1"><strong className="text-ink">Address:</strong> DishCritic Technologies, Hyderabad, Telangana, India</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
