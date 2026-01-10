import {
  BarChart3,
  TrendingUp,
  PieChart,
  ArrowUpRight,
  DollarSign,
  Users,
  ShoppingCart,
} from 'lucide-react';

import { LoginForm } from './login-form';

/**
 * Login Page Component
 * Split-screen layout with hero section and login form
 */
export const LoginPage = () => {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Hero Section (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-3/5 flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-12 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500 rounded-full blur-3xl" />
        </div>

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-500/30">
              <BarChart3 className="h-6 w-6" />
            </div>
            <span className="text-xl font-semibold">FinanceAI</span>
          </div>
        </div>

        {/* Main Content with Dashboard Preview */}
        <div className="relative z-10 flex flex-col gap-8">
          {/* Text Content */}
          <div className="space-y-6 max-w-lg">
            <h1 className="text-4xl font-bold leading-tight tracking-tight">
              Make smarter business decisions with AI-powered analytics
            </h1>
            <p className="text-lg text-slate-300">
              Unlock real-time insights into your eCommerce revenue, expenses,
              and cash flow
            </p>
          </div>

          {/* Dashboard Preview Cards */}
          <div className="grid grid-cols-2 gap-4 max-w-2xl">
            {/* Revenue Card */}
            <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <DollarSign className="h-4 w-4 text-green-400" />
                  </div>
                  <span className="text-sm text-slate-300">Revenue</span>
                </div>
                <div className="flex items-center gap-1 text-green-400 text-xs">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+12.5%</span>
                </div>
              </div>
              <div className="text-2xl font-bold">$124,500</div>
              <div className="h-12 flex items-end gap-1">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map(
                  (height, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-green-500/60 to-green-400/40 rounded-sm"
                      style={{ height: `${height}%` }}
                    />
                  )
                )}
              </div>
            </div>

            {/* Orders Card */}
            <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <ShoppingCart className="h-4 w-4 text-blue-400" />
                  </div>
                  <span className="text-sm text-slate-300">Orders</span>
                </div>
                <div className="flex items-center gap-1 text-blue-400 text-xs">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+8.2%</span>
                </div>
              </div>
              <div className="text-2xl font-bold">1,284</div>
              <div className="h-12 flex items-end gap-1">
                {[30, 50, 70, 45, 80, 60, 75, 90, 55, 85, 65, 78].map(
                  (height, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-blue-500/60 to-blue-400/40 rounded-sm"
                      style={{ height: `${height}%` }}
                    />
                  )
                )}
              </div>
            </div>

            {/* Customers Card */}
            <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Users className="h-4 w-4 text-purple-400" />
                  </div>
                  <span className="text-sm text-slate-300">Customers</span>
                </div>
                <div className="flex items-center gap-1 text-purple-400 text-xs">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+24.1%</span>
                </div>
              </div>
              <div className="text-2xl font-bold">8,492</div>
              {/* Mini pie chart representation */}
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12">
                  <PieChart className="h-12 w-12 text-purple-400/60" />
                </div>
                <div className="flex-1 space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-400" />
                    <span className="text-slate-400">New 42%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-600" />
                    <span className="text-slate-400">Returning 58%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Growth Card */}
            <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-orange-500/20">
                    <TrendingUp className="h-4 w-4 text-orange-400" />
                  </div>
                  <span className="text-sm text-slate-300">Growth</span>
                </div>
                <div className="flex items-center gap-1 text-orange-400 text-xs">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+18.7%</span>
                </div>
              </div>
              <div className="text-2xl font-bold">+32.4%</div>
              {/* Trend line */}
              <div className="h-12 relative">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 40"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="rgb(251, 146, 60)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="rgb(251, 146, 60)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,35 Q10,30 20,28 T40,20 T60,15 T80,8 T100,5"
                    fill="none"
                    stroke="rgb(251, 146, 60)"
                    strokeWidth="2"
                  />
                  <path
                    d="M0,35 Q10,30 20,28 T40,20 T60,15 T80,8 T100,5 L100,40 L0,40 Z"
                    fill="url(#gradient)"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Feature List */}
          <ul className="flex flex-wrap gap-4 text-sm text-slate-300">
            <li className="flex items-center gap-2 bg-white/5 rounded-full px-4 py-2">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              <span>Real-time dashboard</span>
            </li>
            <li className="flex items-center gap-2 bg-white/5 rounded-full px-4 py-2">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              <span>AI forecasting</span>
            </li>
            <li className="flex items-center gap-2 bg-white/5 rounded-full px-4 py-2">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              <span>Expense tracking</span>
            </li>
          </ul>
        </div>

        {/* Trust Badge */}
        <div className="relative z-10 space-y-4">
          <p className="text-sm text-slate-400">
            Trusted by 500+ eCommerce businesses
          </p>
          <div className="flex gap-6 items-center">
            {/* Stylized company logos */}
            <div className="h-8 px-4 rounded bg-white/10 flex items-center justify-center text-xs font-semibold text-slate-400">
              SHOPIFY
            </div>
            <div className="h-8 px-4 rounded bg-white/10 flex items-center justify-center text-xs font-semibold text-slate-400">
              AMAZON
            </div>
            <div className="h-8 px-4 rounded bg-white/10 flex items-center justify-center text-xs font-semibold text-slate-400">
              LAZADA
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full lg:w-2/5 flex-col items-center justify-center bg-white p-6 sm:p-12">
        {/* Mobile Logo (Shown only on mobile) */}
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-semibold text-slate-900">
            FinanceAI
          </span>
        </div>

        {/* Login Form */}
        <LoginForm />
      </div>
    </div>
  );
};
