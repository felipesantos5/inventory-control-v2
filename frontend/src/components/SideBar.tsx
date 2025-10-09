import {
  Archive,
  ArchiveX,
  ArrowLeftRight,
  BookMarked,
  LogOut,
  ShoppingBasket,
  User,
} from "lucide-react";
import logo from "../assets/logo.png";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
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
    url: "/movimenets",
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
  const { logout } = useAuth();

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
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout}>
              <LogOut className="w-5 h-5" />
              Sair
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
