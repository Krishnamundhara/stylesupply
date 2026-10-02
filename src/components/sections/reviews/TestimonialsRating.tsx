import Image from "next/image";

const PHOTOS = [
  "/image/image 1066.png",
  "/image/image 1067.png",
  "/image/image 1053.png",
  "/image/image 1068-2.png",
  "/image/image 1334.jpg",
  "/image/image 1066.png",
  "/image/image 1067.png",
  "/image/image 1053.png",
];

function Star({ filled, size = 22 }: { filled: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#6B0B23" : "none"} stroke="#6B0B23" strokeWidth="1.5">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

const FIT_BARS = [
  { label: "Runs Small (3)",    widthMobile: "36px",  widthDesktop: "14%", color: "#D29F87" },
  { label: "True to Size (18)", widthMobile: "177px", widthDesktop: "65%", color: "#6B0B23" },
  { label: "Runs Large (2)",    widthMobile: "25px",  widthDesktop: "10%", color: "#EAE2DF" },
];

export default function TestimonialsRating() {
  return (
    <section className="px-5 lg:px-[45px]">
      <h2 className="font-[var(--font-manrope)] font-medium text-[20px] lg:text-[28px] text-black tracking-[-0.04em] mb-4 lg:mb-6">
        Product Ratings
      </h2>

      <div className="bg-[#F7F4EF] rounded-[24px] p-5 lg:p-8">

        {/* ── MOBILE layout ── */}
        <div className="flex flex-col gap-5 lg:hidden">

          {/* Row 1: product info (left) + score (right) */}
          <div className="flex items-start justify-between gap-3">
            {/* Product info */}
            <div className="flex items-start gap-3">
              {/* White card behind product image */}
              <div className="relative bg-white rounded-[15px] w-[131px] h-[159px] flex items-center justify-center shrink-0">
                <div className="relative w-[97px] h-[98px]">
                  <Image src="/image/image 1069.png" alt="Product" fill className="object-contain" sizes="97px" />
                </div>
              </div>
              <div className="flex flex-col gap-1 pt-1">
                <p className="font-[var(--font-manrope)] font-bold text-[16px] text-black tracking-[-0.03em]">A.L.C.</p>
                <p className="font-[var(--font-manrope)] font-medium text-[14px] text-black leading-[1.2] tracking-[-0.02em] w-[131px]">Julie Striped Mini Dress</p>
              </div>
            </div>

            {/* Score + stars */}
            <div className="flex flex-col items-end shrink-0 pt-1">
              <span className="font-[var(--font-manrope)] font-semibold text-[58px] leading-none text-black tracking-[-0.1em]">4.0</span>
              <div className="flex gap-[3px] mt-1">
                {[1,2,3,4,5].map(i => <Star key={i} filled={i <= 4} size={11} />)}
              </div>
            </div>
          </div>

          {/* Row 2: Fit Ratings */}
          <div className="flex flex-col gap-3">
            <p className="font-[var(--font-manrope)] font-medium text-[17px] text-black tracking-[-0.02em]">Fit Ratings</p>
            <div className="flex flex-col gap-[10px]">
              {FIT_BARS.map(({ label, widthMobile, color }) => (
                <div key={label} className="flex items-center gap-3 justify-between w-full">
                  <div
                    className="h-[9px] rounded-[3px] shrink-0"
                    style={{ width: widthMobile, backgroundColor: color }}
                  />
                  <div className="flex items-center gap-[5px]">
                    <span className="w-[7px] h-[7px] rounded-full shrink-0" style={{ backgroundColor: color === "#EAE2DF" ? "#C8BFB9" : color }} />
                    <span className="font-[var(--font-manrope)] font-medium text-[11px] text-black tracking-[-0.02em] whitespace-nowrap">{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 3: All Pictures */}
          <div className="flex flex-col gap-3">
            <p className="font-[var(--font-manrope)] font-medium text-[16px] text-black tracking-[-0.02em]">All Pictures</p>
            <div className="flex gap-[12px] overflow-x-auto scrollbar-hide pb-1">
              {PHOTOS.slice(0, 4).map((src, i) => (
                <div key={i} className="relative w-[90px] h-[123px] rounded-[14px] overflow-hidden bg-[#D9D9D9] shrink-0">
                  <Image src={src} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="90px" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── DESKTOP layout ── */}
        <div className="hidden lg:flex gap-0">

          {/* Left — Product Info */}
          <div className="flex items-start gap-4 w-[260px] shrink-0">
            <div className="relative w-[100px] h-[130px] rounded-[12px] overflow-hidden bg-[#E8E0DA] shrink-0">
              <Image src="/image/image 1066.png" alt="Product" fill className="object-cover" sizes="100px" />
            </div>
            <div className="flex flex-col gap-1 pt-1">
              <p className="font-[var(--font-manrope)] font-bold text-[22px] text-black tracking-[-0.02em]">A.L.C.</p>
              <p className="font-[var(--font-manrope)] font-medium text-[15px] text-black leading-[1.3]">Julie Striped Mini Dress</p>
              <div className="flex gap-[3px] mt-2">
                {[1,2,3,4,5].map(i => <Star key={i} filled={i <= 4} size={22} />)}
              </div>
            </div>
          </div>

          {/* Center — Score + Fit Ratings */}
          <div className="flex-1 px-8 border-x border-black/10">
            <div className="flex items-end gap-3 mb-5">
              <span className="font-[var(--font-manrope)] font-medium text-[120px] leading-none text-black tracking-[-0.06em]">4.0</span>
              <div className="flex gap-[3px] pb-3">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} width="24" height="24" viewBox="0 0 24 24" fill={i <= 4 ? "#6B0B23" : "none"} stroke="#6B0B23" strokeWidth="1.5">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="font-[var(--font-manrope)] font-medium text-[20px] text-black tracking-[-0.02em] mb-4">Fit Ratings</p>
            <div className="flex flex-col gap-[14px]">
              {FIT_BARS.map(({ label, widthDesktop, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="h-[10px] rounded-[4px] shrink-0" style={{ width: widthDesktop, backgroundColor: color, minWidth: "24px" }} />
                  <span className="font-[var(--font-manrope)] font-medium text-[14px] text-black tracking-[-0.02em] whitespace-nowrap">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — All Pictures */}
          <div className="w-[340px] shrink-0 pl-8">
            <p className="font-[var(--font-manrope)] font-medium text-[18px] text-black tracking-[-0.02em] mb-4">All Pictures</p>
            <div className="grid grid-cols-4 gap-[13px]">
              {PHOTOS.slice(0, 8).map((src, i) => (
                <div key={i} className="relative aspect-[3/4] rounded-[12px] overflow-hidden bg-[#D9D9D9]">
                  <Image src={src} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="80px" />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
