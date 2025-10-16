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
import { NavLink, useLocation } from "react-router-dom";

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

  const location = useLocation();

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
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem
                    key={item.title}
                    className={`${isActive ? "bg-sidebar-accent" : ""}`}
                  >
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          `flex items-center w-full p-2 gap-2 rounded-md ${
                            isActive
                              ? "bg-blue-500 text-blue-700"
                              : "hover:bg-gray-100"
                          }`
                        }
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </NavLink>
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
