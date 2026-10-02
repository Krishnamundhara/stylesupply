"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ReviewProduct {
  id: string;
  image: string;
  brand: string;
  productName: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const LOVE_TAGS = [
  "Fits like a glove",
  "Unique discovery",
  "Value for money",
  "Suits my style",
  "Premium feel",
  "Other",
];

const DISLIKE_TAGS = [
  "Not comfortable",
  "Hard to style",
  "Faded after wash",
  "High maintenance",
  "Fit changed",
  "Other",
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function HeartRating({
  rating,
  onChange,
}: {
  rating: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center gap-[2.5vw] md:gap-[1.172vw] lg:gap-[0.625vw]">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          aria-label={`Rate ${i} out of 5`}
          className="shrink-0"
        >
          <svg
            viewBox="0 0 42 42"
            fill={i <= rating ? "#7a021d" : "none"}
            stroke="#7a021d"
            strokeWidth="2.5"
            className="w-[11.667vw] h-[11.667vw] md:w-[5.469vw] md:h-[5.469vw] lg:w-[2.917vw] lg:h-[2.917vw]"
            aria-hidden
          >
            <path d="M21 36s-16-9.8-16-21a9 9 0 0 1 16-5.66A9 9 0 0 1 37 15c0 11.2-16 21-16 21z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

function YesNoToggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      className="relative flex rounded-full p-[3px] shrink-0"
      style={{ backgroundColor: "#fbf4ed", width: "10.417vw", height: "3.472vw" }}
      role="group"
      aria-label="Share review publicly"
    >
      {/* sliding pill */}
      <div
        className="absolute top-[3px] bottom-[3px] rounded-full transition-transform duration-300 ease-out"
        style={{
          width: "calc(50% - 3px)",
          backgroundColor: "#7a021d",
          transform: value ? "translateX(0)" : "translateX(100%)",
        }}
      />
      <button
        type="button"
        onClick={() => onChange(true)}
        className="relative z-[1] flex flex-1 items-center justify-center rounded-full font-semibold tracking-[-0.04em] transition-colors duration-300 text-[0.972vw]"
        style={{ color: value ? "#fff" : "#7a021d" }}
      >
        Yes
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className="relative z-[1] flex flex-1 items-center justify-center rounded-full font-semibold tracking-[-0.04em] transition-colors duration-300 text-[0.972vw]"
        style={{ color: !value ? "#fff" : "#7a021d" }}
      >
        No
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function WriteReviewContent({
  product,
  productId,
}: {
  product?: ReviewProduct;
  productId?: string;
}) {
  const [rating, setRating] = useState(4);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [sharePublicly, setSharePublicly] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [fetchedProduct, setFetchedProduct] = useState<ReviewProduct | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const updateThumb = () => {
    const el = textareaRef.current;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!el || !track || !thumb) return;
    const ratio = el.clientHeight / el.scrollHeight;
    track.style.display = ratio >= 1 ? "none" : "block";
    thumb.style.height = `${ratio * 100}%`;
    thumb.style.top = `${(el.scrollTop / el.scrollHeight) * 100}%`;
  };

  const onThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = textareaRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    const startY = e.clientY;
    const startScrollTop = el.scrollTop;
    const trackHeight = track.clientHeight;

    const onMouseMove = (ev: MouseEvent) => {
      const delta = ev.clientY - startY;
      const scrollRatio = el.scrollHeight / trackHeight;
      el.scrollTop = startScrollTop + delta * scrollRatio;
      updateThumb();
    };
    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const isPositive = rating >= 3;
  const tags = isPositive ? LOVE_TAGS : DISLIKE_TAGS;
  const tagsLabel = isPositive ? "What did you love?" : "What didn't you love?";

  // Reset tags when sentiment flips
  useEffect(() => {
    setSelectedTags([]);
  }, [isPositive]);

  // Fetch product by id when productId is provided
  useEffect(() => {
    if (!productId || product) return;
    import("@/services/orders").then(({ ordersApi }) => {
      ordersApi.list().then(({ orders }) => {
        const order = orders.find((o) => o.id === productId);
        if (order) {
          setFetchedProduct({
            id: order.id,
            image: order.product?.thumbnail_url ?? "/images/individual_Collectionlanding/image 814.png",
            brand: order.product?.brand ?? "Unknown Brand",
            productName: order.product?.name ?? "Unknown Product",
          });
        }
      }).catch(() => {});
    });
  }, [productId, product]);

  const prod = product ?? fetchedProduct ?? {
    id: productId ?? "1",
    image: "/images/individual_Collectionlanding/image 814.png",
    brand: "Two Extra Lives",
    productName: "Baobab Dress",
  };

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPhotos((prev) => [...prev, ...urls]);
    e.target.value = "";
  };

  return (
    <div className="w-full font-[var(--font-manrope)] px-[2.778vw] md:px-0">

      {/* ── Page heading ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center text-center pt-[8.333vw] md:pt-[3.906vw] lg:pt-[4.861vw] pb-[8.333vw] md:pb-[5.208vw] lg:pb-[2.778vw]">
        <h1 className="font-normal leading-[1.2] tracking-[-0.04em] text-black text-[12.222vw] md:text-[7.813vw] lg:text-[5.139vw]">
          Write a Review
        </h1>
        <p className="mt-[4.167vw] md:mt-[1.563vw] lg:mt-3 font-medium text-black tracking-[-0.04em] leading-[1.4] text-[4.167vw] md:text-[1.953vw] lg:text-[max(18px,1.042vw)] text-center w-[72.222vw] md:w-auto">
          <span className="md:hidden">You&apos;ve used and loved this item.<br />Rate your item and show us how it<br />looks on you.</span>
          <span className="hidden md:inline">You kept this item with intention.<br />Rate your item and show us how it looks on you.</span>
        </p>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:justify-center md:items-start md:gap-[5.208vw] lg:gap-16">

        {/* ── Product image ─────────────────────────────────────────────────── */}
        <div className="flex flex-col md:w-[25vw] lg:w-[18.056vw] shrink-0">
          <div className="relative w-full h-[83.333vw] md:w-[25vw] md:h-[29.948vw] lg:w-[18.056vw] lg:h-[21.528vw] overflow-hidden bg-black">
            <Image
              src={prod.image}
              alt={prod.productName}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1023px) 95vw, 260px"
              unoptimized
            />
          </div>

          {/* Brand + name — below image */}
          <div className="flex flex-col gap-[2vw] md:gap-[0.781vw] lg:gap-[0.556vw] mt-[4.167vw] md:mt-[1.563vw] lg:mt-[1.389vw]">
            <p className="font-medium text-[#4e4e4e] tracking-[-0.04em] uppercase text-[3.889vw] md:text-[1.563vw] lg:text-[0.972vw] leading-[1.1]">
              {prod.brand}
            </p>
            <p className="font-semibold text-black tracking-[-0.04em] capitalize text-[5vw] md:text-[2.344vw] lg:text-[1.25vw] leading-[1.1]">
              {prod.productName}
            </p>
          </div>
        </div>

        {/* ── Form ──────────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-[8.333vw] md:gap-[3.906vw] lg:gap-[2.083vw] mt-[8.333vw] md:mt-0 md:w-[37.5vw] lg:w-[29.167vw]">

          {/* Rate your item */}
          <div className="flex flex-col gap-[4.167vw] md:gap-[2.344vw] lg:gap-[1.25vw]">
            <p className="font-medium text-black tracking-[-0.04em] text-[4.444vw] md:text-[2.083vw] lg:text-[1.111vw] leading-[1.1]">
              Rate your item
            </p>
            <HeartRating rating={rating} onChange={setRating} />
          </div>

          {/* Add your photos */}
          <div className="flex flex-col gap-[4.167vw] md:gap-[1.953vw] lg:gap-[1.042vw]">
            <p className="font-medium text-black tracking-[-0.04em] text-[4.444vw] md:text-[2.083vw] lg:text-[1.111vw] leading-[1.1]">
              Add your photos
            </p>

            {/* Show uploaded photo thumbnails when photos exist */}
            {photos.length > 0 && (
              <div className="flex gap-[1.389vw] md:gap-[0.651vw] lg:gap-[0.347vw] flex-wrap">
                {photos.map((src, i) => (
                  <div key={i} className="relative w-[28.611vw] h-[38.333vw] md:w-[13.411vw] md:h-[17.969vw] lg:w-[7.153vw] lg:h-[9.583vw] overflow-hidden shrink-0">
                    <Image src={src} alt={`Uploaded photo ${i + 1}`} fill className="object-cover" unoptimized />
                    <button
                      type="button"
                      onClick={() => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                      aria-label="Remove photo"
                      className="absolute top-1 right-1"
                    >
                      <img src="/icon/remove.svg" alt="" className="w-[5.556vw] h-[5.556vw] md:w-[2.604vw] md:h-[2.604vw] lg:w-[1.389vw] lg:h-[1.389vw]" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />

            {photos.length === 0 ? (
              /* No photos yet — filled Upload button */
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center justify-center rounded-full bg-[#7a021d] font-semibold text-white tracking-[-0.04em] w-[55.556vw] h-[16.667vw] text-[3.889vw] md:w-[26.042vw] md:h-[7.813vw] md:text-[1.823vw] lg:w-[16.667vw] lg:h-[5.556vw] lg:text-[1.389vw]"
              >
                Upload
              </button>
            ) : (
              /* Photos uploaded — outlined Add More button */
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center justify-center rounded-full border border-[#7a021d] text-[#7a021d] font-semibold tracking-[-0.04em] w-[55.556vw] h-[16.667vw] text-[3.889vw] md:w-[26.042vw] md:h-[7.813vw] md:text-[1.823vw] lg:w-[16.667vw] lg:h-[5.556vw] lg:text-[1.389vw]"
              >
                Add More
              </button>
            )}
          </div>

          {/* Tags — label + options change based on rating */}
          <div className="flex flex-col gap-[4.167vw] md:gap-[2.344vw] lg:gap-[1.25vw]">
            <p className="font-medium text-black tracking-[-0.04em] text-[4.444vw] md:text-[2.083vw] lg:text-[1.111vw] leading-[1.1]">
              {tagsLabel}
            </p>
            <div className="flex flex-wrap justify-center gap-[2.778vw] md:grid md:grid-cols-2 md:justify-items-start md:gap-[1.302vw] lg:gap-[0.694vw]">
              {tags.map((tag) => {
                const isActive = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={
                      "inline-flex items-center justify-center rounded-full border border-[#7a021d] font-semibold tracking-[-0.04em] text-[3.889vw] md:text-[1.823vw] lg:text-[1.389vw] w-[38.889vw] h-[16.667vw] md:w-full md:h-[7.813vw] lg:w-[13.889vw] lg:h-[5.556vw] " +
                      (isActive ? "bg-[#7a021d] text-white" : "bg-white text-[#7a021d]")
                    }
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Write a detailed review */}
          <div className="flex flex-col gap-[2.778vw] md:gap-[1.563vw] lg:gap-[1.25vw]">
            <p className="font-medium text-black tracking-[-0.04em] text-[4.444vw] md:text-[2.083vw] lg:text-[1.111vw] leading-[1.1]">
              Write a detailed review
            </p>
            <div className="border-b-2 border-[#7a021d] w-full pb-[2.778vw] md:pb-[1.563vw] lg:pb-[0.833vw] flex gap-2">
              <textarea
                ref={textareaRef}
                value={reviewText}
                onChange={(e) => { setReviewText(e.target.value); updateThumb(); }}
                onScroll={updateThumb}
                onWheel={(e) => e.stopPropagation()}
                placeholder="Write a detailed review..."
                rows={3}
                className="flex-1 bg-transparent resize-none outline-none font-medium text-black placeholder:text-[#a0a0a0] tracking-[-0.04em] text-[4.167vw] md:text-[1.953vw] lg:text-[1.042vw] leading-[1.6] overflow-y-auto"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none", overscrollBehavior: "contain" } as React.CSSProperties}
              />
              {/* Custom draggable scrollbar */}
              <div ref={trackRef} style={{ display: "none" }} className="relative w-[0.278vw] shrink-0 bg-[#f2f2f2]">
                <div
                  ref={thumbRef}
                  onMouseDown={onThumbMouseDown}
                  className="absolute left-0 right-0 top-0 bg-[#7a021d] cursor-grab active:cursor-grabbing"
                  style={{ height: "30%" }}
                />
              </div>
            </div>
          </div>

          {/* Share review publicly */}
          <div className="flex items-center justify-between md:justify-start md:gap-[3.125vw] lg:gap-[4vw]">
            <p className="font-medium text-black tracking-[-0.04em] text-[4.444vw] md:text-[2.083vw] lg:text-[1.111vw] leading-[1.1]">
              Share review publicly
            </p>
            {/* Mobile + tablet toggle */}
            <div
              className="relative flex rounded-full p-[3px] shrink-0 lg:hidden bg-[#fbf4ed] w-[21.667vw] h-[9.167vw] md:w-[10.417vw] md:h-[3.906vw]"
              role="group"
            >
              <div
                className="absolute top-[3px] bottom-[3px] rounded-full transition-transform duration-300 ease-out bg-[#7a021d]"
                style={{
                  width: "calc(50% - 3px)",
                  transform: sharePublicly ? "translateX(0)" : "translateX(100%)",
                }}
              />
              <button type="button" onClick={() => setSharePublicly(true)}
                className="relative z-[1] flex flex-1 items-center justify-center rounded-full font-semibold tracking-[-0.04em] transition-colors duration-300 text-[3vw] md:text-[1.302vw]"
                style={{ color: sharePublicly ? "#fff" : "#7a021d" }}>Yes</button>
              <button type="button" onClick={() => setSharePublicly(false)}
                className="relative z-[1] flex flex-1 items-center justify-center rounded-full font-semibold tracking-[-0.04em] transition-colors duration-300 text-[3vw] md:text-[1.302vw]"
                style={{ color: !sharePublicly ? "#fff" : "#7a021d" }}>No</button>
            </div>
            {/* Desktop toggle */}
            <div className="hidden lg:block">
              <YesNoToggle value={sharePublicly} onChange={setSharePublicly} />
            </div>
          </div>

        </div>
      </div>

      {/* ── Submit CTA ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-center mt-[10vw] md:mt-[5.208vw] lg:mt-[3.333vw]">
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          className={
            "inline-flex items-center justify-center rounded-full font-semibold tracking-[-0.04em] border border-[#7a021d] w-[55.556vw] h-[16.667vw] text-[3.889vw] md:w-[26.042vw] md:h-[7.813vw] md:text-[1.823vw] lg:w-[16.667vw] lg:h-[5.556vw] lg:text-[1.389vw] " +
            (submitted ? "bg-[#7a021d] text-white" : selectedTags.length > 0 ? "bg-[#7a021d] text-white" : "bg-white text-[#7a021d]")
          }
        >
          Submit
        </button>
      </div>
      <div className="h-[27.778vw] md:h-[13.021vw] lg:h-[8.333vw]" />

    </div>
  );
}
