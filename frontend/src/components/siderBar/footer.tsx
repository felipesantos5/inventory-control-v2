import { LogOut } from "lucide-react";
import userImg from "@/assets/user.png";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { useAuth } from "@/hooks/useAuth";

export const FooterSiderBar = () => {
  const { logout, user } = useAuth();

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={logout} className="justify-between">
            <div className="flex gap-2 items-center">
              <Avatar>
                <AvatarImage src={userImg} className="bg-gray-100" />
                <AvatarFallback>User</AvatarFallback>
              </Avatar>
              <p className="mt-1">{user?.name}</p>
            </div>
            <LogOut className="w-5 h-5" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};
