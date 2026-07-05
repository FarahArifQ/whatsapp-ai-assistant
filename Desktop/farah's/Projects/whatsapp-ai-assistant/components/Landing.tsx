'use client'

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Zap,
  Database,
  MessageCircle,
  Clock,
  BarChart3,
  FileText,
  Check,
  ChevronDown,
  Upload,
  Link2,
  Rocket,
  MessageSquare,
} from "lucide-react";

const WhatsAppIcon = ({ className = "" }: { className?: string }) => (
  <div
    className={`flex items-center justify-center rounded-full bg-[#22c55e] text-white ${className}`}
  >
    <MessageSquare className="h-1/2 w-1/2" />
  </div>
);

const Logo = () => (
  <Link href="/" className="flex items-center gap-2">
    <WhatsAppIcon className="h-9 w-9" />
    <span className="text-lg font-bold text-[#0f172a]">WA Assistant</span>
  </Link>
);

function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How it works" },
    // { href: "#pricing", label: "Pricing" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Logo />
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-slate-600 hover:text-[#0f172a]"
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="hidden md:block">
          <Link
            href="/signup"
            className="inline-flex items-center rounded-lg bg-[#22c55e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#16a34a]"
          >
            Get Started Free
          </Link>
        </div>
        <button
          className="md:hidden text-[#0f172a]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>
      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="space-y-1 px-4 py-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/signup"
              className="mt-2 block rounded-lg bg-[#22c55e] px-4 py-2 text-center text-sm font-semibold text-white"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function ChatBubble({
  from,
  text,
}: {
  from: "customer" | "ai";
  text: string;
}) {
  const isAi = from === "ai";
  return (
    <div className={`flex ${isAi ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
          isAi
            ? "rounded-br-sm bg-[#dcfce7] text-[#0f172a]"
            : "rounded-bl-sm bg-white text-[#0f172a]"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#0f172a] sm:text-5xl lg:text-6xl">
            Your WhatsApp,{" "}
            <span className="text-[#22c55e]">on Autopilot</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 sm:text-xl">
            AI that instantly replies to your customers 24/7 — trained on your
            own business info.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-[#0f172a] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1e293b]"
            >
              Start Free Trial
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-[#0f172a] hover:bg-slate-50"
            >
              See How It Works
            </a>
          </div>
        </div>
        <div className="relative">
          <div className="mx-auto max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-[#e5ddd5] shadow-2xl">
            <div className="flex items-center gap-3 bg-[#0f172a] px-4 py-3 text-white">
              <WhatsAppIcon className="h-9 w-9" />
              <div>
                <div className="text-sm font-semibold">Your Business</div>
                <div className="text-xs text-slate-300">online</div>
              </div>
            </div>
            <div className="space-y-3 px-4 py-6">
              <ChatBubble from="customer" text="Do you deliver to Lahore?" />
              <ChatBubble
                from="ai"
                text="Yes! We deliver to all major cities. Delivery charges are Rs 250, takes 2-3 days."
              />
              <ChatBubble
                from="customer"
                text="What payment methods do you accept?"
              />
              <ChatBubble
                from="ai"
                text="We accept Cash on Delivery and bank transfer!"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  const stats = [
    { v: "< 3 sec", l: "response time" },
    { v: "24/7", l: "availability" },
    { v: "Zero", l: "missed messages" },
  ];
  return (
    <section className="border-y border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
          Trusted by businesses across Pakistan
        </p>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.l}>
              <div className="text-3xl font-bold text-[#0f172a]">{s.v}</div>
              <div className="text-sm text-slate-600">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: "Upload your info",
      desc: "Add your FAQs, product catalog, and policies.",
    },
    {
      icon: Link2,
      title: "Connect WhatsApp",
      desc: "Link your WhatsApp Business number.",
    },
    {
      icon: Rocket,
      title: "Go live",
      desc: "Your AI starts replying instantly.",
    },
  ];
  return (
    <section id="how-it-works" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-[#0f172a] sm:text-4xl">
          Set up in minutes, not days
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="rounded-2xl border border-slate-200 bg-white p-8 text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#dcfce7] text-[#16a34a]">
                <s.icon className="h-7 w-7" />
              </div>
              <div className="mt-4 text-sm font-semibold uppercase tracking-wide text-[#22c55e]">
                Step {i + 1}
              </div>
              <h3 className="mt-2 text-xl font-semibold text-[#0f172a]">
                {s.title}
              </h3>
              <p className="mt-2 text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: Zap, title: "Instant AI replies", desc: "Respond in under 3 seconds, every time." },
    { icon: Database, title: "Trained on YOUR data", desc: "Answers based on your FAQs and catalog." },
    { icon: MessageCircle, title: "Remembers context", desc: "Follows the full conversation naturally." },
    { icon: Clock, title: "Works 24/7", desc: "Never sleeps, never takes breaks." },
    { icon: BarChart3, title: "Dashboard to monitor chats", desc: "See every conversation in one place." },
    { icon: FileText, title: "Easy knowledge base", desc: "Update info anytime in a few clicks." },
  ];
  return (
    <section id="features" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-[#0f172a] sm:text-4xl">
          Everything your business needs
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-[#22c55e]/40"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#dcfce7] text-[#16a34a]">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[#0f172a]">
                {f.title}
              </h3>
              <p className="mt-1 text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "Rs 0",
      features: ["100 messages/month", "1 document upload", "Basic dashboard"],
      cta: "Get Started",
      href: "/signup",
      popular: false,
    },
    {
      name: "Starter",
      price: "Rs 2,999",
      features: [
        "1,000 messages/month",
        "10 document uploads",
        "Full dashboard",
        "Priority support",
      ],
      cta: "Start Free Trial",
      href: "/signup",
      popular: true,
    },
    {
      name: "Growth",
      price: "Rs 7,999",
      features: [
        "Unlimited messages",
        "Unlimited documents",
        "Advanced analytics",
        "Dedicated support",
      ],
      cta: "Contact Us",
      href: "/signup",
      popular: false,
    },
  ];
  return (
    <section id="pricing" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-[#0f172a] sm:text-4xl">
          Simple, transparent pricing
        </h2>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl border bg-white p-8 ${
                p.popular
                  ? "border-[#22c55e] shadow-xl lg:scale-105"
                  : "border-slate-200"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#22c55e] px-3 py-1 text-xs font-semibold text-white">
                  Most Popular
                </div>
              )}
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                {p.name}
              </h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-[#0f172a]">
                  {p.price}
                </span>
                <span className="text-slate-500">/month</span>
              </div>
              <ul className="mt-6 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-slate-700">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#22c55e]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={p.href}
                className={`mt-8 block rounded-lg px-4 py-3 text-center text-sm font-semibold ${
                  p.popular
                    ? "bg-[#22c55e] text-white hover:bg-[#16a34a]"
                    : "border border-slate-300 bg-white text-[#0f172a] hover:bg-slate-50"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "Do my customers need to download anything?",
      a: "No. They message your WhatsApp number as they normally would.",
    },
    {
      q: "Can the AI handle Urdu messages?",
      a: "Yes, the AI understands and responds in the language your customer uses.",
    },
    {
      q: "What happens if the AI doesn't know the answer?",
      a: "It politely tells the customer it will connect them with your team.",
    },
    {
      q: "Can I update my business information?",
      a: "Yes, anytime through your dashboard.",
    },
    {
      q: "Is there a contract or commitment?",
      a: "No, cancel anytime.",
    },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-[#0f172a] sm:text-4xl">
          Frequently asked questions
        </h2>
        <div className="mt-10 divide-y divide-slate-200 rounded-2xl border border-slate-200">
          {faqs.map((f, i) => (
            <div key={f.q}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-medium text-[#0f172a]">{f.q}</span>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 text-slate-500 transition-transform ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-slate-600">{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="bg-[#0f172a] py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Ready to never miss a customer again?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
          Join businesses already saving hours every day with AI-powered
          WhatsApp replies.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-[#22c55e] px-8 py-3 text-base font-semibold text-white hover:bg-[#16a34a]"
        >
          Start Free Trial
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 lg:px-8">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-slate-600">
            AI-powered WhatsApp Assistant for Pakistani businesses.
          </p>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          <div className="flex gap-6 text-sm font-medium text-slate-600">
            <Link href="/privacy" className="hover:text-[#0f172a]">
              Privacy Policy
            </Link>
            <a href="#contact" className="hover:text-[#0f172a]">
              Contact
            </a>
          </div>
          <p className="text-sm text-slate-500">© 2026 WA Assistant</p>
        </div>
      </div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <HowItWorks />
        <Features />
        {/* <Pricing /> */}
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}