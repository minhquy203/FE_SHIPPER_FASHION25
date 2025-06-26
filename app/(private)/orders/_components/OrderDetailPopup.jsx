export default function OrderDetailPopup({ order, setIsOpen }) {
  const handleChangeStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:3000/api/shipper/order/update-status/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) return;
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi cập nhật trạng thái");
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/shipper/order/cancel-order/${orderId}`, {
        method: "PUT",
      });

      if (!res.ok) {
        alert("Không thể huỷ đơn hàng.");
        return;
      }

      const data = await res.json();

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi huỷ đơn hàng");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-30 px-4 flex items-center">
      <div className="w-[800px] max-w-full border border-black flex flex-col gap-6 p-6 mx-auto bg-white relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3"
        >
          <i className="fa-solid fa-xmark text-3xl"></i>
        </button>
        <h2 className="text-lg text-black font-bold">Chi Tiết Đơn Hàng</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-black font-medium">Họ Và Tên</label>
            <div className="border px-4 py-2">
              <p className="text-sm text-black">{order?.id_customer?.ho_ten}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-black font-medium">
              Số Điện Thoại
            </label>
            <div className="border px-4 py-2">
              <p className="text-sm text-black">{order.sdt}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-black font-medium">
              Mã Đơn Hàng
            </label>
            <div className="border px-4 py-2">
              <p className="text-sm text-black">{order.ma_don_hang}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 ">
            <label className="text-sm text-black font-medium">Số Tiền</label>
            <div className="border px-4 py-2">
              <p className="text-sm text-black">{order.tong_tien}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm text-black font-medium">Địa Chỉ</label>
            <div className="border px-4 py-2">
              <p className="text-sm text-black">
                {order.dia_chi_giao_hang}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm text-black font-medium">
              Địa Chỉ Cụ Thể Cho Tài Xế
            </label>
            <div className="border px-4 py-2">
              <p className="text-sm text-black">Tầng 226, số nhà 26</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm text-black font-medium">
              Email Người Nhận
            </label>
            <div className="border px-4 py-2">
              <p className="text-sm text-black">{order.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-black font-medium">
              Hình Thức Thanh Toán
            </label>
            <div className="border px-4 py-2">
              <p className="text-sm text-black font-bold">
                {order.phuong_thuc_thanh_toan}
              </p>
            </div>
          </div>
          {order.trang_thai_don_hang === "Đang giao" && (
            <div className="grid grid-cols-2 gap-2 items-end">
              <div
                className="bg-[#EBFFEC] text-[#34A853] text-center py-2 px-4 cursor-pointer rounded-md"
                onClick={() => handleChangeStatus(order._id, "Đã giao")}
              >
                Đã giao hàng
              </div>
              <div
                className="bg-[#FFD3D3] text-[#EC0015] text-center py-2 px-4 cursor-pointer rounded-md"
                onClick={() => handleCancelOrder(order._id)}
              >
                Hủy Đơn Hàng
              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  );
}
