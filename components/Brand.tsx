import Image from "next/image";
import { brandLogos, brandMarkSize } from "@/lib/brand";

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Image
      className="brand-mark"
      src={light ? brandLogos.principaleCrema : brandLogos.principaleColore}
      alt="ACCELERIAMO"
      width={brandMarkSize.width}
      height={brandMarkSize.height}
      priority
    />
  );
}
