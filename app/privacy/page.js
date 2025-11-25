import { Shield, Lock, Eye, FileText, Server, Cookie } from 'lucide-react';

export default function PrivacyPage() {
  const sections = [
    {
      title: "Information We Collect",
      icon: Eye,
      content: "We collect information you provide directly to us, such as when you create an account, update your profile, or use our AI tools. This may include your name, email address, academic year, and study progress data. We also automatically collect usage data to improve the platform."
    },
    {
      title: "How We Use Your Data",
      icon: FileText,
      content: "Your data is used to personalize your study experience, track your syllabus progress, and generate relevant AI content (Mindmaps, Cases, etc.). We do not sell your personal data to third parties."
    },
    {
      title: "Data Security",
      icon: Lock,
      content: "We implement industry-standard security measures to protect your personal information. Your passwords are hashed (bcrypt), and sessions are secured via HTTP-only cookies."
    },
    {
      title: "AI & Third Parties",
      icon: Server,
      content: "MedMap uses Google Gemini AI for content generation. Prompts sent to AI services are anonymized where possible. We also use Google/Facebook/Twitter for authentication services if you choose social login."
    },
    {
      title: "Cookies",
      icon: Cookie,
      content: "We use essential cookies to maintain your session and preferences (like theme or academic year). You can control cookie settings through your browser, though this may affect application functionality."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 pb-24">
      <div className="text-center mb-12">
        <div className="inline-flex p-4 bg-teal-50 rounded-2xl mb-6 text-teal-600 shadow-sm">
          <Shield size={40} />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Privacy Policy</h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Your privacy is critically important to us. This policy explains how MedMap collects, uses, and protects your information.
        </p>
        <p className="text-xs font-bold text-slate-400 mt-4 uppercase tracking-wider">Last Updated: November 2025</p>
      </div>

      <div className="grid gap-6">
        {sections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <div key={idx} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-50 rounded-xl text-slate-700 shrink-0">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{section.title}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center p-8 bg-slate-100 rounded-3xl border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-2">Have questions?</h3>
        <p className="text-slate-500 mb-6">If you have any concerns about your data, please contact our support team.</p>
        <a href="mailto:support@medmap.com" className="inline-flex items-center justify-center px-6 py-3 bg-white border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all">
          Contact Support
        </a>
      </div>
    </div>
  );
}