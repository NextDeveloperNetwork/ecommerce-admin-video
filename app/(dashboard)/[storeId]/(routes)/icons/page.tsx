import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { IconsColumn } from "./components/columns"
import { IconsClient } from "./components/client";

const IconsPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const icons = await prismadb.icon.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedIcons: IconsColumn[] = icons.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <IconsClient data={formattedIcons} />
      </div>
    </div>
  );
};

export default IconsPage;