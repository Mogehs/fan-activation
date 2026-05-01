import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] p-8 md:p-16 font-serif text-[var(--color-ink)] selection:bg-[var(--color-piper-red)] selection:text-white">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 mb-12 text-[var(--color-sepia)] hover:text-[var(--color-oxblood)] transition-colors group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-hand tracking-wide">back to decorator</span>
          </Link>

          <header className="mb-16">
            <h1 className="text-5xl md:text-7xl font-display italic mb-6 leading-tight">
              Privacy <br /> Policy
            </h1>
            <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm uppercase tracking-widest text-[var(--color-ink-muted)]">
              <div>Effective Date: May 1, 2026</div>
              <div>Operated by: 2011 Music Group / Piper Connolly</div>
            </div>
          </header>

          <div className="space-y-12 leading-relaxed text-lg text-[var(--color-ink-muted)]">
            <section>
              <h2 className="text-2xl font-display italic text-[var(--color-ink)] mb-4 italic">1. Overview</h2>
              <p>
                This Privacy Policy explains how we collect, use, and protect information submitted through the Piper Connolly “beautiful life” CD Decorator experience. This is a temporary fan activation site where visitors can decorate a digital CD, unlock their downloadable design, receive updates about Piper Connolly, and join the bestie club for release news, surprises, and related announcements. By using this site, submitting your email address or phone number, or opting in to receive updates, you agree to the terms of this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display italic text-[var(--color-ink)] mb-4 italic">2. Information We Collect</h2>
              <ul className="list-disc list-inside space-y-2 marker:text-[var(--color-piper-red)]">
                <li>Email address, if you choose to unlock your CD download by email.</li>
                <li>Phone number, if you choose to opt in to SMS/text updates.</li>
                <li>Your CD design, only as needed to generate your downloadable image.</li>
                <li>Basic usage information, such as page visits, clicks, device type, browser type, and general engagement data.</li>
                <li>Social sharing activity, if you choose to share your design or tag @hernameispiperconnolly.</li>
              </ul>
              <p className="mt-4 italic">We do not require users to create an account.</p>
            </section>

            <section>
              <h2 className="text-2xl font-display italic text-[var(--color-ink)] mb-4 italic">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 marker:text-[var(--color-piper-red)]">
                <li>Unlock and deliver your custom CD design download.</li>
                <li>Send Piper Connolly updates, release reminders, exclusive content, surprises, and related announcements.</li>
                <li>Add you to Piper Connolly’s mailing list or fan update list.</li>
                <li>Send SMS/text messages if you separately opt in to receive them.</li>
                <li>Improve the fan experience, website performance, and campaign effectiveness.</li>
                <li>Understand how fans engage with the activation.</li>
                <li>Prevent misuse, spam, or technical issues.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-display italic text-[var(--color-ink)] mb-4 italic">4. Email Marketing</h2>
              <p>
                If you submit your email address, you may receive updates from Piper Connolly, 2011 Music Group, or related campaign partners about new music, release news, behind-the-scenes content, exclusive fan surprises, events, merch, or other Piper-related updates. You can unsubscribe from marketing emails at any time by clicking the unsubscribe link in any email or contacting us at <a href="mailto:natalie@2011musicgroup.com" className="underline decoration-[var(--color-piper-red)] hover:text-[var(--color-piper-red)] transition-colors">natalie@2011musicgroup.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display italic text-[var(--color-ink)] mb-4 italic">5. SMS / Text Message Marketing</h2>
              <p>
                If you submit your phone number and opt in to SMS updates, you agree to receive text messages from or on behalf of Piper Connolly and/or 2011 Music Group. Message frequency may vary. Message and data rates may apply. You may opt out at any time by replying STOP. For help, reply HELP or contact us at <a href="mailto:natalie@2011musicgroup.com" className="underline decoration-[var(--color-piper-red)] hover:text-[var(--color-piper-red)] transition-colors">natalie@2011musicgroup.com</a>. Consent to receive SMS messages is not required to purchase anything or access general website content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display italic text-[var(--color-ink)] mb-4 italic">6. Unlocking Your Download</h2>
              <p>
                To download your finished CD design, you may be asked to provide either your email address, or your phone number. Once submitted, your design will unlock for download and social sharing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display italic text-[var(--color-ink)] mb-4 italic">7. User-Generated Designs</h2>
              <p>
                The CD decorator allows users to create custom visual designs using provided stickers, text, doodles, colors, and other design tools. We do not claim ownership of your personal CD design. However, by using the tool and sharing your design publicly, you allow Piper Connolly, 2011 Music Group, and their team to repost or share publicly tagged designs for promotional or fan-engagement purposes, with credit when reasonably possible.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display italic text-[var(--color-ink)] mb-4 italic">8. Social Sharing</h2>
              <p>
                If you download or share your CD design, we may encourage you to tag <strong className="text-[var(--color-oxblood)]">@hernameispiperconnolly</strong>. Social platforms have their own privacy policies. We are not responsible for how Instagram, TikTok, Facebook, X, or any other third-party platform collects or uses your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display italic text-[var(--color-ink)] mb-4 italic">9. Third-Party Services</h2>
              <p>
                We may use third-party tools to operate the website, collect opt-ins, deliver emails or texts, process downloads, analyze usage, or store submitted information. These include services such as Bandzoogle, Laylo, Mailchimp, Klaviyo, Zapier, Make, Google Analytics, and hosting providers like Vercel or Netlify. These third-party services may collect and process information according to their own privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display italic text-[var(--color-ink)] mb-4 italic">10. Cookies and Tracking</h2>
              <p>
                The site may use cookies, pixels, or similar technologies to understand site traffic, improve performance, measure campaign effectiveness, remember preferences, and support analytics or advertising. You can adjust your browser settings to block or delete cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display italic text-[var(--color-ink)] mb-4 italic">11. Children’s Privacy</h2>
              <p>
                This experience is intended for general audiences. We do not knowingly collect personal information from children under 13 without verifiable parental consent. If you are under 13, please do not submit your personal information without permission from a parent or guardian.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display italic text-[var(--color-ink)] mb-4 italic">12. Data Retention</h2>
              <p>
                We keep submitted information only as long as reasonably necessary to provide the requested download, send opted-in updates, operate the campaign, maintain business records, and comply with legal obligations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display italic text-[var(--color-ink)] mb-4 italic">13. How We Protect Your Information</h2>
              <p>
                We use reasonable administrative, technical, and organizational safeguards to help protect submitted information. However, no method of transmission over the Internet or electronic storage is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display italic text-[var(--color-ink)] mb-4 italic">14. Your Choices</h2>
              <p>
                You may unsubscribe from emails at any time, reply STOP to opt out of SMS messages, or contact us to request deletion of your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display italic text-[var(--color-ink)] mb-4 italic">15. Privacy Rights</h2>
              <p>
                To make a privacy request, contact us at <a href="mailto:natalie@2011musicgroup.com" className="underline decoration-[var(--color-piper-red)] hover:text-[var(--color-piper-red)] transition-colors">natalie@2011musicgroup.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display italic text-[var(--color-ink)] mb-4 italic">16. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. If we make material changes, we will update the effective date above.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display italic text-[var(--color-ink)] mb-4 italic">17. Contact Us</h2>
              <div className="bg-[var(--color-paper)] border border-[var(--color-border-soft)] p-8 rounded-2xl shadow-sm space-y-2">
                <p className="font-bold uppercase tracking-widest text-sm">2011 Music Group / Piper Connolly</p>
                <p>Email: <a href="mailto:natalie@2011musicgroup.com" className="hover:text-[var(--color-piper-red)] transition-colors">natalie@2011musicgroup.com</a></p>
                <p>Website: <a href="https://2011musicgroup.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-piper-red)] transition-colors">2011musicgroup.com</a></p>
              </div>
            </section>
          </div>

          <footer className="mt-24 pt-8 border-t border-[var(--color-border-soft)] text-center">
            <Link 
              to="/" 
              className="font-hand text-xl text-[var(--color-oxblood)] hover:scale-102 inline-block transition-transform"
            >
              Back to the CD Decorator ✦
            </Link>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
