"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { wishlistApi } from "@/services/wishlist";

function CustomScrollbar({ scrollRef, mobile }: { scrollRef: React.RefObject<HTMLDivElement | null>; mobile?: boolean }) {
  const [thumb, setThumb] = useState({ top: 0, height: 0 });
  const [visible, setVisible] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const update = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight <= clientHeight) { setVisible(false); return; }
    setVisible(true);
    const trackH = trackRef.current?.clientHeight ?? clientHeight;
    const ratio = clientHeight / scrollHeight;
    const thumbH = Math.max(ratio * trackH, 24);
    const maxTop = trackH - thumbH;
    const top = (scrollTop / (scrollHeight - clientHeight)) * maxTop;
    setThumb({ top, height: thumbH });
  }, [scrollRef]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const t = setTimeout(update, 0);
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => { clearTimeout(t); el.removeEventListener("scroll", update); ro.disconnect(); };
  }, [scrollRef, update]);

  if (!visible) return null;

  return (
    <div ref={trackRef} className={`absolute right-[2px] top-0 bottom-0 pointer-events-none z-10 ${mobile ? "w-[3px]" : "w-[2px]"}`}>
      <div
        className="absolute w-full bg-[#7A021D]"
        style={{ top: thumb.top, height: thumb.height }}
      />
    </div>
  );
}

interface SavedPopupProps {
  brand: string;
  name: string;
  displayPrice: string;
  thumbnailUrl: string | null;
  /** Backing product UUID. When omitted, "Add" buttons are no-ops (legacy/mock cards). */
  productId?: string;
  onClose: () => void;
}

type Collection = {
  id: string;
  name: string;
  count: number;
  thumbnail: string;
};

type State = "default" | "new-collection" | "done";

const FALLBACK_THUMB = "/images/wardrobe-sample.webp";

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M1 1L17 17M17 1L1 17" stroke="#7A021D" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

type ProductCardProps = { brand: string; name: string; displayPrice: string; thumbnailUrl?: string | null; mobile?: boolean };
function ProductCard({ brand, name, thumbnailUrl, mobile }: ProductCardProps) {
  return (
    <div className={`flex flex-col items-center ${mobile ? "w-full px-[8.333vw]" : "w-full"}`}>
      <div
        className="relative bg-white overflow-hidden"
        style={mobile
          ? { width: "55.556vw", height: "66.667vw" }
          : { width: "clamp(120px, 20vw, 220px)", aspectRatio: "15.278 / 18.056", maxHeight: "28vh" }}
      >
        {thumbnailUrl
          ? <Image src={thumbnailUrl} alt={name} fill sizes={mobile ? "56vw" : "16vw"} className="object-cover object-top" />
          : <div className="absolute inset-0 bg-[#e8e0d8]" />
        }
      </div>
      <p className="font-[var(--font-manrope)] font-medium text-[#4E4E4E] tracking-[-0.02em] uppercase text-center mt-[2vw] md:mt-[1vw]"
        style={{ fontSize: mobile ? "3.333vw" : "clamp(13px, 1.563vw, 16px)" }}>
        {brand}
      </p>
      <p className="font-[var(--font-manrope)] font-semibold text-black tracking-[-0.04em] capitalize text-center mt-[1vw] md:mt-[0.5vw]"
        style={{ fontSize: mobile ? "4.167vw" : "clamp(16px, 1.823vw, 20px)" }}>
        {name}
      </p>
    </div>
  );
}

