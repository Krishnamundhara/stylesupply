export type FAQAnswer = string | readonly string[];

export type FAQCategory = {
  id: string;
  label: string;
  faqs: readonly {
    question: string;
    answer: FAQAnswer;
  }[];
};

export const faqCategories = [
  {
    id: "general",
    label: "General",
    faqs: [
      {
        question: "What is Style Supply?",
        answer:
          "Style Supply is a subscription-based, try-at-home discovery platform for premium fashion. You pay ₹5,000 per month, curate a box of up to 5 designer pieces on our platform, and we deliver them to your door within 24 hours. Try everything at home for up to 48 hours — keep what you love, and we collect the rest. Your subscription fee is a fully redeemable fashion credit that applies to anything you decide to purchase.",
      },
      {
        question: "Do I have to commit to a long-term plan?",
        answer:
          "No. Style Supply is a monthly subscription with no long-term commitment. You can pause or cancel anytime through your account settings.",
      },
      {
        question: "Can I pause or cancel my membership?",
        answer:
          "Yes. You can pause or cancel your subscription at any time directly from your account. If you have unused credit at the time of cancellation, it will remain available for 30 days in case you reactivate.",
      },
      {
        question: "Who is Style Supply for?",
        answer:
          "Style Supply is for women who care about what they wear but don't have the time to go looking for it. Women who value quality, trust their own taste, and would rather try something at home than spend an afternoon in a store. Membership is currently by invitation only.",
      },
      {
        question: "How much does it cost?",
        answer:
          "₹5,000 per month. This is not a fee — it's a fashion credit. The full ₹5,000 is applied to the purchase price of any piece you choose to keep. You only pay the difference between the item's retail price and your credit.",
      },
      {
        question: "Is my order discreet and private?",
        answer:
          "Yes. All deliveries arrive in unbranded, neutral packaging. Your order details are never shared, and our delivery partners are trained to respect your privacy at every step.",
      },
    ],
  },
  {
    id: "memberships",
    label: "Memberships",
    faqs: [
      {
        question: "How does the ₹5,000 fashion credit work?",
        answer:
          "Your monthly subscription of ₹5,000 is a fully redeemable fashion credit. When you decide to keep a piece, the ₹5,000 is applied directly to the purchase price — you only pay the difference. For example, if you keep a dress priced at ₹18,000, you pay ₹13,000 at checkout.",
      },
      {
        question: "What if I don't keep anything from my box?",
        answer:
          "That's completely fine — there's no obligation to buy. Your ₹5,000 credit carries forward and can be redeemed against purchases in a future box. Carried-forward credit is valid for 60 days — after which it expires if no purchase is made. The credit cannot be used to pay for subscription fees or cashed out. Think of it as a running balance that's waiting for the right piece — but don't let it sit too long.",
      },
      {
        question: "Can I use my credit to pay for my next month's subscription?",
        answer:
          "No. The fashion credit is exclusively redeemable against purchases — the pieces you choose to keep. It cannot be applied to subscription fees, transferred to someone else, or cashed out. Each month's subscription generates a new credit that adds to any existing balance.",
      },
      {
        question: "Are the pieces discounted?",
        answer:
          "Pieces on Style Supply are offered at their retail price or the lowest price available on the market — whichever is better for you. We don't run special discounts or flash sales, but we also ensure our prices are never higher than what you'd find on other platforms. Your ₹5,000 credit effectively acts as your benefit on top of that.",
      },
      {
        question: "Are there any hidden charges?",
        answer:
          "No. Your subscription is ₹5,000/month. Delivery and returns are free. Garment care is handled by us. All applicable taxes are included. There are no surprise fees. If you keep a piece, you pay the retail price minus your credit — that's it.",
      },
    ],
  },
  {
    id: "shipping",
    label: "Shipping",
    faqs: [
      {
        question: "How fast is delivery?",
        answer:
          "Within 24 hours of confirming your box. Traditional premium fashion platforms take 7–10 days. We pick up directly from brand stores in your city and deliver the same day or next morning. Speed is a core part of the Style Supply experience.",
      },
      {
        question: "How do returns work?",
        answer:
          "Once you've made your decisions in the app, we schedule a pickup from your location within 24 hours. You don't need to wash, clean, or repackage anything. Just leave the items in the box they arrived in and we handle the rest.",
      },
      {
        question: "Do I need to clean items before returning them?",
        answer:
          "No. We handle all garment care professionally — cleaning, pressing, and quality inspection. Just return items as they are.",
      },
      {
        question: "Which cities do you deliver to?",
        answer:
          "We're currently live in Mumbai. Want Style Supply in your city? Drop us a note at support@stylesupply.io — your interest helps us decide where to go next.",
      },
      {
        question: "Can I choose a delivery window?",
        answer:
          "Yes. When confirming your box, you can select a preferred delivery window. We offer morning and evening slots to fit your schedule.",
      },
    ],
  },
  {
    id: "returns",
    label: "Order Returns",
    faqs: [
      {
        question: "How does the try-at-home experience work?",
        answer: [
          "Step 1: Subscribe at ₹5,000/month (your redeemable fashion credit).",
          "Step 2: Browse our curated platform and select up to 5 premium pieces into your box.",
          "Step 3: We deliver your box within 24 hours.",
          "Step 4: Try everything at home — in your own space, with your own wardrobe, on your own time.",
          "Step 5: Keep what you love (your ₹5,000 credit is applied to the purchase). We collect everything else within 24 hours of your decision.",
        ],
      },
      {
        question: "How long do I have to decide?",
        answer:
          "You have 48 hours from delivery to try your pieces and decide what to keep. When you're ready, open the app, mark your choices, and we'll pick up returns within 24 hours.",
      },
      {
        question: "What happens if I keep items longer than 48 hours?",
        answer:
          "To keep the closet flowing smoothly for all members, items held beyond the 48-hour trial window are subject to an additional ₹500 per day. This amount is not redeemable against purchases. We send you a reminder before the window closes so you have time to make your decisions comfortably.",
      },
      {
        question: "How many pieces can I try at a time?",
        answer:
          "Each box holds up to 5 pieces. You choose exactly what goes in your box — it's not a surprise. You browse, you select, you try.",
      },
      {
        question: "Can I order another box in the same month?",
        answer:
          "Yes — once you've returned your current box, you're welcome to curate another one immediately. Your ₹5,000 subscription is an auto-debit that stays consistent each month. If you'd like additional boxes beyond what your subscription covers, you can make a payment and order as many as you like. The only rule: you can have a maximum of 5 items at home at any given time.",
      },
    ],
  },
  {
    id: "quality",
    label: "Cleaning & Repair",
    faqs: [
      {
        question: "Are the pieces new?",
        answer:
          "We aim to deliver every piece in the best possible condition. Items are sourced directly from brand stores and are carefully inspected before reaching you to ensure they meet our quality standards. In some cases, a piece may have been previously tried on—much like garments in a premium boutique. Every piece is professionally cleaned, pressed, and quality-inspected before it reaches you. If a garment doesn't meet our standards, it's removed from circulation.",
      },
      {
        question: "How do you ensure hygiene?",
        answer:
          "Every garment is professionally cleaned and sanitised after each try-on cycle using specialised garment care services. Items are then inspected against our quality standards before being made available again. This is the same level of care used in luxury fashion shoots and high-end retail.",
      },
      {
        question: "What if something doesn't fit?",
        answer:
          "That's exactly why try-at-home exists. If something doesn't fit, simply mark it as a return in the app — no questions asked. Over time, our platform learns your size preferences and improves recommendations so your boxes get more accurate with every cycle.",
      },
      {
        question: "What happens if I accidentally damage a piece?",
        answer:
          "Normal try-on wear is expected and fully covered — don't worry about it. In rare cases of significant damage, our insurance covers the garment or we may charge you on a case-by-case basis depending on the nature and extent of the damage. We review each situation fairly, and our team will always communicate with you before any charge is applied.",
      },
      {
        question: "What happens in case of loss or theft?",
        answer:
          "You're covered. In the event of loss or theft, contact our support team at support@stylesupply.io as soon as possible. You'll need to file an FIR (First Information Report) on the item, and we will handle the rest through our insurance partner. You won't be left dealing with it alone.",
      },
    ],
  },
] as const satisfies readonly FAQCategory[];
