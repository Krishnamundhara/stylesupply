"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { customColourSlug } from "@/lib/url";
import type { ColourGroup } from "@/types/product";

interface Props {
  colours: ColourGroup[];
  activeSlug: string;
  mobile?: boolean;
}

export default function ColourSwatchRow({ colours, activeSlug, mobile }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (colours.length <= 1) return null;

  function selectColour(group: ColourGroup) {
    const params = new URLSearchParams(searchParams.toString());
    const slug = group.hex ? group.slug : customColourSlug(group.custom_colour ?? group.name);
    params.set("colour", slug);
    router.replace(`${pathname}?${params.toString()}`);
  }

  const dotSize = mobile ? "size-[28px]" : "size-[1.667vw]";
  const labelChip = mobile ? "h-[28px] px-[10px]" : "h-[1.667vw] px-[0.6vw]";

  return (
    <div className={`flex flex-wrap items-center ${mobile ? "gap-[10px]" : "gap-[0.7vw]"}`}>
      {colours.map((c) => {
        const slug = c.hex ? c.slug : customColourSlug(c.custom_colour ?? c.name);
        const isActive = slug === activeSlug;
        if (c.hex) {
          return (
            <button
              key={slug}
              type="button"
              aria-label={c.name}
              aria-pressed={isActive}
              onClick={() => selectColour(c)}
              className={`${dotSize} rounded-full border transition-colors ${isActive ? "border-black border-2" : "border-[#E5E5E5]"}`}
              style={{ backgroundColor: c.hex }}
            />
          );
        }
        return (
          <button
            key={slug}
            type="button"
            aria-label={c.custom_colour ?? c.name}
            aria-pressed={isActive}
            onClick={() => selectColour(c)}
            className={`flex items-center justify-center rounded-full border ${labelChip} text-[12px] font-medium tracking-[-0.02em] transition-colors ${isActive ? "border-black bg-black text-white" : "border-[#E5E5E5] text-black"}`}
          >
            {c.custom_colour ?? c.name}
          </button>
        );
      })}
    </div>
  );
}
