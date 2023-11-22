import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';
import Sidenav from '@/components/side-nav';
import Navbar from '@/components/navbar'
import prismadb from '@/lib/prismadb';

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { storeId: string }
}) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const store = await prismadb.store.findFirst({ 
    where: {
      id: params.storeId,
      userId,
    }
   });

  if (!store) {
    redirect('/');
  };

  return (
    <>
      <Sidenav />
      <div >
                <div className="p-0 sm:p-4 sm:pt-0 mt-10">
                    {children}
                </div>
            </div>
    </>
  );
};