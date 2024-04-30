import prismadb from "@/lib/prismadb";

import { SubsubForm } from "./components/subsub-form";

const SubsubPage = async ({
  params
}: {
  params: { subsubId: string, storeId: string }
}) => {
  const subsub= await prismadb.subsub.findUnique({
    where: {
      id: params.subsubId
    }
  });
  const subcategories = await prismadb.subcategory.findMany({
    where: {
      storeId: params.storeId,
    },
  });
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId
    }
  });
  const icons = await prismadb.icon.findMany({
    where: {
      storeId: params.storeId
    }
  });
  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SubsubForm billboards={billboards} icons={icons} subcategories={subcategories} initialData={subsub} />
      </div>
    </div>
  );
}

export default SubsubPage;
