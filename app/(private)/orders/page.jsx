"use client";
import { useEffect, useState } from "react";
import { OrderDetailPopup, StatsItem } from "./_components";

const STATS = [
  {
    label: "Tổng Đơn Hàng",
    value: "342",
    icon: "fas fa-receipt",
    color: "bg-green-100 text-green-500",
  },
  {
    label: "Đơn hàng đã nhận",
    value: "1,254",
    icon: "fa-regular fa-square-plus",
    color: "bg-blue-100 text-blue-500",
  },
  {
    label: "Đơn hàng đang giao",
    value: "876",
    icon: "fas fa-spinner",
    color: "bg-yellow-100 text-yellow-500",
  },
  {
    label: "Đã giao",
    value: "₫4,256,000",
    icon: "fas fa-dollar-sign",
    color: "bg-purple-100 text-purple-500",
    percentage: "-3.2",
  },
];

const orders = [
  {
    id: "#LUXE-1001",
    customer: "John Smith",
    date: "15/05/2025",
    amount: "245.000 VNĐ",
    payment_method: "Tiền Mặt",
    status: "Giao Đơn",
  },
  {
    id: "#LUXE-1002",
    customer: "Sarah Johnson",
    date: "15/05/2025",
    amount: "245.000 VNĐ",
    payment_method: "Thẻ/Ví",
    status: "Đã Giao",
  },
  {
    id: "#LUXE-1003",
    customer: "Michabel Brown",
    date: "15/05/2025",
    amount: "245.000 VNĐ",
    payment_method: "Tiền Mặt",
    status: "Giao Thất Bại",
  },
  {
    id: "#LUXE-1004",
    customer: "Emily Davis",
    date: "15/05/2025",
    amount: "245.000 VNĐ",
    payment_method: "Tiền Mặt",
    status: "Giao Thành công",
  },
  {
    id: "#LUXE-1005",
    customer: "Michael Wilson",
    date: "15/05/2025",
    amount: "245.000 VNĐ",
    payment_method: "Thẻ/Ví",
    status: "Giao Thành Công",
  },
  {
    id: "#LUXE-1006",
    customer: "Olivia Martinez",
    date: "15/05/2025",
    amount: "245.000 VNĐ",
    payment_method: "Thẻ/Ví",
    status: "Giao Thành Công",
  },
  {
    id: "#LUXE-1007",
    customer: "James Anderson",
    date: "15/05/2025",
    amount: "245.000 VNĐ",
    payment_method: "Thẻ/Ví",
    status: "Giao Đơn",
  },
  {
    id: "#LUXE-1008",
    customer: "Sophia Thomas",
    date: "15/05/2025",
    amount: "245.000 VNĐ",
    payment_method: "Thẻ/Ví",
    status: "Đã Giao",
  },
  {
    id: "#LUXE-1009",
    customer: "Daniel Moore",
    date: "15/05/2025",
    amount: "245.000 VNĐ",
    payment_method: "Tiền Mặt",
    status: "Giao Thất Bại",
  },
  {
    id: "#LUXE-1010",
    customer: "Isabella Taylor",
    date: "15/05/2025",
    amount: "245.000 VNĐ",
    payment_method: "Tiền Mặt",
    status: "Giao Thành Công",
  },
];

const nextStatusMap = {
  "Shipper đã nhận hàng": "Đang giao",
  "Đang giao": "Đã giao",
  "Đã giao": "Giao hàng thành công",
};

