import prismadb from "@/lib/prismadb";
import { IconsForm } from "./components/icons-form";

const IconPage =async ({
    params
}:{
    params:{iconId:string}
})=>{

    const icons = await prismadb.icon.findUnique({
        where:{
            id: params.iconId
        },
    })
    return(
<div className="flex-col">
   <div className="flex-1 space-y-4 p-8 pt-6">
        <IconsForm initialData={icons}/>
   </div>
</div>
    );
}
export default IconPage;