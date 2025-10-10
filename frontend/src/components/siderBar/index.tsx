import {
  Archive,
  ArchiveX,
  ArrowLeftRight,
  BookMarked,
  ShoppingBasket,
  User,
} from "lucide-react";
import logo from "../../assets/logo.png";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { FooterSiderBar } from "./footer";
import { useAuth } from "@/hooks/useAuth";
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
    url: "/movements",
    icon: ArrowLeftRight,
  },
  {
    title: "Baixo estoque",
    url: "/low-stock",
    icon: ArchiveX,
  },
  {
    title: "Usuários",
    url: "/users",
    icon: User,
  },
];

export function SidebarCustom() {
  const { user } = useAuth();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <img
            src={logo}
            alt="Logo controle de estoque"
            className="w-[50%] mx-auto"
          />
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                if (item.title === "Usuários" && !user?.isAdmin) {
                  return null;
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <FooterSiderBar />
    </Sidebar>
  );
}
