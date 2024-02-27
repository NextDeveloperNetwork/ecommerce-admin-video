"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { columns, IconsColumn } from "./columns";

interface IconsClientProps {
  data: IconsColumn[];
}

export const IconsClient: React.FC<IconsClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Icons (${data.length})`} description="Manage Icons for your store" />
        <Button onClick={() => router.push(`/${params.storeId}/icons/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="label" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Icons" />
      <Separator />
      <ApiList entityName="icons" entityIdName="iconId" />
    </>
  );
};