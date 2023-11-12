"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";


import { columns, SubCategoryColumn } from "./columns";
import { ApiList } from "@/components/ui/api-list";

interface SubCategoriesClientProps {
  data: SubCategoryColumn[];
}

export const SubCategoriesClient: React.FC<SubCategoriesClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Subcategories (${data.length})`} description="Manage subcategories for your store" />
        <Button onClick={() => router.push(`/${params.storeId}/subcategories/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Subcategories" />
      <Separator />
      <ApiList entityName="subcategories" entityIdName="subcategoryId" />
    </>
  );
};