type CollectionRowProps = { col: Collection; addedIds: Set<string>; pendingId: string | null; onAdd: (id: string) => void; mobile?: boolean };
function CollectionRow({ col, addedIds, pendingId, onAdd, mobile }: CollectionRowProps) {
  const isAdded = addedIds.has(col.id);
  const isPending = pendingId === col.id;
  return (
    <div
      className={`flex items-center w-full shrink-0 ${isAdded ? "bg-[#7A021D]" : ""}`}
      style={{ padding: mobile ? "2.5vw 4vw" : "0.7vw 1.1vw", gap: mobile ? "3vw" : "1vw" }}
    >
      <div className="relative shrink-0 overflow-hidden bg-[#e8e0d8]"
        style={mobile ? { width: "13vw", height: "15vw" } : { width: "clamp(40px, 5.208vw, 60px)", height: "clamp(48px, 6.25vw, 72px)" }}>
        <Image src={col.thumbnail} alt={col.name} fill className="object-cover object-top" sizes={mobile ? "14vw" : "4vw"} />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <p className={`font-[var(--font-manrope)] font-semibold tracking-[-0.04em] truncate ${isAdded ? "text-white" : "text-black"}`}
          style={{ fontSize: mobile ? "3.889vw" : "clamp(14px, 1.823vw, 18px)" }}>
          {col.name}
        </p>
        <p className={`font-[var(--font-manrope)] tracking-[-0.02em] ${isAdded ? "text-white/70" : "text-[#4E4E4E]"}`}
          style={{ fontSize: mobile ? "2.778vw" : "max(11px, 0.833vw)" }}>
          {col.count} Products
        </p>
      </div>
      {isAdded ? (
        <span
          className="shrink-0 flex items-center justify-center rounded-full bg-white font-[var(--font-manrope)] font-medium text-[#7A021D] tracking-[-0.02em]"
          style={mobile ? { width: "27.778vw", height: "13.889vw", fontSize: "3.333vw" } : { width: "clamp(80px, 10.417vw, 120px)", height: "clamp(36px, 4.688vw, 54px)", fontSize: "clamp(13px, 1.563vw, 16px)" }}
        >
          Added!
        </span>
      ) : (
        <button
          type="button"
          onClick={() => onAdd(col.id)}
          disabled={isPending}
          className="shrink-0 flex items-center justify-center rounded-full border border-[#2C0505] font-[var(--font-manrope)] font-medium text-black tracking-[-0.02em] disabled:opacity-50"
          style={mobile ? { width: "27.778vw", height: "13.889vw", fontSize: "3.333vw" } : { width: "clamp(80px, 10.417vw, 120px)", height: "clamp(36px, 4.688vw, 54px)", fontSize: "clamp(13px, 1.563vw, 16px)" }}
        >
          {isPending ? "Adding…" : "Add"}
        </button>
      )}
    </div>
  );
}

type BottomCTAsProps = { mobile?: boolean; onNewCollection: () => void; onClose: () => void };
function BottomCTAs({ mobile, onNewCollection, onClose }: BottomCTAsProps) {
  return (
    <div className="flex flex-col items-center shrink-0"
      style={{ gap: mobile ? "3.5vw" : "clamp(8px,1.25vw,18px)", marginTop: mobile ? "3.5vw" : "clamp(10px,1.736vw,25px)" }}>
      <button
        type="button"
        onClick={onNewCollection}
        className="flex items-center justify-center rounded-full bg-[#7A021D] font-[var(--font-manrope)] font-semibold text-white tracking-[-0.02em]"
        style={mobile ? { width: "55.556vw", height: "16.667vw", fontSize: "3.889vw" } : { width: "clamp(160px, 20.833vw, 240px)", height: "clamp(50px, 6.51vw, 70px)", fontSize: "clamp(14px, 1.823vw, 18px)" }}
      >
        New Collection
      </button>
      <Link
        href="/wishlist"
        onClick={onClose}
        className="font-[var(--font-manrope)] font-medium text-[#7A021D] tracking-[-0.02em] underline underline-offset-2"
        style={{ fontSize: mobile ? "3.333vw" : "clamp(14px, 1.823vw, 18px)" }}
      >
        View Favourites
      </Link>
    </div>
  );
}

