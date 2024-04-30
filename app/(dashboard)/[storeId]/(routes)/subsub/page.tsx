import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { SubsubColumn } from "./components/columns"
import { SubsubClient } from "./components/client";

const SubsubPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const subsub = await prismadb.subsub.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      subcategory: true,
      billboard: true,
      icon: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedSubsub: SubsubColumn[] = subsub.map((item) => ({
    id: item.id,
    name: item.name,
    subcategory: item.subcategory.name,
    billboardLabel: item.billboard.label,
    iconLabel: item.icon.label,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SubsubClient data={formattedSubsub} />
      </div>
    </div>
  );
};

export default SubsubPage;
