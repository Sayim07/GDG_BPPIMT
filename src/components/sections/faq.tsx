"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import faqData from "@/data/faq.json";
import { FoldText } from "@/components/ui/fold-text";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export function FAQ({ isCard = false }: { isCard?: boolean } = {}) {
  const faqs = (faqData as FAQItem[]) || [];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) {
    return null;
  }

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const content = (
    <div className="w-full">
      {/* Section Header */}
      <div className="text-center mb-5 sm:mb-10">
        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-text-tertiary">
          Information
        </p>
        <h2 className="font-heading text-2xl sm:text-4xl font-bold text-text-primary tracking-tight mt-1 sm:mt-1.5">
          <FoldText
            text="Frequently Asked Questions"
            trigger="scroll"
            foldStyle="paper"
            hinge="top"
            hoverRefold={true}
            duration={0.65}
            stagger={0.025}
          />
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary mt-1 sm:mt-1.5">
          Details on community membership, workshops, and how to get involved
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-2.5 sm:space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={faq.id || idx}
              className="bg-surface-card border border-border-subtle rounded-xl sm:rounded-2xl overflow-hidden transition-colors hover:border-border-strong"
            >
              <button
                onClick={() => toggleFAQ(idx)}
                className="w-full px-4 sm:px-6 py-3.5 sm:py-5 flex items-center justify-between text-left gap-3 sm:gap-4"
                aria-expanded={isOpen}
              >
                <span className="font-heading text-sm sm:text-lg font-bold text-text-primary tracking-tight">
                  {faq.question}
                </span>
                <div
                  className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-transform duration-200 ${
                    isOpen
                      ? "bg-primary text-white rotate-180"
                      : "bg-surface-subtle text-text-secondary"
                  }`}
                >
                  <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
                    <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-1 text-xs sm:text-base text-text-secondary leading-relaxed border-t border-border-subtle">
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
  );

  if (isCard) {
    return <div className="p-4 sm:p-10">{content}</div>;
  }

  return (
    <section id="faq" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-surface-page transition-colors">
      <div className="max-w-4xl mx-auto">{content}</div>
    </section>
  );
}