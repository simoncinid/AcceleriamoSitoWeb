import Image from "next/image";
import { brandLogos, brandMarkSize } from "@/lib/brand";

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Image
      className={light ? "brand-mark brand-mark--light" : "brand-mark"}
      src={brandLogos.principale}
      alt="ACCELERIAMO"
      width={brandMarkSize.width}
      height={brandMarkSize.height}
      priority
    />
  );
}
