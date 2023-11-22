import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import StoreSwitcher from "@/components/store-switcher";

import { ThemeToggle } from "@/components/theme-toggle";
import prismadb from "@/lib/prismadb";
import MenueBt from "./side-navtoggle";
import { MainNav } from "./main-nav";


const Sidenav = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    }
  });

  return ( 
   <div>


<nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
  <div className="px-3 py-1 lg:px-5 lg:pl-3">
    <div className="flex items-center justify-between ">

   
      <MenueBt/>

         <div className="px-2">
         <StoreSwitcher items={stores} />
         </div>
         <div className="hidden sm:block px-">
         <MainNav/>
         </div>
         
    <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          
          <UserButton afterSignOutUrl="/" />
        </div>
    </div>
  </div>
</nav>
   </div>
    
  );
};
 
export default Sidenav;