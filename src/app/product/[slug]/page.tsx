import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";

import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import ProductList from "@/components/common/product-list";
import { db } from "@/db";
import { productTable, productVariantTable } from "@/db/schema";
import { formatCentsToBRL } from "@/helpers/money";

import ProductActions from "./components/product-actions";
import VariantSelector from "./components/variant-selector";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug } = await params;

  // Query atualizada para buscar a variante e os tamanhos disponíveis
  const productVariant = await db.query.productVariantTable.findFirst({
    where: eq(productVariantTable.slug, slug),
    with: {
      product: {
        with: {
          variants: true,
        },
      },
      stockItems: {
        with: {
          productSize: true,
        },
        where: (stock, { gt }) => gt(stock.quantity, 0),
      },
    },
  });
  if (!productVariant) return notFound();

  console.log(productVariant);

  // Mapear os tamanhos disponíveis, mantendo os objetos com id e valor
  const availableSizes = productVariant.stockItems.map((item) => ({
    id: item.productSize.id,
    value: item.productSize.value,
    stockId: item.id,
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
