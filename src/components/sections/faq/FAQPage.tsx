"use client";

import { useState } from "react";
import { faqCategories, type FAQAnswer } from "./faqData";

// Default number of FAQ items shown before the user expands a category.
const VISIBLE_FAQ_LIMIT = 5;
// Shared color tokens used across this section.
const textColor = "text-black";
const primaryBg = "bg-[#7A021D]";

function Answer({ answer }: { answer: FAQAnswer }) {
  // Answers can be a single string or multiple lines; normalize to an array for rendering.
  const lines = Array.isArray(answer) ? answer : [answer];

  return (
    <p className={`min-h-0 font-[var(--font-manrope)] font-medium ${textColor} text-[3.333vw] md:text-[2.344vw] lg:text-[1.25vw] leading-[1.33] md:leading-[1.55] lg:leading-[1.5]`}>
      {lines.map((line, index) => (
        // Keep each line on its own row and add spacing after the first line.
        <span key={line} className={index > 0 ? "block mt-2" : "block"}>
          {line}
        </span>
      ))}
    </p>
  );
}

function ToggleIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <span className="flex-shrink-0 flex items-center justify-center" aria-hidden="true">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="w-[5.556vw] md:w-[24px] lg:w-[1.528vw] h-auto"
      >
        {!isOpen && (
          <line x1="12" y1="4" x2="12" y2="20" stroke="#7A021D" strokeWidth="1.8" strokeLinecap="round" />
        )}
        <line x1="4" y1="12" x2="20" y2="12" stroke="#7A021D" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function AccordionItem({
  question,
  answer,
  isOpen,
  isLast,
  onToggle,
}: {
  question: string;
  answer: FAQAnswer;
  isOpen: boolean;
  isLast: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex flex-col">
      <button
        // Single click toggles only this question item.
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 text-left"
        aria-expanded={isOpen}
      >
        <span className={`font-[var(--font-manrope)] font-semibold ${textColor} text-[4.444vw] md:text-[3.125vw] lg:text-[1.667vw] leading-[1.4] md:leading-[1.45] lg:leading-[1.67] tracking-[-0.02em] pr-2 transition-colors duration-300`}>
          {question}
        </span>
        <ToggleIcon isOpen={isOpen} />
      </button>

      <div
        // Grid row animation gives smooth open/close behavior without measuring height in JS.
        className={`grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isOpen
            ? "grid-rows-[1fr] opacity-100 mt-[4.167vw] lg:mt-[12px]"
            : "grid-rows-[0fr] opacity-0 mt-0"
        }`}
      >
        <Answer answer={answer} />
      </div>

      {/* Divider is hidden for the final item to avoid trailing line at the bottom. */}
      {!isLast && <div className="mt-[4.167vw] lg:mt-[20px] h-px bg-[#C0C0C0]" />}
    </div>
  );
}

export default function FAQPage() {
  // Currently selected top-level FAQ category tab.
  const [activeNav, setActiveNav] = useState<string>(faqCategories[0].id);
  // Tracks one open accordion item per active category view.
  const [openItem, setOpenItem] = useState<string | null>(null);
  // Persist expanded/collapsed state per category when switching tabs.
  const [expandedTabs, setExpandedTabs] = useState<Set<string>>(new Set());

  // Guard against missing category IDs by falling back to the first category.
  const activeCategory =
    faqCategories.find((category) => category.id === activeNav) ?? faqCategories[0];
  // Determine whether this category is currently expanded.
  const isExpanded = expandedTabs.has(activeCategory.id);
  // Render either a preview list or the full category list.
  const visibleFaqs = isExpanded
    ? activeCategory.faqs
    : activeCategory.faqs.slice(0, VISIBLE_FAQ_LIMIT);
  // Show the expand/collapse CTA only when there are hidden items.
  const hasMore = activeCategory.faqs.length > VISIBLE_FAQ_LIMIT;

  const toggleExpanded = () => {
    // Clone Set to keep state updates immutable and trigger re-render reliably.
    setExpandedTabs((current) => {
      const next = new Set(current);
      if (next.has(activeCategory.id)) next.delete(activeCategory.id);
      else next.add(activeCategory.id);
      return next;
    });
  };

  return (
    <div className="mx-auto w-full max-w-360 px-[4.444vw] md:px-[48px] lg:px-[2.778vw]">
      <div className="mt-[8.333vw] md:mt-[3.906vw] lg:mt-[4.861vw]">
        <h1 className={`mx-auto max-w-[760px] md:max-w-none font-[var(--font-manrope)] font-normal ${textColor} text-center text-[9.444vw] md:text-[5.859vw] lg:text-[5.139vw] leading-[110%] tracking-[-0.05em]`}>
          Frequently Asked Questions
        </h1>

        <div className="mt-[8.333vw] md:mt-[3.906vw] lg:mt-[4.861vw] relative">
          <div className="flex gap-[9.722vw] md:gap-0 md:justify-between overflow-x-auto scrollbar-hide w-full">
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveNav(category.id)}
                className={`relative pb-[4.167vw] md:pb-[1.953vw] lg:pb-[1.042vw] font-[var(--font-manrope)] text-[3.889vw] md:text-[1.823vw] lg:text-[1.25vw] tracking-[-0.04em] whitespace-nowrap transition-colors duration-200 ${
                  activeNav === category.id
                    ? "font-medium text-[#6b0b23]"
                    : "font-medium text-black"
                }`}
              >
                {category.label}
                {activeNav === category.id && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#6b0b23]" />
                )}
              </button>
            ))}
          </div>
          <div className="h-px bg-black" />
        </div>
      </div>

      <div className="mt-[20px] md:mt-[32px] lg:mt-[40px]">
        <div className="mt-[8.333vw] md:mt-[26px] lg:mt-[30px] flex flex-col gap-[12px] md:gap-[18px] lg:gap-[20px]">
          {visibleFaqs.map((faq, index) => {
            // Compose a stable key tied to both category and item position.
            const itemKey = `${activeCategory.id}-${index}`;

            return (
              <AccordionItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                isOpen={openItem === itemKey}
                isLast={index === visibleFaqs.length - 1}
                onToggle={() =>
                  // Behaves like an accordion: clicking open item closes it, otherwise open new one.
                  setOpenItem((current) => (current === itemKey ? null : itemKey))
                }
              />
            );
          })}
        </div>

        {hasMore && (
          <div className="mt-[8.333vw] md:mt-[5.208vw] lg:mt-[2.778vw]">
            <button
              // Toggle between preview list and full list for the active category.
              onClick={toggleExpanded}
              className={`w-[55.556vw] md:w-[20.833vw] lg:w-[16.667vw] h-[16.667vw] md:h-[7.813vw] lg:h-[5.556vw] rounded-[40px] ${primaryBg} text-white font-[var(--font-manrope)] font-semibold text-[3.889vw] md:text-[1.823vw] lg:text-[1.389vw] leading-[1.1] tracking-[-0.02em] transition-colors duration-200`}
            >
              {isExpanded ? "Show Less" : "See All"}
            </button>
          </div>
        )}
      </div>
      <div className="h-[27.778vw] md:h-[13.021vw] lg:h-[8.333vw]" />
    </div>
  );
}
