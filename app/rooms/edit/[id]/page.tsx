import { Suspense } from "react";
"use client"
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import axios from "axios";

const availableAmenities = [
  { id: "Wifi", name: "WiFi" },
  { id: "Máy lạnh", name: "Máy lạnh" },
  { id: "Máy nước nóng", name: "Máy nước nóng" },
  { id: "Tủ lạnh", name: "Tủ lạnh" },
  { id: "Máy giặt", name: "Máy giặt" },
  { id: "Nội thất cơ bản", name: "Nội thất cơ bản" },
];

function EditRoomPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    DayPhong: "",
    SoPhong: "",
    GiaPhong: "",
    TienIch: [] as string[],
  });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios.get(`https://all-oqry.onrender.com/api/phong/${id}`)
      .then(res => {
        setForm({
          DayPhong: res.data.DayPhong || "",
          SoPhong: res.data.SoPhong || "",
          GiaPhong: res.data.GiaPhong || "",
          TienIch: res.data.TienIch || [],
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Không tìm thấy phòng hoặc lỗi mạng.");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setForm(prev => ({
      ...prev,
      TienIch: checked
        ? [...prev.TienIch, amenity]
        : prev.TienIch.filter(a => a !== amenity),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/phong/dat-phong", {
        DayPhong: form.DayPhong,
        SoPhong: form.SoPhong,
        GiaPhong: form.GiaPhong,
        TienIch: form.TienIch,
      });
      router.push("/rooms");
    } catch (err) {
      setError("Lỗi khi cập nhật phòng!");
    }
  };

  if (loading) return <div className="p-8 text-center">Đang tải dữ liệu...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Chỉnh sửa phòng</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="block font-medium mb-1">Dãy phòng</Label>
          <Input
            name="DayPhong"
            value={form.DayPhong}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label className="block font-medium mb-1">Số phòng</Label>
          <Input
            name="SoPhong"
            value={form.SoPhong}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label className="block font-medium mb-1">Giá phòng (VND)</Label>
          <Input
            name="GiaPhong"
            type="number"
            value={form.GiaPhong}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label className="block font-medium mb-1">Tiện ích</Label>
          <div className="flex flex-wrap gap-2">
            {availableAmenities.map((amenity) => (
              <label key={amenity.id} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={form.TienIch.includes(amenity.id)}
                  onChange={e => handleAmenityChange(amenity.id, e.target.checked)}
                />
                {amenity.name}
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button type="button" variant="outline" onClick={() => router.push("/rooms")} className="flex-1">Hủy</Button>
          <Button type="submit" className="flex-1 bg-blue-600 text-white">Lưu</Button>
        </div>
      </form>
    </div>
  );
} 

export default function EditRoomPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditRoomPage />
    </Suspense>
  );
}
