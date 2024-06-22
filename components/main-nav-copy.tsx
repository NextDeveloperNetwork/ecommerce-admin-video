"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { FaHome, FaColumns, FaList, FaTags, FaObjectGroup, FaExpand, FaPalette, FaBox, FaClipboardList, FaCog, FaListOl, FaListUl, FaListAlt } from 'react-icons/fa';
import { cn } from "@/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.storeId}`,
      label: 'Overview',
      icon: <FaHome />,
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: 'Billboards',
      icon: <FaColumns />,
      active: pathname === `/${params.storeId}/billboards`,
    },
    {
      href: `/${params.storeId}/icons`,
      label: 'Icons',
      icon: <FaColumns />,
      active: pathname === `/${params.storeId}/icons`,
    },
    {
      href: `/${params.storeId}/categories`,
      label: 'Categories',
      icon: <FaList />,
      active: pathname === `/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/subcategories`,
      label: 'Subcategories',
      icon: <FaListOl />,
      active: pathname === `/${params.storeId}/subcategories`,
    },
    {
      href: `/${params.storeId}/subsub`,
      label: 'Subsub',
      icon: <FaListOl />,
      active: pathname === `/${params.storeId}/subsub`,
    },
    {
      href: `/${params.storeId}/sizes`,
      label: 'Sizes',
      icon: <FaObjectGroup />,
      active: pathname === `/${params.storeId}/sizes`,
    },
    {
      href: `/${params.storeId}/colors`,
      label: 'Colors',
      icon: <FaPalette />,
      active: pathname === `/${params.storeId}/colors`,
    },
    {
      href: `/${params.storeId}/products`,
      label: 'Products',
      icon: <FaBox />,
      active: pathname === `/${params.storeId}/products`,
    },
    {
      href: `/${params.storeId}/orders`,
      label: 'Orders',
      icon: <FaClipboardList />,
      active: pathname === `/${params.storeId}/orders`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: 'Settings',
      icon: <FaCog />,
      active: pathname === `/${params.storeId}/settings`,
    },
  ];

  return (
<nav
      className={cn("flex flex-col items-start space-y-4", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          passHref
        >
          <div className={cn(
            'flex items-center text-lg font-medium transition-colors hover:text-blue-800 p-2 rounded-md',
            route.active ? 'text-white dark:text-black bg-primary' : 'text-muted-foreground'
          )}>
            <span className="mr-2">{route.icon}</span>
            <span>{route.label}</span>
          </div>
        </Link>
      ))}
    </nav>
  );
}
