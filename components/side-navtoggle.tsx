"use client"
import { useState } from "react";
import { MainNav } from "@/components/main-nav-copy";
import { Button } from "./ui/button";
import { MenuIcon,  X } from "lucide-react";
import IconButton from "./ui/icon-button";
import { Dialog } from "@headlessui/react";


const MenueBt = () => {
  const [open, setOpen] = useState(false);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  return ( 

<>
    <Button className="flex items-center rounded-full bg-white px-0 py-2"onClick={onOpen} >
    {<MenuIcon  
    size={30}
    color="gray" />} 
    </Button>
    
    <Dialog open={open} as="div" className="relative z-40" onClose={onClose}>
      
      {/* Background color and opacity */}
      <div className="fixed inset-0 bg-black bg-opacity-25" />
      
      {/* Dialog position */}
      <div className="fixed inset-0 z-40 flex">
        <Dialog.Panel className="relative flex h-full w-full max-w-xs flex-col
         overflow-y-auto bg-white py-2 pb-4 shadow-xl left-0"> {/* Added "left-0" class */}
          
          {/* Close button */}
          <div className="flex items-center justify-end px-4 py-12 ">
            <IconButton icon={<X size={15} />} onClick={onClose} />
          </div>
  
          <div className="px-9 ">
          <MainNav/>
          </div>

          <div className="mt-auto">



          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  </>
  );
};
 
export default MenueBt;