"use client";
import { useEffect, useState } from "react";
import MenuItem from "./MenuItem";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const MENU_ITEMS = [
  {
    label: "",
    items: [
      {
        name: "Thông Tin Tài Khoản",
        href: "/",
        icon: "fas fa-tachometer-alt",
      },
      {
        name: "Tất Cả Đơn Hàng",
        href: "/orders",
        icon: "fas fa-receipt",
      },
    ],
  },
  {
    label: "Cài Đặt",
    items: [
      {
        name: "Cài Đặt",
        href: "/settings",
        icon: "fas fa-cog",
      },
    ],
  },
];

const convertRoleLabel = (role) => {
  switch (role) {
    case "khach_hang":
      return "Khách hàng";
    case "shipper":
      return "Shipper";
    case "admin":
      return "Admin";
    default:
      return "Người dùng";
  }
};


export default function Sidebar({ isToggledSidebar, setIsToggledSidebar }) {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Lỗi lấy thông tin user:", error);
    }
  }, []);


  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error("Đăng xuất thất bại");
      }



      window.location.href = "http://localhost:3003";
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error.message);
    }
  };

  return (
    <div
      id="sidebar"
      className={`${isToggledSidebar ? "sidebar-expanded" : "sidebar-collapsed"
        } sidebar bg-white shadow-md`}
    >
      <div className="flex flex-col h-full">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-colapsed-center">
          <div className="text-xl font-bold font-playfair items-center menu-text">
            <span className="text-[#EBBD5B]">LUXE</span>{" "}
            <span className="text-lg font-semibold">SHIPPER</span>
          </div>
          <button
            id="toggle-sidebar"
            className="text-gray-500 hover:text-accent"
            onClick={() => setIsToggledSidebar(!isToggledSidebar)}
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>

        <div className="px-6 py-5 border-b border-gray-100 flex items-center space-x-3 flex-col-colapsed">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <i className="fas fa-user text-gray-500"></i>
          </div>
          <div id="user-info">
            <p className="font-medium menu-text">{user?.ho_ten || "..."}</p>
            <p className="text-xs text-gray-500 menu-text">
              {convertRoleLabel(user?.vai_tro) || "Shipper"}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-4">
            {MENU_ITEMS.map(({ label, items }, groupIndex) => (
              <div className="space-y-1" key={label || `group-${groupIndex}`}>
                {label && (
                  <div className="px-3 py-3 menu-text">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {label}
                    </p>
                  </div>
                )}
                {items.map((item) => (
                  <MenuItem
                    key={item.name}
                    label={item.name}
                    isActive={pathname === item.href}
                    icon={item.icon}
                    url={item.href}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100">
          <a
            href="#"
            className="flex items-center text-gray-700 hover:text-accent"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt mr-3"></i>
            <span className="menu-text">Đăng xuất</span>
          </a>
        </div>
      </div>
    </div>
  );
}
