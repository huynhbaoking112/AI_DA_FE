import { useMemo } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowUpRight,
  LineChart,
  ShieldCheck,
  Sparkles,
  Wallet,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoginForm } from './login-form';

type MetricCard = {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  iconClassName: string;
  chipClassName: string;
  barClassName: string;
  bars: string[];
};

type Highlight = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const BrandMark = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-[0_18px_50px_-30px_rgba(15,23,42,0.7)]">
        <Sparkles className="size-5" />
      </div>
      <div className="leading-tight">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
          FinanceAI
        </p>
        <p className="text-lg font-semibold text-slate-900">Predictive Finance</p>
      </div>
    </div>
  );
};

/**
 * Login Page Component
 * Premium split-screen layout with hero section and login form
 */
export const LoginPage = () => {
  const metricCards = useMemo<MetricCard[]>(
    () => [
      {
        label: 'Monthly revenue',
        value: '$128,400',
        change: '+14.2%',
        icon: LineChart,
        iconClassName: 'bg-emerald-500/15 text-emerald-700',
        chipClassName: 'bg-emerald-500/10 text-emerald-700',
        barClassName: 'bg-emerald-500/60',
        bars: [
          'h-[35%]',
          'h-[55%]',
          'h-[42%]',
          'h-[70%]',
          'h-[58%]',
          'h-[82%]',
          'h-[64%]',
          'h-[90%]',
        ],
      },
      {
        label: 'Cash runway',
        value: '7.3 months',
        change: '+1.2',
        icon: Wallet,
        iconClassName: 'bg-amber-500/20 text-amber-700',
        chipClassName: 'bg-amber-500/15 text-amber-700',
        barClassName: 'bg-amber-500/60',
        bars: [
          'h-[48%]',
          'h-[62%]',
          'h-[55%]',
          'h-[68%]',
          'h-[72%]',
          'h-[76%]',
          'h-[84%]',
          'h-[92%]',
        ],
      },
      {
        label: 'Risk alerts',
        value: 'Low',
        change: 'Stable',
        icon: ShieldCheck,
        iconClassName: 'bg-teal-500/20 text-teal-700',
        chipClassName: 'bg-teal-500/15 text-teal-700',
        barClassName: 'bg-teal-500/60',
        bars: [
          'h-[82%]',
          'h-[74%]',
          'h-[78%]',
          'h-[86%]',
          'h-[88%]',
          'h-[92%]',
          'h-[90%]',
          'h-[94%]',
        ],
      },
      {
        label: 'Automation score',
        value: '92%',
        change: '+6.4%',
        icon: Zap,
        iconClassName: 'bg-slate-900/10 text-slate-900',
        chipClassName: 'bg-slate-900/10 text-slate-900',
        barClassName: 'bg-slate-900/60',
        bars: [
          'h-[40%]',
          'h-[50%]',
          'h-[62%]',
          'h-[70%]',
          'h-[78%]',
          'h-[86%]',
          'h-[92%]',
          'h-[96%]',
        ],
      },
    ],
    []
  );

  const highlights = useMemo<Highlight[]>(
    () => [
      {
        title: 'AI cash-flow forecast',
        description: 'See 90-day projections with confidence bands.',
        icon: Sparkles,
      },
      {
        title: 'Smart anomaly detection',
        description: 'Catch unusual spend before it hits the bottom line.',
        icon: LineChart,
      },
      {
        title: 'Board-ready reports',
        description: 'Generate investor updates in under 60 seconds.',
        icon: ShieldCheck,
      },
    ],
    []
  );

  const partners = useMemo(
    () => ['Shopify', 'Stripe', 'Notion', 'Figma', 'Lazada'],
    []
  );

  return (
    <div className="relative min-h-screen bg-[#f7f2ea] text-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 size-[520px] rounded-full bg-teal-300/35 blur-3xl" />
        <div className="absolute -bottom-32 right-0 size-[520px] rounded-full bg-amber-200/45 blur-3xl" />
        <div className="absolute right-[20%] top-24 size-[360px] rounded-full bg-emerald-200/35 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(#0f172a_1px,transparent_1px),linear-gradient(90deg,#0f172a_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 py-12 lg:px-12">
        <div className="grid w-full gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-between gap-12">
            <div className="space-y-10">
              <div className="hidden lg:block">
                <BrandMark />
              </div>

              <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-slate-500 shadow-sm">
                  FinanceAI Platform
                </div>
                <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl lg:leading-[1.05]">
                  <span className="font-serif text-slate-900">
                    Predictive finance
                  </span>{' '}
                  for modern ecommerce teams.
                </h1>
                <p className="max-w-xl text-lg text-slate-600">
                  Connect your storefronts, banks, and ads once. FinanceAI maps
                  every signal into a live cash-flow command center in minutes.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-150">
                {highlights.map((highlight) => {
                  const Icon = highlight.icon;
                  return (
                    <div
                      key={highlight.title}
                      className="flex max-w-xs items-start gap-3 rounded-2xl border border-white/70 bg-white/70 p-4 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.5)] backdrop-blur"
                    >
                      <div className="flex size-10 items-center justify-center rounded-xl bg-slate-900/10 text-slate-900">
                        <Icon className="size-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-900">
                          {highlight.title}
                        </p>
                        <p className="text-sm text-slate-500">
                          {highlight.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300">
              {metricCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.label}
                    className="rounded-2xl border border-white/70 bg-white/70 p-5 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.5)] backdrop-blur"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'flex size-10 items-center justify-center rounded-xl',
                            card.iconClassName
                          )}
                        >
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                            {card.label}
                          </p>
                          <p className="text-xl font-semibold text-slate-900">
                            {card.value}
                          </p>
                        </div>
                      </div>
                      <div
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold',
                          card.chipClassName
                        )}
                      >
                        <ArrowUpRight className="size-3" />
                        {card.change}
                      </div>
                    </div>

                    <div className="mt-4 flex h-12 items-end gap-1">
                      {card.bars.map((heightClassName, index) => (
                        <div
                          key={`${card.label}-bar-${index}`}
                          className={cn(
                            'flex-1 rounded-sm',
                            card.barClassName,
                            heightClassName
                          )}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-500">
              <span className="text-slate-400">Trusted by</span>
              {partners.map((partner) => (
                <span
                  key={partner}
                  className="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-[11px] text-slate-600 shadow-sm"
                >
                  {partner}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center lg:sticky lg:top-10 lg:self-start lg:items-start">
            <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/80 p-8 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.5)] backdrop-blur">
              <div className="mb-6 flex items-center gap-3 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm text-slate-600">
                <div className="flex size-9 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <Sparkles className="size-4" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Secure Access
                  </p>
                  <p className="font-medium text-slate-900">
                    Sign in to your FinanceAI workspace
                  </p>
                </div>
              </div>

              <div className="mb-6 lg:hidden">
                <BrandMark />
              </div>

              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
