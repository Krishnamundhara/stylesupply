import Link from "next/link";

// --- Types ---
interface LinkItem {
  href: string;
  label: string;
}

interface SubSectionData {
  title: string;
  links: LinkItem[];
}

interface SectionData {
  sectionTitle: string;
  desktopOnly?: boolean;
  subSections: SubSectionData[];
}

// --- Data Configuration ---
const SITEMAP_DATA: SectionData[] = [
  {
    sectionTitle: "Navigate",
    desktopOnly: true,
    subSections: [
      {
        title: "Homepage",
        links: [
          { href: "/", label: "About Us" },
          { href: "/howitworks", label: "How It Works" },
          { href: "/browse", label: "Browse Products" },
          { href: "/brands", label: "Explore Brands" },
          { href: "/collections", label: "Explore Collections" },
        ],
      },
      {
        title: "About Us",
        links: [{ href: "/about", label: "About Us" }],
      },
      {
        title: "How It Works",
        links: [{ href: "/howitworks", label: "How it Works" }],
      },
      {
        title: "Favourites",
        links: [
          { href: "/wishlist", label: "All Favourites" },
          { href: "/closet", label: "Your Collections" },
        ],
      },
      {
        title: "Your Box",
        links: [{ href: "/box/my-box", label: "Your Box" }],
      },
      {
        title: "FAQs",
        links: [
          { href: "/faq", label: "General" },
          { href: "/faq#memberships", label: "Memberships" },
          { href: "/faq#shipping", label: "Shipping" },
          { href: "/faq#order-returns", label: "Order Returns" },
          { href: "/faq#cleaning-repair", label: "Cleaning & Repair" },
        ],
      },
    ],
  },
  {
    sectionTitle: "Products",
    subSections: [
      {
        title: "Browse All",
        links: [
          { href: "/browse?category=tops", label: "Tops" },
          { href: "/browse?category=bottoms", label: "Bottoms" },
          { href: "/browse?category=dresses", label: "Dresses" },
          { href: "/browse?category=jackets", label: "Jackets" },
          { href: "/browse?category=co-ord-sets", label: "Co-ord sets" },
          { href: "/browse?category=handbags", label: "Handbags" },
          { href: "/browse?category=jewellery", label: "Jewellery" },
        ],
      },
      {
        title: "Collections",
        links: [
          { href: "/collections/everyday-icons", label: "Everyday Icons" },
          { href: "/collections/daytime-soiree", label: "Daytime Soirée" },
          { href: "/collections/after-hours", label: "After Hours" },
        ],
      },
      {
        title: "Brands",
        links: [
          { href: "/brands/antithesis", label: "Antithesis" },
          { href: "/brands/arsenic-by-mehma-tibb", label: "Arsenic by Mehma Tibb" },
          { href: "/brands/behno-new-york", label: "Behno New York" },
          { href: "/brands/drama-club", label: "Drama Club" },
          { href: "/brands/fourty-four", label: "Fourty Four" },
          { href: "/brands/kichu-jaipur", label: "Kichu Jaipur" },
          { href: "/brands/knotgray", label: "KnotGray" },
          { href: "/brands/label-iam", label: "Label IAM" },
          { href: "/brands/mahima-sethiya", label: "Mahima Sethiya" },
        ],
      },
      {
        title: "Brands",
        links: [
          { href: "/brands/maison-9002", label: "Maison 9002" },
          { href: "/brands/miloni", label: "Miloni" },
          { href: "/brands/nadine-dhody", label: "Nadine Dhody" },
          { href: "/brands/saphed", label: "Saphed" },
          { href: "/brands/sirooh", label: "Sirooh" },
          { href: "/brands/knotgray", label: "KnotGray" },
          { href: "/brands/treasures-by-tiara", label: "Treasures by Tiara" },
          { href: "/brands/two-extra-lives", label: "Two Extra Lives" },
          { href: "/brands/valliyan", label: "Valliyan" },
        ],
      },
    ],
  },
  {
    sectionTitle: "Profile",
    subSections: [
      {
        title: "Account Settings",
        links: [
          { href: "/accounts", label: "My Profile" },
          { href: "/accounts/settings", label: "Change Password" },
          { href: "/accounts/membership", label: "Manage Subscription" },
          { href: "/login", label: "Log Out" },
        ],
      },
      {
        title: "My Profile",
        links: [
          { href: "/accounts", label: "Personal Info" },
          { href: "/accounts/settings", label: "Size & Measurement" },
          { href: "/accounts/settings", label: "Delivery Address" },
        ],
      },
      {
        title: "My Wardrobe",
        links: [{ href: "/accounts/wardrobe", label: "My Wardrobe" }],
      },
      {
        title: "My Reviews",
        links: [
          { href: "/accounts/reviews", label: "My Reviews" },
          { href: "/accounts/wardrobe/review", label: "Leave a Review" },
        ],
      },
      {
        title: "Manage Membership",
        links: [
          { href: "/accounts/membership", label: "Current Plan" },
          { href: "/accounts/membership", label: "Manage Membership" },
          { href: "/faq#memberships", label: "FAQs" },
        ],
      },
      {
        title: "Past Boxes",
        links: [
          { href: "/accounts/orders", label: "Past Orders" },
          { href: "/accounts/membership", label: "Manage Membership" },
        ],
      },
    ],
  },
  {
    sectionTitle: "Legal",
    desktopOnly: true,
    subSections: [
      {
        title: "Legal",
        links: [
          { href: "/privacy-policy", label: "Privacy Policy" },
          { href: "/your-privacy-choices", label: "Terms of Use" },
          { href: "/accessibility", label: "Accessibility Statement" },
        ],
      },
    ],
  },
  {
    sectionTitle: "Contact",
    desktopOnly: true,
    subSections: [
      {
        title: "Help Center",
        links: [
          { href: "/maq", label: "Contact Us" },
          { href: "mailto:hello@stylesupply.io", label: "Email Us" },
          { href: "/faq", label: "FAQs" },
        ],
      },
    ],
  },
];

