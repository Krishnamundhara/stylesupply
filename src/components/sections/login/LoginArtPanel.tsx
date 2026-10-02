import Image from "next/image";

export default function LoginArtPanel() {
  return (
    <div className="hidden md:block md:w-1/2 h-full relative overflow-hidden" suppressHydrationWarning>
      <Image
        src="/images/authentication_page/banner.webp"
        alt="StyleSupply fashion"
        className="absolute inset-0 w-full h-full object-cover block" style={{ objectPosition: "50% 30%" }}
        fill
        priority
      />
    </div>
  );
}
