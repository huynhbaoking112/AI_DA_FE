"use client";

import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  company: string;
  avatar: string;
};

const testimonials: Testimonial[] = [
  {
    quote: "This analytics platform transformed how we understand our customers. The real-time insights have helped us increase conversion rates by 40% in just three months.",
    name: "Sarah Chen",
    designation: "Head of Growth",
    company: "TechFlow Inc.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
  },
  {
    quote: "The dashboard is incredibly intuitive. Our team was up and running within hours, not days. The customer support is also exceptional.",
    name: "Michael Rodriguez",
    designation: "CTO",
    company: "DataDriven Co.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    quote: "We've tried many analytics tools, but this one stands out for its speed and accuracy. The real-time updates are game-changing for our operations.",
    name: "Emily Watson",
    designation: "Operations Director",
    company: "ScaleUp Labs",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
  {
    quote: "The product analytics feature alone has saved us countless hours. We can now make data-driven decisions in minutes instead of days.",
    name: "David Kim",
    designation: "Product Manager",
    company: "InnovateTech",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
];

export const TestimonialsSection = () => {
  const [active, setActive] = useState(0);

  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, []);

  const handlePrev = useCallback(() => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(handleNext, 6000);
    return () => clearInterval(interval);
  }, [handleNext]);

  return (
    <section className="relative py-24 md:py-32 bg-[#030303] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/[0.02] to-transparent" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-sm text-white/60 mb-6">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Loved by{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-rose-300">
              thousands
            </span>{" "}
            of teams
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Quote className="absolute -top-4 -left-4 w-16 h-16 text-white/5" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="text-center px-8 md:px-16"
              >
                <p className="text-xl md:text-2xl lg:text-3xl text-white/80 font-light leading-relaxed mb-8">
                  "{testimonials[active].quote}"
                </p>
                
                <div className="flex flex-col items-center">
                  <img
                    src={testimonials[active].avatar}
                    alt={testimonials[active].name}
                    className="w-16 h-16 rounded-full object-cover mb-4 border-2 border-white/10"
                  />
                  <h4 className="text-lg font-semibold text-white">
                    {testimonials[active].name}
                  </h4>
                  <p className="text-white/40 text-sm">
                    {testimonials[active].designation} at {testimonials[active].company}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                onClick={handlePrev}
                className="p-2 rounded-full bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 text-white/60" />
              </button>
              
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActive(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === active
                        ? "bg-white w-6"
                        : "bg-white/20 hover:bg-white/40"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              
              <button
                onClick={handleNext}
                className="p-2 rounded-full bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 text-white/60" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
