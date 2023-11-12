import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { SubCategoryColumn } from "./components/columns"
import { SubCategoriesClient } from "./components/client";

const SubCategoriesPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const subcategories = await prismadb.subcategory.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      category: true,
      billboard: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedSubCategories: SubCategoryColumn[] = subcategories.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SubCategoriesClient data={formattedSubCategories} />
      </div>
    </div>
  );
};

export default SubCategoriesPage;
