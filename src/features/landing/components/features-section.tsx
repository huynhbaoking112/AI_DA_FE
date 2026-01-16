"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  ShoppingCart,
  Package,
  Zap,
  Shield,
  Globe,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Monitor your business metrics in real-time with live data updates and instant insights.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Users,
    title: "Customer Insights",
    description: "Understand your customers better with detailed profiles, behavior tracking, and segmentation.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: ShoppingCart,
    title: "Order Tracking",
    description: "Track every order from placement to delivery with comprehensive order management.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Package,
    title: "Product Analytics",
    description: "Analyze product performance, inventory levels, and sales trends across your catalog.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built for speed with optimized queries and efficient data processing pipelines.",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade security with encryption, SSO, and role-based access control.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Globe,
    title: "Global Scale",
    description: "Scale effortlessly with distributed infrastructure across multiple regions.",
    gradient: "from-teal-500 to-cyan-500",
  },
  {
    icon: Clock,
    title: "Historical Data",
    description: "Access historical data and trends to make informed decisions about the future.",
    gradient: "from-rose-500 to-pink-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export const FeaturesSection = () => {
  return (
    <section className="relative py-24 md:py-32 bg-[#030303]">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/[0.02] to-transparent" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-sm text-white/60 mb-6">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Everything you need to{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-rose-300">
              grow your business
            </span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            Powerful features designed to help you understand your data and make better decisions.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative"
            >
              <div className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-all duration-300 h-full">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                    "bg-gradient-to-br",
                    feature.gradient
                  )}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {feature.description}
                </p>
                <div
                  className={cn(
                    "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    "bg-gradient-to-br",
                    feature.gradient,
                    "blur-xl -z-10"
                  )}
                  style={{ opacity: 0.05 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
