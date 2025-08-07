import Image from "next/image";
import Link from "next/link";

import { productVariantTable } from "@/db/schema";

interface ProductVariantPageProps {
  variants: (typeof productVariantTable.$inferSelect)[];
  selectedVariantSlug?: string;
}

const VariantsSelector = ({ variants, selectedVariantSlug }: ProductVariantPageProps) => {
  return (
    <div className="flex items-center gap-4">
      {variants.map((variant) => (
        <Link
          key={variant.id}
          href={`/product-variant/${variant.slug}`}
          className={selectedVariantSlug === variant.slug ? "border-2 border-primary rounded-xl" : ""}
        >
          <Image width={68} height={68} src={variant.imageUrl} alt={variant.name} className="rounded-xl" />
        </Link>
      ))}
    </div>
  );
};

export default VariantsSelector;
