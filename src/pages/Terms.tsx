import Layout from "@/components/layout/Layout";

export default function Terms() {
  return (
    <Layout>
      <div className="container-blog py-12 lg:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-8">
            Terms and Conditions
          </h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground">
              Last updated: January 14, 2026
            </p>

            <section className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">
                1. Acceptance of Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using Pencraft, you accept and agree to be bound by these Terms and 
                Conditions. If you do not agree to these terms, please do not use our website.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">
                2. Use of the Website
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You may use our website for lawful purposes only. You agree not to use the website:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>In any way that violates any applicable laws or regulations</li>
                <li>To transmit any harmful, threatening, or objectionable material</li>
                <li>To impersonate any person or entity</li>
                <li>To interfere with or disrupt the website or servers</li>
                <li>To attempt unauthorized access to any part of the website</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">
                3. Intellectual Property
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                All content on this website, including text, graphics, logos, images, and software, 
                is the property of Pencraft or its content creators and is protected by copyright 
                and other intellectual property laws.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">
                4. User Content
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                By posting comments or other content on our website, you grant us a non-exclusive, 
                royalty-free license to use, reproduce, and display such content. You are responsible 
                for ensuring that your content does not violate any third-party rights.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">
                5. Account Registration
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                To access certain features, you may need to create an account. You are responsible 
                for maintaining the confidentiality of your account credentials and for all activities 
                that occur under your account.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">
                6. Disclaimer of Warranties
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                The website is provided "as is" without any warranties, express or implied. We do not 
                guarantee that the website will be uninterrupted, secure, or error-free.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">
                7. Limitation of Liability
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                To the fullest extent permitted by law, Pencraft shall not be liable for any indirect, 
                incidental, special, or consequential damages arising from your use of the website.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">
                8. Third-Party Links
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Our website may contain links to third-party websites. We are not responsible for the 
                content or practices of these websites and encourage you to review their terms and 
                privacy policies.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">
                9. Changes to Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these terms at any time. Changes will be effective 
                immediately upon posting on the website. Your continued use of the website constitutes 
                acceptance of the modified terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">
                10. Contact Information
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms and Conditions, please contact us at 
                legal@pencraft.com or through our contact page.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
