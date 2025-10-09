import {
  Archive,
  ArchiveX,
  ArrowLeftRight,
  BookMarked,
  ShoppingBasket,
} from "lucide-react";
import logo from "../assets/logo.png";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
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
    title: "Estoque",
    url: "/stock",
    icon: Archive,
  },
  {
    title: "Movimentos",
    url: "/movimenets",
    icon: ArrowLeftRight,
  },
  {
    title: "Baixo estoque",
    url: "/low-stock",
    icon: ArchiveX,
  },
];

export function SidebarCustom() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <img
            src={logo}
            alt="logo pesados do agro"
            className="w-[50%] mx-auto"
          />
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