export default function Home() {
  const [orders, setOrders] = useState([]);
  const [isOpenOrderDetailPopup, setIsOpenOrderDetailPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [stats, setStats] = useState([]);

  const handleViewDetail = (id) => {
    const found = orders.find((order) => order._id === id);
    if (found) {
      setSelectedOrder(found);
      setIsOpenOrderDetailPopup(true);
    }
  };
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:3000/api/shipper/order/update-status/${orderId}`, {
        method: "PUT",
      });

      if (!res.ok) throw new Error("Không thể cập nhật trạng thái");
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, trang_thai: newStatus } : o
        )
      );

      setEditingStatusId(null);
    } catch (err) {
      console.error(err);
      alert("Lỗi cập nhật trạng thái");
    }
  };

  useEffect(() => {
    async function fetchOrders() {
      try {
        const token = localStorage.getItem("token");
        console.log(token)
        const res = await fetch("http://localhost:3000/api/shipper/order/get-my-orders", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res)
        const data = await res.json();
        setOrders(data);

        if (Array.isArray(data)) {
          const tongDon = data.length;
          const dangGiao = data.filter((o) => o.trang_thai === "Đang giao").length;
          const daNhan = data.filter(
            (o) => o.trang_thai === "Shipper đã nhận hàng" || o.trang_thai === "Đang giao"
          ).length;
          const daGiao = data
            .filter((o) => o.trang_thai === "Giao hàng thành công")
            .reduce((sum, o) => sum + (o.tong_tien || 0), 0);

          setStats([
            {
              label: "Tổng Đơn Hàng",
              value: tongDon.toString(),
              icon: "fas fa-receipt",
              color: "bg-green-100 text-green-500",
            },
            {
              label: "Đơn hàng đã nhận",
              value: daNhan.toString(),
              icon: "fa-regular fa-square-plus",
              color: "bg-blue-100 text-blue-500",
            },
            {
              label: "Đơn hàng đang giao",
              value: dangGiao.toString(),
              icon: "fas fa-spinner",
              color: "bg-yellow-100 text-yellow-500",
            },
            {
              label: "Đã giao",
              value: `₫${daGiao.toLocaleString("vi-VN")}`,
              icon: "fas fa-dollar-sign",
              color: "bg-purple-100 text-purple-500",
            },
          ]);
        }
      } catch (err) {
        console.error("Lỗi lấy đơn hàng:", err);
      }
    }

    fetchOrders();
  }, []);
  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(({ label, value, icon, color, percentage }) => (
          <StatsItem
            key={label}
            label={label}
            value={value}
            icon={icon}
            color={color}
            percentage={percentage}
          />
        ))}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-medium">Đơn Hàng</h2>
          <button className="text-sm text-[#FFC4C4] hover:underline">
            Xem Tất Cả
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                  Mã Đơn Hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                  Khách Hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                  Ngày
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                  Số Tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                  Hình Thức Thanh Toán
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Array.isArray(orders) && orders?.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{order.ma_don_hang}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order?.id_customer?.ho_ten || "Ẩn danh"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.tong_tien.toLocaleString("vi-VN")} VNĐ
                  </td>
                  <td className="px-6 py-4 font-bold whitespace-nowrap">
                    {order.phuong_thuc_thanh_toan === "COD" ? "Tiền mặt" : "VNPay"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2 w-[200px]">
                    {editingStatusId === order._id ? (
                      <select
                        className="px-2 py-2 text-xs rounded-md text-center min-w-[120px] border border-gray-300"
                        value={order.trang_thai}
                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                        onBlur={() => setEditingStatusId(null)}
                      >
                        <option value={order.trang_thai}>{order.trang_thai}</option>
                        {nextStatusMap[order.trang_thai] && (
                          <option value={nextStatusMap[order.trang_thai]}>
                            {nextStatusMap[order.trang_thai]}
                          </option>
                        )}
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-2 text-xs rounded-md text-center min-w-[120px] inline-block cursor-pointer order-${order.trang_thai
                          .toLowerCase()
                          .normalize("NFD")
                          .replace(/[\u0300-\u036f]/g, "")
                          .replace(/đ/g, "d")
                          .replace(/\s+/g, "_")}`}
                        onClick={() => setEditingStatusId(order._id)}
                      >
                        {order.trang_thai}
                      </span>
                    )}
                    <button
                      className="text-black/50 bg-[#FCF4F4] rounded-full hover:underline p-1.5"
                      onClick={() => handleViewDetail(order._id)}
                    >
                      <i className="fa-solid fa-eye"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isOpenOrderDetailPopup && (
        <OrderDetailPopup
          order={selectedOrder}
          setIsOpen={setIsOpenOrderDetailPopup}
        />
      )}
    </main>
  );
}
