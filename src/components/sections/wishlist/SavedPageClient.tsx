"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

type Collection = {
  id: string;
  name: string;
  count: number;
  images: string[];
};

type SavedPageClientProps = {
  initialCollections?: Collection[];
};

function CollectionImageGrid({ images }: { images: string[] }) {
  if (images.length === 0) return null;

  // Dynamic grid based on number of images
  if (images.length === 1) {
    return (
      <div className="p-[1.042vw] w-full">
        <div className="relative w-full aspect-[628/436] overflow-hidden bg-white">
          <Image src={images[0]} alt="" fill className="object-cover object-top" sizes="44vw" />
        </div>
      </div>
    );
  }

  if (images.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-[1.042vw] p-[1.042vw] w-full">
        {images.map((src, i) => (
          <div key={i} className="relative w-full aspect-[314/436] overflow-hidden bg-white">
            <Image src={src} alt="" fill className="object-cover object-top" sizes="22vw" />
          </div>
        ))}
      </div>
    );
  }

  // 3 images: 1 large on left, 2 stacked on right
  if (images.length === 3) {
    return (
      <div className="flex gap-[1.042vw] p-[1.042vw] w-full">
        <div className="relative w-1/2 aspect-[314/436] overflow-hidden bg-white">
          <Image src={images[0]} alt="" fill className="object-cover object-top" sizes="22vw" />
        </div>
        <div className="flex flex-col gap-[1.042vw] w-1/2">
          <div className="relative w-full aspect-[314/214] overflow-hidden bg-white">
            <Image src={images[1]} alt="" fill className="object-cover object-top" sizes="22vw" />
          </div>
          <div className="relative w-full aspect-[314/214] overflow-hidden bg-white">
            <Image src={images[2]} alt="" fill className="object-cover object-top" sizes="22vw" />
          </div>
        </div>
      </div>
    );
  }

  // 4+ images: 2x2 grid
  return (
    <div className="grid grid-cols-2 gap-[1.042vw] p-[1.042vw] w-full">
      {images.slice(0, 4).map((src, i) => (
        <div key={i} className="relative w-full aspect-[314/218] overflow-hidden bg-white">
          <Image src={src} alt="" fill className="object-cover object-top" sizes="22vw" />
        </div>
      ))}
    </div>
  );
}

function MobileImageGrid({ images }: { images: string[] }) {
  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="p-[1.944vw] w-full">
        <div className="relative w-full aspect-[320/242] overflow-hidden bg-white">
          <Image src={images[0]} alt="" fill className="object-cover object-top" sizes="90vw" />
        </div>
      </div>
    );
  }

  if (images.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-[1.667vw] p-[1.944vw] w-full">
        {images.map((src, i) => (
          <div key={i} className="relative w-full aspect-[160/242] overflow-hidden bg-white">
            <Image src={src} alt="" fill className="object-cover object-top" sizes="45vw" />
          </div>
        ))}
      </div>
    );
  }

  // 3 images: 1 large on left, 2 stacked on right
  if (images.length === 3) {
    return (
      <div className="flex gap-[1.667vw] p-[1.944vw] w-full">
        <div className="relative w-1/2 aspect-[160/246] overflow-hidden bg-white">
          <Image src={images[0]} alt="" fill className="object-cover object-top" sizes="45vw" />
        </div>
        <div className="flex flex-col gap-[1.667vw] w-1/2">
          <div className="relative w-full aspect-[160/119] overflow-hidden bg-white">
            <Image src={images[1]} alt="" fill className="object-cover object-top" sizes="45vw" />
          </div>
          <div className="relative w-full aspect-[160/119] overflow-hidden bg-white">
            <Image src={images[2]} alt="" fill className="object-cover object-top" sizes="45vw" />
          </div>
        </div>
      </div>
    );
  }

  // 4+ images: 2x2 grid
  return (
    <div className="grid grid-cols-2 gap-[1.667vw] p-[1.944vw] w-full">
      {images.slice(0, 4).map((src, i) => (
        <div key={i} className="relative w-full aspect-[160/121] overflow-hidden bg-white">
          <Image src={src} alt="" fill className="object-cover object-top" sizes="45vw" />
        </div>
      ))}
    </div>
  );
}