export default function SavedPopup({ brand, name, displayPrice, thumbnailUrl, productId, onClose }: SavedPopupProps) {
  const [closing, setClosing] = useState(false);
  const [state, setState] = useState<State>("default");
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [savingNew, setSavingNew] = useState(false);
  const [createdCollectionId, setCreatedCollectionId] = useState<string | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const mobileListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  // Load named collections (excluding the "All Saved" default).
  useEffect(() => {
    wishlistApi.getAll().then((res) => {
      const named = res.wishlists
        .filter((w) => w.name !== "All Saved")
        .map((w): Collection => ({
          id: w.id,
          name: w.name,
          count: w.item_count,
          thumbnail: w.preview_images[0] ?? FALLBACK_THUMB,
        }));
      setCollections(named);
    }).catch(() => setLoadError("Could not load collections"));
  }, []);

  const hasCollections = collections.length > 0;

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 350);
  };

  const handleAddToCollection = async (wishlistId: string) => {
    if (!productId || pendingId) return;
    setPendingId(wishlistId);
    try {
      await wishlistApi.addItem(wishlistId, productId);
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.add(wishlistId);
        return next;
      });
    } catch {
      /* swallow — UI stays in "Add" state on failure */
    } finally {
      setPendingId(null);
    }
  };

  const handleSave = async () => {
    const trimmed = newName.trim();
    if (!trimmed) {
      setNameError(true);
      return;
    }
    setNameError(false);
    if (!productId) {
      setState("done");
      return;
    }
    setSavingNew(true);
    try {
      const created = await wishlistApi.create(trimmed);
      await wishlistApi.addItem(created.id, productId);
      setCreatedCollectionId(created.id);
      setState("done");
    } catch {
      setNameError(true);
    } finally {
      setSavingNew(false);
    }
  };

  const animation = closing ? "slideOutRight" : "slideInRight";

  return (
    <div className="fixed inset-0 z-40 flex" data-lenis-prevent>
      <div className="absolute inset-0 bg-white/60 hidden md:block" onClick={handleClose} />

      {/* ─── Desktop ──────────────────────────────────────────────────────── */}
      <div
        data-lenis-prevent
        className="relative z-10 ml-auto hidden md:flex h-full w-[clamp(340px,37.292vw,537px)] md:w-[50vw] lg:w-[clamp(340px,37.292vw,537px)] flex-col bg-[#F7F4EF] overflow-hidden"
        style={{ paddingTop: "clamp(20px, 2.604vw, 112px)", animation: `${animation} 0.35s cubic-bezier(0.4,0,0.2,1) both`, overscrollBehavior: "contain" }}
      >
        <button type="button" onClick={handleClose} aria-label="Close"
          className="absolute right-[35px] text-[#7A021D] z-10"
          style={{ top: "calc(clamp(20px, 2.604vw, 112px) + 20px)" }}>
          <CloseIcon />
        </button>

        {state === "default" && !hasCollections && (
          <div className="flex flex-1 flex-col items-center justify-center px-[40px] py-[30px]">
            <p className="font-[var(--font-manrope)] font-normal text-black text-center leading-[1.2] tracking-[-0.04em]" style={{ fontSize: "clamp(24px, 3.125vw, 34px)" }}>
              Added to<br />Favourites
            </p>
            <div className="mt-[2vw] w-full flex flex-col items-center"><ProductCard brand={brand} name={name} displayPrice={displayPrice} thumbnailUrl={thumbnailUrl} /></div>
            {loadError && <p className="mt-2 text-xs text-[#7A021D]">{loadError}</p>}
            <BottomCTAs onNewCollection={() => setState("new-collection")} onClose={handleClose} />
          </div>
        )}

        {state === "default" && hasCollections && (
          <div className="flex flex-1 flex-col px-[40px] py-[30px] min-h-0">
            <p className="font-[var(--font-manrope)] font-normal text-black text-center leading-[1.2] tracking-[-0.04em] shrink-0" style={{ fontSize: "clamp(24px, 3.125vw, 34px)" }}>
              Added to<br />Favourites
            </p>
            <div className="relative my-[1.5vw]">
              <div
                ref={listRef}
                className="divide-y divide-[#e0d9d0] scrollbar-sleek pr-[10px]"
                style={{ overflowY: "auto", maxHeight: "40vh" }}
              >
                {collections.map(col => <CollectionRow key={col.id} col={col} addedIds={addedIds} pendingId={pendingId} onAdd={handleAddToCollection} />)}
              </div>
              <CustomScrollbar scrollRef={listRef} />
            </div>
            <BottomCTAs onNewCollection={() => setState("new-collection")} onClose={handleClose} />
          </div>
        )}

        {state === "new-collection" && (
          <div className="flex flex-1 flex-col items-center justify-center px-[40px] py-[30px]">
            <p className="font-[var(--font-manrope)] font-normal text-black text-center leading-[1.2] tracking-[-0.04em]" style={{ fontSize: "clamp(24px, 3.125vw, 34px)" }}>
              New Collection
            </p>
            <div className="mt-[2vw] w-full flex flex-col items-center"><ProductCard brand={brand} name={name} displayPrice={displayPrice} thumbnailUrl={thumbnailUrl} /></div>
            <input
              type="text" placeholder="Collection Name" value={newName}
              onChange={e => { setNewName(e.target.value); setNameError(false); }}
              onKeyDown={e => e.key === "Enter" && handleSave()}
              className={`w-full bg-transparent border-b pb-2 font-[var(--font-manrope)] text-black placeholder-[#aaa] tracking-[-0.02em] outline-none mt-[2vw] ${nameError ? "border-red-500" : "border-[#7A021D]"}`}
              style={{ fontSize: "max(12px, 1.111vw)" }}
            />
            {nameError && (
              <p className="font-[var(--font-manrope)] text-red-500 mt-[0.4vw] self-start" style={{ fontSize: "max(11px, 0.833vw)" }}>
                Please enter a collection name
              </p>
            )}
            <button type="button" onClick={handleSave} disabled={savingNew}
              className="mt-[1.5vw] flex items-center justify-center rounded-full bg-[#7A021D] font-[var(--font-manrope)] font-semibold text-white tracking-[-0.02em] disabled:opacity-60"
              style={{ width: "clamp(160px, 20.833vw, 240px)", height: "clamp(50px, 6.51vw, 70px)", fontSize: "clamp(14px, 1.823vw, 18px)" }}>
              {savingNew ? "Saving…" : "Save"}
            </button>
          </div>
        )}

        {state === "done" && (
          <div className="flex flex-1 flex-col items-center justify-center px-[40px] py-[30px]">
            <p className="font-[var(--font-manrope)] font-normal text-black text-center leading-[1.2] tracking-[-0.04em]" style={{ fontSize: "clamp(24px, 3.125vw, 34px)" }}>
              Added to<br />Favourites
            </p>
            <div className="mt-[2vw] w-full flex flex-col items-center"><ProductCard brand={brand} name={name} displayPrice={displayPrice} thumbnailUrl={thumbnailUrl} /></div>
            <Link
              href={createdCollectionId ? `/wishlist/${createdCollectionId}` : "/wishlist"}
              onClick={handleClose}
              className="mt-[1.5vw] flex items-center justify-center rounded-full bg-[#7A021D] font-[var(--font-manrope)] font-semibold text-white tracking-[-0.02em]"
              style={{ width: "clamp(160px, 20.833vw, 240px)", height: "clamp(50px, 6.51vw, 70px)", fontSize: "clamp(14px, 1.823vw, 18px)" }}>
              View Collection
            </Link>
            <Link href="/wishlist" onClick={handleClose}
              className="mt-[1vw] font-[var(--font-manrope)] font-medium text-[#7A021D] tracking-[-0.02em] underline underline-offset-2"
              style={{ fontSize: "max(12px, 1.111vw)" }}>
              View Favourites
            </Link>
          </div>
        )}
      </div>

      {/* ─── Mobile ───────────────────────────────────────────────────────── */}
      <div
        data-lenis-prevent
        className="relative z-10 flex md:hidden h-full w-full flex-col bg-[#F7F4EF] overflow-y-auto"
        style={{ animation: `${animation} 0.35s cubic-bezier(0.4,0,0.2,1) both`, overscrollBehavior: "contain" }}
      >
        <div className="flex w-full justify-end px-[5.556vw] shrink-0" style={{ paddingTop: "28vw" }}>
          <button type="button" onClick={handleClose} aria-label="Close" className="text-[#7A021D]">
            <CloseIcon />
          </button>
        </div>

        {state === "default" && !hasCollections && (
          <div className="flex flex-col items-center px-[5.556vw] pb-[8vw]">
            <p className="font-[var(--font-manrope)] font-normal text-black text-center leading-[1.2] tracking-[-0.04em] mt-[3vw]" style={{ fontSize: "9.444vw" }}>
              Added to<br />Favourites
            </p>
            <div className="mt-[6vw] w-full flex flex-col items-center"><ProductCard brand={brand} name={name} displayPrice={displayPrice} thumbnailUrl={thumbnailUrl} mobile /></div>
            {loadError && <p className="mt-2 text-xs text-[#7A021D]">{loadError}</p>}
            <BottomCTAs mobile onNewCollection={() => setState("new-collection")} onClose={handleClose} />
          </div>
        )}

        {state === "default" && hasCollections && (
          <div className="flex flex-col flex-1 min-h-0 pb-[6vw]">
            <p className="font-[var(--font-manrope)] font-normal text-black text-center leading-[1.2] tracking-[-0.04em] shrink-0 mt-[3vw]" style={{ fontSize: "9.444vw" }}>
              Added to<br />Favourites
            </p>
            <div className="relative mt-[4vw]">
              <div
                ref={mobileListRef}
                className="divide-y divide-[#e0d9d0] scrollbar-sleek pl-[3.333vw] pr-[5vw]"
                style={{ overflowY: "auto", maxHeight: "80vw" }}
              >
                {collections.map(col => <CollectionRow key={col.id} col={col} addedIds={addedIds} pendingId={pendingId} onAdd={handleAddToCollection} mobile />)}
              </div>
              <CustomScrollbar scrollRef={mobileListRef} mobile />
            </div>
            <BottomCTAs mobile onNewCollection={() => setState("new-collection")} onClose={handleClose} />
          </div>
        )}

        {state === "new-collection" && (
          <div className="flex flex-col items-center px-[5.556vw] pb-[8vw]">
            <p className="font-[var(--font-manrope)] font-normal text-black text-center leading-[1.2] tracking-[-0.04em] mt-[3vw]" style={{ fontSize: "9.444vw" }}>
              New Collection
            </p>
            <div className="mt-[6vw] w-full flex flex-col items-center"><ProductCard brand={brand} name={name} displayPrice={displayPrice} thumbnailUrl={thumbnailUrl} mobile /></div>
            <input
              type="text" placeholder="Collection Name" value={newName}
              onChange={e => { setNewName(e.target.value); setNameError(false); }}
              onKeyDown={e => e.key === "Enter" && handleSave()}
              className={`bg-transparent border-b pb-2 font-[var(--font-manrope)] text-black placeholder-[#aaa] tracking-[-0.02em] outline-none mt-[6vw] w-full ${nameError ? "border-red-500" : "border-[#7A021D]"}`}
              style={{ fontSize: "3.333vw" }}
            />
            {nameError && (
              <p className="font-[var(--font-manrope)] text-red-500 mt-[1.5vw] self-start" style={{ fontSize: "3vw" }}>
                Please enter a collection name
              </p>
            )}
            <button type="button" onClick={handleSave} disabled={savingNew}
              className="mt-[6vw] flex items-center justify-center rounded-full bg-[#7A021D] font-[var(--font-manrope)] font-semibold text-white tracking-[-0.02em] disabled:opacity-60"
              style={{ width: "55.556vw", height: "16.667vw", fontSize: "3.889vw" }}>
              {savingNew ? "Saving…" : "Save"}
            </button>
          </div>
        )}

        {state === "done" && (
          <div className="flex flex-col items-center px-[5.556vw] pb-[8vw]">
            <p className="font-[var(--font-manrope)] font-normal text-black text-center leading-[1.2] tracking-[-0.04em] mt-[3vw]" style={{ fontSize: "9.444vw" }}>
              Added to<br />Favourites
            </p>
            <div className="mt-[6vw] w-full flex flex-col items-center"><ProductCard brand={brand} name={name} displayPrice={displayPrice} thumbnailUrl={thumbnailUrl} mobile /></div>
            <Link
              href={createdCollectionId ? `/wishlist/${createdCollectionId}` : "/wishlist"}
              onClick={handleClose}
              className="mt-[6vw] flex items-center justify-center rounded-full bg-[#7A021D] font-[var(--font-manrope)] font-semibold text-white tracking-[-0.02em]"
              style={{ width: "55.556vw", height: "16.667vw", fontSize: "3.889vw" }}>
              View Collection
            </Link>
            <Link href="/wishlist" onClick={handleClose}
              className="mt-[3vw] font-[var(--font-manrope)] font-medium text-[#7A021D] tracking-[-0.02em] underline underline-offset-2"
              style={{ fontSize: "3.333vw" }}>
              View Favourites
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
