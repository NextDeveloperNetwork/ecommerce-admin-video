import prismadb from "@/lib/prismadb";

import { SubCategoryForm } from "./components/subcategory-form";

const SubCategoryPage = async ({
  params
}: {
  params: { subcategoryId: string, storeId: string }
}) => {
  const subcategory = await prismadb.subcategory.findUnique({
    where: {
      id: params.subcategoryId
    }
  });
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SubCategoryForm billboards={billboards} categories={categories} initialData={subcategory} />
      </div>
    </div>
  );
}

export default SubCategoryPage;
