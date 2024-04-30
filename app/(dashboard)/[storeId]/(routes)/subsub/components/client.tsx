"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";


import { columns, SubsubColumn } from "./columns";
import { ApiList } from "@/components/ui/api-list";

interface SubsubClientProps {
  data: SubsubColumn[];
}

export const SubsubClient: React.FC<SubsubClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Subsub (${data.length})`} description="Manage subsub for your store" />
        <Button onClick={() => router.push(`/${params.storeId}/subsub/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Subsub" />
      <Separator />
      <ApiList entityName="subsub" entityIdName="subsubId" />
    </>
  );
};
