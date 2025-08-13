import { and, asc, eq, gt } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";

import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import ProductList from "@/components/common/product-list";
import { db } from "@/db";
import { productSizeTable, productStockTable, productTable, productVariantTable } from "@/db/schema";
import { formatCentsToBRL } from "@/helpers/money";

import ProductActions from "./components/product-actions";
import VariantSelector from "./components/variant-selector";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug } = await params;

  const productVariant = await db.query.productVariantTable.findFirst({
    where: eq(productVariantTable.slug, slug),
    with: {
      product: {
        with: {
          variants: true,
        },
      },
    },
  });
  if (!productVariant) return notFound();

  const stockItems = await db
    .select({
      stock: productStockTable,
      size: productSizeTable,
    })
    .from(productStockTable)
    .innerJoin(productSizeTable, eq(productSizeTable.id, productStockTable.productSizeId))
    .where(and(eq(productStockTable.productVariantId, productVariant.id), gt(productStockTable.quantity, 0)))
    .orderBy(asc(productSizeTable.displayOrder));

  const availableSizes = stockItems.map(({ stock, size }) => ({
    id: size.id,
    value: size.value,
    stockId: stock.id,
  }));

  const likelyProducts = await db.query.productTable.findMany({
    where: eq(productTable.categoryId, productVariant.product.categoryId),
    with: {
      variants: true,
    },
  });

  return (
    <>
      <Header />
      <div className="flex flex-col space-y-6">
        <Image
          src={productVariant.imageUrl}
          alt={productVariant.name}
          sizes="100vw"
          height={0}
          width={0}
          className="h-auto w-full object-cover"
        />

        <div className="px-5">
          <h2 className="text-lg font-semibold">{productVariant.product.name}</h2>
          <h3 className="text-muted-foreground text-sm">{productVariant.name}</h3>
          <h3 className="text-lg font-semibold">{formatCentsToBRL(productVariant.priceInCents)}</h3>
        </div>

        <div className="px-5">
          <VariantSelector variants={productVariant.product.variants} selectedVariantSlug={productVariant.slug} />
        </div>

        <ProductActions productVariantId={productVariant.id} availableSizes={availableSizes} />

        <div className="px-5">
          <p className="text-sm">{productVariant.product.description}</p>
        </div>

        <ProductList title="Você também pode gostar" products={likelyProducts} />

        <Footer />
      </div>
    </>
  );
};

export default ProductPage;