function CollectionCard({ collection }: { collection: Collection }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(collection.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const stopEdit = () => setIsEditing(false);

  const isDefault = collection.name === "All Favourites";

  const editIcon = !isDefault && !isEditing && (
    <button type="button" onClick={startEdit} aria-label="Edit collection name" className="shrink-0 flex items-center">
      <Image src="/icon/vuesax/linear/Mode edit.svg" alt="Edit" width={20} height={20} className="w-[4.167vw] h-[4.167vw] md:w-[3.125vw] md:h-[3.125vw] lg:w-[1.667vw] lg:h-[1.667vw]" />
    </button>
  );

  return (
    <Link href={`/wishlist/${collection.id}`} className="flex flex-col gap-[2.778vw] md:gap-[1.389vw]">
      {/* Mobile */}
      <div className="md:hidden flex flex-col bg-[#fbf9f9] w-full">
        <div className="flex items-center justify-between px-[2.278vw] pt-[4.722vw] pb-[2.778vw]">
          <div className="flex items-center gap-[1.667vw]" onClick={(e) => e.preventDefault()}>
            {isEditing ? (
              <input
                ref={inputRef}
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={stopEdit}
                onKeyDown={(e) => { if (e.key === "Enter") stopEdit(); }}
                className="font-[var(--font-manrope)] font-semibold text-black text-[5vw] tracking-[-0.04em] leading-[1.1] bg-transparent outline-none border-b border-black w-[50vw]"
              />
            ) : (
              <span className="font-[var(--font-manrope)] font-semibold text-black text-[5vw] tracking-[-0.04em] leading-[1.1]">{name}</span>
            )}
            {editIcon}
          </div>
          <span className="font-[var(--font-manrope)] font-semibold text-black text-[3.333vw] tracking-[-0.02em]">
            {collection.count} {collection.count === 1 ? "Product" : "Products"}
          </span>
        </div>
        <MobileImageGrid images={collection.images} />
      </div>

      {/* Desktop */}
      <div className="hidden md:flex flex-col bg-[#fbf9f9] w-full">
        <div className="flex items-center justify-between px-[1.389vw] pt-[1.389vw] pb-[1.389vw]">
          <div className="flex items-center gap-[0.694vw]" onClick={(e) => e.preventDefault()}>
            {isEditing ? (
              <input
                ref={inputRef}
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={stopEdit}
                onKeyDown={(e) => { if (e.key === "Enter") stopEdit(); }}
                className="font-[var(--font-manrope)] font-semibold text-black text-[2.865vw] lg:text-[2.222vw] tracking-[-0.04em] leading-[1.1] bg-transparent outline-none border-b border-black w-[20vw]"
              />
            ) : (
              <span className="font-[var(--font-manrope)] font-semibold text-black text-[2.865vw] lg:text-[2.222vw] tracking-[-0.04em] leading-[1.1]">{name}</span>
            )}
            {editIcon}
          </div>
          <span className="font-[var(--font-manrope)] font-semibold text-black text-[1.563vw] lg:text-[1.111vw] tracking-[-0.02em]">
            {collection.count} {collection.count === 1 ? "Product" : "Products"}
          </span>
        </div>
        <CollectionImageGrid images={collection.images} />
      </div>
    </Link>
  );
}

export default function SavedPageClient({
  initialCollections = [],
}: SavedPageClientProps) {
  const collections = initialCollections;

  return (
    <section className="bg-white w-full">
      {/* Hero heading */}
      <div className="flex flex-col items-center text-center pt-[11.111vw] md:pt-[4.861vw] pb-[8.333vw] md:pb-[3.472vw] px-[2.778vw] md:px-[0.694vw]">
        <h1 className="font-[var(--font-manrope)] font-normal leading-[1.2] tracking-[-0.04em] text-black text-[9.444vw] md:text-[5.859vw] lg:text-[5.139vw]">
          My Favourites
        </h1>
        <p className="mt-[2.778vw] md:mt-[2.083vw] font-[var(--font-manrope)] font-medium text-black tracking-[-0.04em] text-[4.167vw] md:text-[2.344vw] lg:mt-[1.389vw] lg:text-[1.667vw] leading-[1.2]">
          Items you love, curated by you.
        </p>
      </div>

      {/* Collections */}
      <div className="px-[2.778vw] md:px-[0.694vw]">
        {collections.length === 0 ? null : (
          <>
            {/* Mobile: single col */}
            <div className="md:hidden flex flex-col gap-[4.167vw]">
              {collections.map((col) => (
                <CollectionCard key={col.id} collection={col} />
              ))}
            </div>

            {/* Desktop: 2-col grid */}
            <div className="hidden md:grid grid-cols-2 gap-[1.736vw]">
              {collections.map((col) => (
                <CollectionCard key={col.id} collection={col} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Looking for inspiration / Nothing to see */}
      <div className="h-[27.778vw] w-full shrink-0 md:h-[13.021vw] lg:h-[7.639vw]" aria-hidden />
      <div className="flex flex-col items-center text-center px-[2.778vw] md:px-[0.694vw]">
        <h2 className="font-[var(--font-manrope)] font-normal leading-[1.2] tracking-[-0.04em] text-black text-[9.444vw] md:text-[5.859vw] lg:text-[5.139vw]">
          {collections.length > 0 ? (<>Looking for<br className="md:hidden" /> inspiration?</>) : "Nothing to see?"}
        </h2>
        <p className="mt-[2.778vw] md:mt-[2.083vw] font-[var(--font-manrope)] font-medium text-black tracking-[-0.04em] text-[4.167vw] md:text-[2.344vw] lg:mt-[1.389vw] lg:text-[1.667vw] leading-[1.2] max-w-[80vw] md:max-w-none lg:max-w-[31.181vw]">
          {collections.length > 0
            ? <>Discover more styles and add them<br />to your favourites.</>
            : <>Browse our curation to start building your<br />outfit for any occasion.</>
          }
        </p>
        <div className="flex items-center gap-[2.778vw] md:gap-[0.694vw] mt-[8.333vw] md:mt-[2.083vw]">
          <Link
            href="/collections"
            className="flex items-center justify-center rounded-full border border-[#7A021D] font-[var(--font-manrope)] font-medium text-[#7A021D] tracking-[-0.04em] whitespace-nowrap w-[38.889vw] h-[16.667vw] text-[3.889vw] md:w-[20.833vw] md:h-[7.813vw] md:text-[1.823vw] lg:w-[13.889vw] lg:h-[5.556vw] lg:text-[1.389vw]"
          >
            Browse Collections
          </Link>
          <Link
            href="/products"
            className="flex items-center justify-center rounded-full bg-[#7A021D] font-[var(--font-manrope)] font-medium text-white tracking-[-0.04em] whitespace-nowrap w-[38.889vw] h-[16.667vw] text-[3.889vw] md:w-[20.833vw] md:h-[7.813vw] md:text-[1.823vw] lg:w-[13.889vw] lg:h-[5.556vw] lg:text-[1.389vw]"
          >
            Browse All
          </Link>
        </div>
      </div>
      <div className="h-[27.778vw] w-full shrink-0 md:h-[13.021vw] lg:h-[8.333vw]" aria-hidden />
    </section>
  );
}
