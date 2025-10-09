import { Archive, ArrowLeftRight, BookMarked, Inbox, ShoppingBasket } from "lucide-react";
import logo from "../assets/logo.png";

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
const items = [
  {
    title: "Produtos",
    url: "/products",
    icon: ShoppingBasket,
  },
  {
    title: "Categorias",
    url: "/categories",
    icon: BookMarked,
  },
  {
    title: "estoque",
    url: "/stock",
    icon: Archive,
  },
  {
    title: "movimentos",
    url: "/movimenets",
    icon: ArrowLeftRight,
  },
];

export function SidebarCustom() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <img src={logo} alt="logo pesados do agro" className="w-[50%] mx-auto" />
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
