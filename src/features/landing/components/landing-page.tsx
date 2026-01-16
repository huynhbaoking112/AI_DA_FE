import { useCallback, useMemo } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Fingerprint,
  LineChart,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type NavItem = {
  label: string;
  href: string;
};

type FeatureItem = {
  title: string;
  description: string;
  icon: typeof Sparkles;
};

type MetricItem = {
  label: string;
  value: string;
  change: string;
};

type TestimonialItem = {
  name: string;
  role: string;
  quote: string;
};

type StepItem = {
  title: string;
  description: string;
};

const BrandMark = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-11 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-[0_20px_50px_-30px_rgba(255,255,255,0.6)]">
        <Sparkles className="size-5" />
      </div>
      <div className="leading-tight">
        <p className="text-xs uppercase tracking-[0.32em] text-white/60">
          FinanceAI
        </p>
        <p className="text-lg font-semibold text-white">Predictive Finance</p>
      </div>
    </div>
  );
};

export const LandingPage = () => {
  const navItems = useMemo<NavItem[]>(
    () => [
      { label: 'Product', href: '#product' },
      { label: 'Why us', href: '#value' },
      { label: 'Proof', href: '#proof' },
      { label: 'Stories', href: '#stories' },
    ],
    []
  );

  const features = useMemo<FeatureItem[]>(
    () => [
      {
        title: 'AI Cash Flow Studio',
        description:
          'Forecast 90 days with dynamic confidence bands and instant scenario pivots.',
        icon: Sparkles,
      },
      {
        title: 'Automated anomaly guardrails',
        description:
          'FinanceAI flags outliers in spend, refunds, and ad ROI before they compound.',
        icon: Fingerprint,
      },
      {
        title: 'Unified commerce signals',
        description:
          'Blend storefronts, banks, and paid media into a single margin story.',
        icon: Cpu,
      },
      {
        title: 'Board-ready reporting',
        description:
          'Export investor-ready decks and real-time KPI scorecards in minutes.',
        icon: TrendingUp,
      },
    ],
    []
  );

  const metrics = useMemo<MetricItem[]>(
    () => [
      { label: 'Cash runway', value: '7.4 months', change: '+1.3' },
      { label: 'Forecast accuracy', value: '96.2%', change: '+12%' },
      { label: 'Time saved / week', value: '8.2 hrs', change: '+3.4' },
    ],
    []
  );

  const testimonials = useMemo<TestimonialItem[]>(
    () => [
      {
        name: 'Amelia Trent',
        role: 'VP Finance, Lumen Wear',
        quote:
          'FinanceAI became our financial command center. We cut board prep time by 70% and finally trust the cash outlook.',
      },
      {
        name: 'Jordan Singh',
        role: 'Founder, Northwind Supply',
        quote:
          'The anomaly alerts paid for themselves in week one. We caught a refund spike hours after it started.',
      },
      {
        name: 'Zoe Chen',
        role: 'COO, Atlas Commerce',
        quote:
          'Scenario planning went from messy spreadsheets to a living model our team actually uses daily.',
      },
    ],
    []
  );

  const steps = useMemo<StepItem[]>(
    () => [
      {
        title: 'Connect revenue streams',
        description:
          'Link Shopify, Amazon, banks, and ad platforms in under 10 minutes.',
      },
      {
        title: 'Let FinanceAI model your week',
        description:
          'Our AI models margin, cash movement, and inventory timing automatically.',
      },
      {
        title: 'Act on live recommendations',
        description:
          'Move spend, reorder inventory, or freeze campaigns with full impact visibility.',
      },
    ],
    []
  );

  const partners = useMemo(
    () => ['Shopify', 'Stripe', 'Amazon', 'TikTok', 'Notion'],
    []
  );

  const handleLinkClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      const href = event.currentTarget.getAttribute('href');

      if (!href) {
        return;
      }

      if (!href.startsWith('#')) {
        return;
      }

      event.preventDefault();
      const target = document.querySelector(href);

      if (!target) {
        return;
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    []
  );

  const handleLinkKeyDown = useCallback(
    (event: KeyboardEvent<HTMLAnchorElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.currentTarget.click();
      }
    },
    []
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0d12] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.25),transparent_65%)] blur-3xl" />
        <div className="absolute -left-32 bottom-0 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.2),transparent_65%)] blur-3xl" />
        <div className="absolute right-0 top-24 h-[420px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.2),transparent_65%)] blur-3xl" />
        <div className="absolute inset-0 opacity-[0.15] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      <div className="relative z-10">
        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-8 lg:px-12">
          <BrandMark />
          <nav className="hidden items-center gap-8 text-sm font-semibold text-white/70 md:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                tabIndex={0}
                aria-label={item.label}
                onClick={handleLinkClick}
                onKeyDown={handleLinkKeyDown}
                className="transition hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              tabIndex={0}
              aria-label="Login"
              onClick={handleLinkClick}
              onKeyDown={handleLinkKeyDown}
              className="hidden text-sm font-semibold text-white/70 transition hover:text-white md:inline-flex"
            >
              Sign in
            </Link>
            <Button asChild className="rounded-full px-6">
              <Link
                to="/login"
                tabIndex={0}
                aria-label="Get started"
                onClick={handleLinkClick}
                onKeyDown={handleLinkKeyDown}
              >
                Get started
              </Link>
            </Button>
          </div>
        </header>

        <section className="mx-auto grid w-full max-w-7xl gap-12 px-6 pb-20 pt-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:pb-28">
          <div className="space-y-10 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              <Zap className="size-4" />
              FinanceAI Platform
            </div>
            <div className="space-y-6">
              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                <span className="font-serif text-white">Predictive finance</span>{' '}
                for ecommerce teams moving fast.
              </h1>
              <p className="max-w-xl text-lg text-white/70">
                FinanceAI syncs your storefronts, banks, and ads to build a live
                cash-flow command center. Know what is next before it happens.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="rounded-full">
                <Link
                  to="/login"
                  tabIndex={0}
                  aria-label="Book a demo"
                  onClick={handleLinkClick}
                  onKeyDown={handleLinkKeyDown}
                >
                  Book a demo
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <a
                href="#product"
                tabIndex={0}
                aria-label="Explore product"
                onClick={handleLinkClick}
                onKeyDown={handleLinkKeyDown}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/80 transition hover:text-white"
              >
                Explore product
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
              <span>Trusted by</span>
              {partners.map((partner) => (
                <span
                  key={partner}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] text-white/70"
                >
                  {partner}
                </span>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-150">
            <div className="absolute right-6 top-6 hidden rounded-3xl border border-white/10 bg-white/10 p-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.8)] lg:block">
              Live runway
              <div className="mt-2 text-2xl font-semibold text-white">7.4 mo</div>
              <div className="mt-1 text-xs text-emerald-300">
                +1.3 vs last month
              </div>
            </div>
            <div className="w-full max-w-md rounded-[32px] border border-white/15 bg-gradient-to-br from-white/15 via-white/5 to-transparent p-6 shadow-[0_50px_140px_-80px_rgba(15,23,42,0.8)] backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                    Forecast studio
                  </p>
                  <p className="text-2xl font-semibold text-white">
                    AI Revenue Map
                  </p>
                </div>
                <div className="flex size-11 items-center justify-center rounded-2xl bg-white text-slate-900">
                  <LineChart className="size-5" />
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span className="text-white/70">Net cash movement</span>
                    <span className="text-emerald-300">+14.2%</span>
                  </div>
                  <div className="mt-3 flex h-16 items-end gap-2">
                    {[
                      'h-[40%]',
                      'h-[58%]',
                      'h-[46%]',
                      'h-[72%]',
                      'h-[65%]',
                      'h-[82%]',
                    ].map((height, index) => (
                      <div
                        key={`bar-${index}`}
                        className={`flex-1 rounded-xl bg-gradient-to-t from-emerald-300/80 via-cyan-300/70 to-white/80 ${height}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                        {metric.label}
                      </p>
                      <p className="mt-2 text-xl font-semibold text-white">
                        {metric.value}
                      </p>
                      <p className="mt-1 text-xs text-emerald-300">
                        {metric.change}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="product"
          className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-12"
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
                Product power
              </p>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                A command center that thinks like your CFO.
              </h2>
              <p className="text-lg text-white/70">
                FinanceAI turns fragmented commerce data into a single, live
                model. Your team gets one source of truth, across every channel,
                with AI recommendations baked in.
              </p>
              <div className="space-y-3">
                {[
                  'Unified revenue, cash, and inventory view',
                  'Scenario planning with instant impact analysis',
                  'Automated alerts with explainable AI',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-white/70"
                  >
                    <CheckCircle2 className="size-5 text-emerald-300" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-150">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.8)]"
                  >
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-white/10 text-emerald-200">
                      <Icon className="size-5" />
                    </div>
                    <p className="mt-4 text-lg font-semibold text-white">
                      {feature.title}
                    </p>
                    <p className="mt-2 text-sm text-white/70">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="value"
          className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-12"
        >
          <div className="grid gap-10 rounded-[36px] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
                Why FinanceAI
              </p>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                Your finance team moves from reporting to decision-making.
              </h2>
              <p className="text-lg text-white/70">
                FinanceAI becomes the heartbeat of your operations. Automate your
                close, monitor daily cash, and fuel growth with confidence.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-white text-slate-900">
                  <TrendingUp className="size-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    Real-time margin intelligence
                  </p>
                  <p className="text-sm text-white/60">
                    Every SKU, every channel, always current.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-white text-slate-900">
                  <Cpu className="size-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    Autopilot decisioning
                  </p>
                  <p className="text-sm text-white/60">
                    AI recommendations with full visibility.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-5 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-150">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-full border border-white/20 text-lg font-semibold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">
                        {step.title}
                      </p>
                      <p className="text-sm text-white/70">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="proof"
          className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-12"
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-200">
                Proof
              </p>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                Numbers your board will love.
              </h2>
              <p className="text-lg text-white/70">
                Teams using FinanceAI reduce cash surprises and unlock faster
                decisions across finance, ops, and growth.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center"
                >
                  <p className="text-3xl font-semibold text-white">
                    {metric.value}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/60">
                    {metric.label}
                  </p>
                  <p className="mt-3 text-xs text-emerald-300">
                    {metric.change}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="stories"
          className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-12"
        >
          <div className="space-y-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
                  Stories
                </p>
                <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                  Teams winning with FinanceAI
                </h2>
              </div>
              <a
                href="#"
                tabIndex={0}
                aria-label="Read more stories"
                onClick={handleLinkClick}
                onKeyDown={handleLinkKeyDown}
                className="hidden items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white md:inline-flex"
              >
                Read more
                <ArrowRight className="size-4" />
              </a>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6"
                >
                  <p className="text-sm text-white/70">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <div className="mt-6">
                    <p className="text-sm font-semibold text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-white/50">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 pb-20 lg:px-12">
          <div className="grid gap-8 rounded-[36px] border border-white/10 bg-gradient-to-r from-white/15 via-white/5 to-transparent p-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
                Ready to start
              </p>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                Bring FinanceAI into your operations this week.
              </h2>
              <p className="text-lg text-white/70">
                From pilot to full deployment, our team designs the rollout with
                you. Expect value in days, not quarters.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <Button asChild size="lg" className="rounded-full">
                <Link
                  to="/login"
                  tabIndex={0}
                  aria-label="Get FinanceAI access"
                  onClick={handleLinkClick}
                  onKeyDown={handleLinkKeyDown}
                >
                  Get FinanceAI access
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-white/30 text-white"
              >
                <Link
                  to="/login"
                  tabIndex={0}
                  aria-label="Talk to sales"
                  onClick={handleLinkClick}
                  onKeyDown={handleLinkKeyDown}
                >
                  Talk to sales
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <footer className="mx-auto flex w-full max-w-7xl flex-col gap-6 border-t border-white/10 px-6 py-10 text-sm text-white/60 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-white text-slate-900">
              <Sparkles className="size-4" />
            </div>
            <span className="font-semibold text-white">FinanceAI</span>
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            {['Security', 'Privacy', 'Support'].map((item) => (
              <a
                key={item}
                href="#"
                tabIndex={0}
                aria-label={item}
                onClick={handleLinkClick}
                onKeyDown={handleLinkKeyDown}
                className="transition hover:text-white"
              >
                {item}
              </a>
            ))}
          </div>
          <span>(c) 2026 FinanceAI. All rights reserved.</span>
        </footer>
      </div>
    </div>
  );
};