// --- Sub-components ---

function SitemapLink({ href, label }: LinkItem) {
  return (
    <Link
      href={href}
      className="font-[var(--font-manrope)] text-[#25080a] md:text-[#7a021d] text-[15px] leading-[1.2] tracking-[-0.3px] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7a021d] rounded-sm"
    >
      {label}
    </Link>
  );
}

function SubSection({ data }: { data: SubSectionData }) {
  return (
    <div className="flex flex-col gap-5 w-[150px] shrink-0">
      <h3 className="font-semibold text-[#7a021d] md:text-black text-[16px] leading-[1.2] tracking-[-0.32px]">
        {data.title}
      </h3>
      <nav aria-label={data.title} className="flex flex-col gap-3">
        {data.links.map((link, idx) => (
          <SitemapLink key={idx} href={link.href} label={link.label} />
        ))}
      </nav>
    </div>
  );
}

function SitemapCard({ data }: { data: SectionData }) {
  return (
    <section
      className={`bg-[#f7f4ef] w-full px-3 md:px-5 py-5 ${
        data.desktopOnly ? "hidden md:block" : ""
      }`}
      aria-labelledby={`heading-${data.sectionTitle.toLowerCase()}`}
    >
      <div className="flex flex-col gap-[26px]">
        <h2
          id={`heading-${data.sectionTitle.toLowerCase()}`}
          className="font-[var(--font-manrope)] text-[#7a021d] md:text-black text-[28px] leading-[1.2] tracking-[-0.56px]"
        >
          {data.sectionTitle}
        </h2>
        <div className="flex flex-col md:flex-row md:flex-wrap gap-10 md:gap-16 items-start">
          {data.subSections.map((subSection, idx) => (
            <SubSection key={idx} data={subSection} />
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Main Page Component ---

export default function Sitemap() {
  return (
    <main className="w-full font-[var(--font-manrope)]">
      <header className="py-[70px] text-center">
        <h1 className="text-black text-[44px] md:text-[64px] font-normal leading-[1.2] tracking-[-2.2px] md:tracking-[-2.56px]">
          Sitemap
        </h1>
      </header>

      <div className="px-[15px] md:px-10 flex flex-col gap-2.5 pb-25 md:pb-30">
        {SITEMAP_DATA.map((section, idx) => (
          <SitemapCard key={idx} data={section} />
        ))}
      </div>
    </main>
  );
}