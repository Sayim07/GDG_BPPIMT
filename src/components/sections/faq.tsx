"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import faqData from "@/data/faq.json";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export function FAQ() {
  const faqs = (faqData as FAQItem[]) || [];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) {
    return null;
  }

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-surface-page transition-colors">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">
            Information
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mt-1.5">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-text-secondary mt-2">
            Details on community membership, workshops, and how to get involved
          </p>
        </div>

        {/* Accordion List (Crisp Flat Material Design) */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={faq.id || idx}
                className="bg-surface-card border border-border-subtle rounded-2xl overflow-hidden transition-colors hover:border-border-strong"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading text-base sm:text-lg font-bold text-text-primary tracking-tight">
                    {faq.question}
                  </span>
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 ${
                      isOpen
                        ? "bg-primary text-white rotate-180"
                        : "bg-surface-subtle text-text-secondary"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-text-secondary leading-relaxed border-t border-border-subtle">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
