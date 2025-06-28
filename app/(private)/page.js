'use client';

import { useEffect, useState } from 'react';
import Cookies from "js-cookie";

export default function Page() {
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    ho_ten: '',
    dia_chi: '',
    so_dien_thoai: '',
    ngay_thang_nam_sinh: '',
    gioi_tinh: 'khác',
  });

  useEffect(() => {
    const fetchUser = async () => {
      const userStr = Cookies.get("user");
      let token;
      if (userStr) {
        const user = JSON.parse(decodeURIComponent(userStr));
        token = user.access_token;
      }
      localStorage.setItem("token", token);
      if (!token) return;

      try {
        const res = await fetch(`${process.env.minhquy203}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Không thể lấy thông tin người dùng");

        const data = await res.json();
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);

        setFormData({
          ho_ten: data.user.ho_ten || '',
          dia_chi: data.user.dia_chi || '',
          so_dien_thoai: data.user.so_dien_thoai || '',
          ngay_thang_nam_sinh: data.user.ngay_thang_nam_sinh?.slice(0, 10) || '',
          gioi_tinh: data.user.gioi_tinh || 'khác',
        });

      } catch (error) {
        console.error('Lỗi khi lấy user:', error.message);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.minhquy203}/api/auth/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Cập nhật thất bại");

      const data = await res.json();
      alert("Cập nhật thành công!");
      setUser(data.user);

    } catch (error) {
      console.error("Lỗi cập nhật:", error.message);
      alert("Cập nhật thất bại!");
    }
  };

  if (!user) return null;

  return (
    <div className="w-4/5 max-w-full mx-auto flex flex-col gap-6 bg-white mt-20 py-4">
      <div className="px-6">
        <h1 className="text-xl font-bold text-black mb-1">Thông tin cá nhân</h1>
        <p>Thay đổi thông tin cá nhân của bạn</p>
      </div>
      <hr />
      <div className="pt-6 px-6 grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm text-[#364153] font-bold">Họ & Tên</label>
          <input
            type="text"
            name="ho_ten"
            className="border px-4 py-2 w-full text-sm"
            value={formData.ho_ten}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-[#364153] font-bold">Email</label>
          <input
            type="email"
            className="border px-4 py-2 w-full text-sm"
            value={user.email}
            disabled
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="text-sm text-[#364153] font-bold">Địa chỉ cư trú</label>
          <input
            type="text"
            name="dia_chi"
            className="border px-4 py-2 w-full text-sm"
            value={formData.dia_chi}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="text-sm text-[#364153] font-bold">Số điện thoại</label>
          <input
            type="text"
            name="so_dien_thoai"
            className="border px-4 py-2 w-full text-sm"
            value={formData.so_dien_thoai}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="text-sm text-[#364153] font-bold">Ngày tháng năm sinh</label>
          <input
            type="date"
            name="ngay_thang_nam_sinh"
            className="border px-4 py-2 w-full text-sm"
            value={formData.ngay_thang_nam_sinh}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="text-sm text-[#364153] font-bold">Giới Tính</label>
          <div className="flex items-center gap-4">
            {["nam", "nữ", "khác"].map(gender => (
              <label key={gender} className="flex items-center gap-1 capitalize">
                <input
                  type="radio"
                  name="gioi_tinh"
                  value={gender}
                  checked={formData.gioi_tinh === gender}
                  onChange={handleChange}
                />
                {gender}
              </label>
            ))}
          </div>
        </div>
        <div className="space-y-1 md:col-span-2 flex justify-end">
          <button
            className="bg-[#EBFFEC] text-[#34A853] text-center py-2 px-4 cursor-pointer rounded-md w-fit"
            onClick={handleSave}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
