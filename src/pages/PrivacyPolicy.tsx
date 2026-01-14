import Layout from "@/components/layout/Layout";

export default function PrivacyPolicy() {
  return (
    <Layout>
      <div className="container-blog py-12 lg:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground">
              Last updated: January 14, 2026
            </p>

            <section className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">
                1. Information We Collect
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We collect information you provide directly to us, such as when you create an account, 
                subscribe to our newsletter, leave comments, or contact us. This may include your name, 
                email address, and any other information you choose to provide.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">
                2. How We Use Your Information
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Send you newsletters and updates (with your consent)</li>
                <li>Respond to your comments and questions</li>
                <li>Monitor and analyze trends and usage</li>
                <li>Detect, investigate, and prevent fraudulent activities</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">
                3. Information Sharing
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent, except as described in this policy or as required by law.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">
                4. Cookies and Tracking
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our website and 
                hold certain information. Cookies are files with small amounts of data which may include 
                an anonymous unique identifier.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">
                5. Data Security
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">
                6. Your Rights
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You have the right to access, update, or delete your personal information at any time. 
                You may also opt out of receiving promotional communications from us by following the 
                instructions in those messages.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">
                7. Changes to This Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any changes 
                by posting the new privacy policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">
                8. Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at 
                privacy@pencraft.com or through our contact page.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
