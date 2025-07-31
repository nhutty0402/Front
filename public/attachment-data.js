import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './CapNhatChiSo.css';
// import { ServiceManager } from './CapNhatChiSo';
// ĐÃ GỘP CSS, KHÔNG CẦN import './ban.css';

// Banner riêng cho trang cập nhật chỉ số
const CapNhatChiSoBanner = ({
    isBannerVisible,
    searchQuery,
    setSearchQuery,
    toggleSidebar,
    isSidebarVisible,
    activeTab,
    setActiveTab,
    setShowCapNhatChiSo
}) => {
    return (
        <>
            {/* Header */}
            <header className={`cns-header ${isBannerVisible ? '' : 'cns-header-hidden'}`}>
                <div className="cns-search-bar">
                    <div className="cns-button-group">
                        <div className="cns-menu-toggle" onClick={toggleSidebar}>☰</div>
                        <div className="cns-header-title">Nhà trọ Cần Thơ</div>
                        <input
                            className="cns-search-input"
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            {/* Sidebar */}
            <div className={`cns-sidebar${isSidebarVisible ? ' visible' : ''}`}>
                <div className="cns-logo_content">
                    <div className="cns-logo">
                        <div className="cns-icon">
                            <img src="cantho.jpg" alt="Logo" />
                        </div>
                        <div className="cns-logo_name">Xin chào, admin</div>
                    </div>
                    <button className="cns-close-sidebar" onClick={toggleSidebar}>×</button>
                </div>

                <ul className="cns-nav_list">
                    <li>
                      <Link 
                        to="/" 
                        className={activeTab === 'home' ? 'active' : ''} 
                        onClick={() => setActiveTab('home')}
                      >
                        <span className="cns-icon">🏠</span>
                        <span className="cns-link_name">Trang chủ</span>
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/quan-ly-khach-hang" 
                        className={activeTab === 'customers' ? 'active' : ''} 
                        onClick={() => setActiveTab('customers')}
                      >
                        <span className="cns-icon">🧑‍💼</span>
                        <span className="cns-link_name">Quản lý khách hàng</span>
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/doanh-thu" 
                        className={activeTab === 'revenue' ? 'active' : ''} 
                        onClick={() => setActiveTab('revenue')}
                      >
                        <span className="cns-icon">💰</span>
                        <span className="cns-link_name">Doanh thu</span>
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/dich-vu" 
                        className={activeTab === 'services' ? 'active' : ''} 
                        onClick={() => setActiveTab('services')}
                      >
                        <span className="cns-icon">💡</span>
                        <span className="cns-link_name">Dịch vụ</span>
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/cap-nhat-chi-so" 
                        className={activeTab === 'capnhatchiso' ? 'active' : ''} 
                        onClick={() => setActiveTab('capnhatchiso')}
                      >
                        <span className="cns-icon">⚡</span>
                        <span className="cns-link_name">Cập nhật chỉ số</span>
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/hoa-don" 
                        className={activeTab === 'bills' ? 'active' : ''} 
                        onClick={() => setActiveTab('bills')}
                      >
                        <span className="cns-icon">🧾</span>
                        <span className="cns-link_name">Hóa đơn</span>
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/quan-ly-hop-dong" 
                        className={activeTab === 'contracts' ? 'active' : ''} 
                        onClick={() => setActiveTab('contracts')}
                      >
                        <span className="cns-icon">📂</span>
                        <span className="cns-link_name">Quản lý hợp đồng</span>
                      </Link>
                    </li>
                    <li>
                      <a href="#" className="cns-logout-link">
                        <span className="cns-icon"><i className="fas fa-sign-out-alt"></i></span>
                        <span className="cns-link_name">Đăng Xuất</span>
                      </a>
                    </li>
                  </ul>
            </div>
        </>
    );
};

// Thêm component quản lý giá điện nước
function ElectricWaterPriceManager() {
  // Giả lập giá cũ, thực tế có thể lấy từ props hoặc API
  const [prices, setPrices] = useState({
    dien: 3500, // giá cũ điện
    nuoc: 12000 // giá cũ nước
  });
  const [newPrices, setNewPrices] = useState({
    dien: '',
    nuoc: ''
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPrices(prev => ({ ...prev, [name]: value }));
  };
  const handleUpdate = (type) => {
    if (newPrices[type] && !isNaN(newPrices[type])) {
      setPrices(prev => ({ ...prev, [type]: Number(newPrices[type]) }));
      setNewPrices(prev => ({ ...prev, [type]: '' }));
      alert(`Cập nhật giá ${type === 'dien' ? 'điện' : 'nước'} thành công!`);
    }
  };
  return (
    <div className="ewp-container">
      <div className="ewp-title">
        <h3>Quản lý giá điện nước</h3>
      </div>
      <div className="ewp-product-list">
        <div className="ewp-product">
          <input type="text" value="Điện" readOnly className="ewp-name" />
          <input type="number" value={prices.dien} readOnly className="ewp-old-price" />
          <input type="number" name="dien" value={newPrices.dien} onChange={handleInputChange} placeholder="Nhập giá mới " min="0" className="ewp-new-price" />
          <div className="ewp-btn-group">
            <button className="ewp-update-btn" onClick={() => handleUpdate('dien')}>Cập nhật</button>
          </div>
        </div>
        <div className="ewp-product">
          <input type="text" value="Nước" readOnly className="ewp-name" />
          <input type="number" value={prices.nuoc} readOnly className="ewp-old-price" />
          <input type="number" name="nuoc" value={newPrices.nuoc} onChange={handleInputChange} placeholder="Nhập giá mới " min="0" className="ewp-new-price" />
          <div className="ewp-btn-group">
            <button className="ewp-update-btn" onClick={() => handleUpdate('nuoc')}>Cập nhật</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const CapNhatChiSo = () => {
    const navigate = useNavigate();
    // State cho banner/menu
    const [isBannerVisible, setIsBannerVisible] = useState(true);
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('capnhatchiso');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('');
    const [thangNam, setThangNam] = useState('');
    const [oldElectricReading, setOldElectricReading] = useState(0);
    const [newElectricReading, setNewElectricReading] = useState('');
    const [electricConsumption, setElectricConsumption] = useState('');
    const [oldWaterReading, setOldWaterReading] = useState(0);
    const [newWaterReading, setNewWaterReading] = useState('');
    const [waterConsumption, setWaterConsumption] = useState('');
    const [roomsData, setRoomsData] = useState([]);
    const [readingHistory, setReadingHistory] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedDay, setSelectedDay] = useState('all');
    const [updateDate, setUpdateDate] = useState(() => {
        const now = new Date();
        return `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    });

    const toggleSidebar = () => {
        setIsSidebarVisible((prev) => !prev);
    };

    // Mock data - trong thực tế sẽ lấy từ API
    useEffect(() => {
        // Giả lập dữ liệu phòng
        const mockRoomsData = [
            {
                phong: { PhongID: 1, DayPhong: 'A', SoPhong: '101' },
                ten_khach_hang: 'Nguyễn Văn A',
                latest_reading: { ChiSoDienMoi: 150, ChiSoNuocMoi: 25 }
            },
            {
                phong: { PhongID: 2, DayPhong: 'A', SoPhong: '102' },
                ten_khach_hang: 'Trần Thị B',
                latest_reading: { ChiSoDienMoi: 200, ChiSoNuocMoi: 30 }
            },
            {
                phong: { PhongID: 3, DayPhong: 'B', SoPhong: '201' },
                ten_khach_hang: 'Lê Văn C',
                latest_reading: null
            }
        ];
        setRoomsData(mockRoomsData);

        // Set tháng năm hiện tại
        const now = new Date();
        const currentMonthYear = `${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
        setThangNam(currentMonthYear);
    }, []);

    const handleRoomChange = (e) => {
        const roomId = e.target.value;
        setSelectedRoom(roomId);
        
        if (roomId) {
            const selectedRoomData = roomsData.find(room => room.phong.PhongID.toString() === roomId);
            if (selectedRoomData) {
                const oldElectric = selectedRoomData.latest_reading?.ChiSoDienMoi || 0;
                const oldWater = selectedRoomData.latest_reading?.ChiSoNuocMoi || 0;
                
                setOldElectricReading(oldElectric);
                setOldWaterReading(oldWater);
                setNewElectricReading('');
                setNewWaterReading('');
                setElectricConsumption('');
                setWaterConsumption('');
                
                // Load reading history
                loadReadingHistory(roomId);
            }
        }
    };

    const calculateElectricConsumption = (value) => {
        setNewElectricReading(value);
        const newReading = parseInt(value) || 0;
        const oldReading = oldElectricReading;
        
        if (newReading >= oldReading) {
            setElectricConsumption(newReading - oldReading);
        } else {
            setElectricConsumption('Lỗi: Chỉ số mới phải >= chỉ số cũ');
        }
    };

    const calculateWaterConsumption = (value) => {
        setNewWaterReading(value);
        const newReading = parseInt(value) || 0;
        const oldReading = oldWaterReading;
        
        if (newReading >= oldReading) {
            setWaterConsumption(newReading - oldReading);
        } else {
            setWaterConsumption('Lỗi: Chỉ số mới phải >= chỉ số cũ');
        }
    };

    const loadReadingHistory = (roomId) => {
        // Giả lập loading và dữ liệu lịch sử
        setReadingHistory([]);
        setTimeout(() => {
            const mockHistory = [
                {
                    phong: 'A101',
                    thangNam: '12/2023',
                    chiSoDienCu: 100,
                    chiSoDienMoi: 150,
                    tieuThuDien: 50,
                    chiSoNuocCu: 20,
                    chiSoNuocMoi: 25,
                    tieuThuNuoc: 5,
                    trangThai: 'Đã thanh toán'
                }
            ];
            setReadingHistory(mockHistory);
        }, 1000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate form
        if (!selectedRoom || !thangNam || !newElectricReading || !newWaterReading) {
            setMessages([{ type: 'error', text: 'Vui lòng điền đầy đủ thông tin' }]);
            return;
        }

        if (parseInt(newElectricReading) < oldElectricReading) {
            setMessages([{ type: 'error', text: 'Chỉ số điện mới phải lớn hơn hoặc bằng chỉ số cũ' }]);
            return;
        }

        if (parseInt(newWaterReading) < oldWaterReading) {
            setMessages([{ type: 'error', text: 'Chỉ số nước mới phải lớn hơn hoặc bằng chỉ số cũ' }]);
            return;
        }

        // Giả lập gửi dữ liệu
        console.log('Submitting data:', {
            phong_id: selectedRoom,
            thang_nam: thangNam,
            chi_so_dien_cu: oldElectricReading,
            chi_so_dien_moi: newElectricReading,
            chi_so_nuoc_cu: oldWaterReading,
            chi_so_nuoc_moi: newWaterReading
        });

        setMessages([{ type: 'success', text: 'Cập nhật chỉ số thành công!' }]);
        
        // Reset form
        setSelectedRoom('');
        setNewElectricReading('');
        setNewWaterReading('');
        setElectricConsumption('');
        setWaterConsumption('');
        setOldElectricReading(0);
        setOldWaterReading(0);
    };

    // Lấy danh sách dãy phòng duy nhất
    const uniqueDays = [...new Set(roomsData.map(room => room.phong.DayPhong))];
    // Lọc danh sách phòng theo dãy
    const filteredRooms = selectedDay === 'all' ? roomsData : roomsData.filter(room => room.phong.DayPhong === selectedDay);

    return (
        <div className="cap-nhat-chi-so">
            <CapNhatChiSoBanner
                isBannerVisible={isBannerVisible}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                toggleSidebar={toggleSidebar}
                isSidebarVisible={isSidebarVisible}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setShowCapNhatChiSo={() => {}}
            />
            <ElectricWaterPriceManager />
            {/* <ServiceManager /> */}
            {/* Header with back button */}
            {/* <div className="cap-nhat-chi-so-header">
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                    <i className="fas fa-arrow-left"></i> Quay lại
                </button>
                <h1>Cập Nhật Chỉ Số Điện Nước</h1>
            </div> */}

            {/* Main Content */}
            <div className="main-content">
                <div className="container-fluid">
                    {/* Messages display */}
                    {messages.length > 0 && (
                        <div className="messages-container">
                            {messages.map((message, index) => (
                                <div key={index} className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                                    {message.text}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Form card */}

                    <div className="card mb-4">
                        <h5 className="card-header">Nhập Chỉ Số Mới</h5>

                           {/* Ngày cập nhật chỉ là một dòng số, không input, không label */}
                                <div style={{ fontWeight: 500, color: '#446993', marginBottom: 8, fontSize: 15 }}>
                                    Ngày cập nhật: {updateDate}
                                </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Dãy phòng</label>
                                            <select
                                                className="filter-select"
                                                value={selectedDay}
                                                onChange={e => {
                                                    setSelectedDay(e.target.value);
                                                    setSelectedRoom(''); // reset phòng khi đổi dãy
                                                }}
                                            >
                                                <option value="all">Tất cả dãy</option>
                                                {uniqueDays.map(day => (
                                                    <option key={day} value={day}>Dãy {day}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Phòng</label>
                                            <select
                                                className="form-control"
                                                value={selectedRoom}
                                                onChange={handleRoomChange}
                                                required
                                            >
                                                <option value="">Chọn phòng</option>
                                                {filteredRooms.map(room => (
                                                    <option key={room.phong.PhongID} value={room.phong.PhongID}>
                                                        {room.phong.DayPhong}{room.phong.SoPhong} - {room.ten_khach_hang}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                             

                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <div className="reading-card">
                                            <h3>Điện</h3>
                                            <div className="input-group">
                                                <label>Chỉ số cũ:</label>
                                                <input 
                                                    type="number" 
                                                    value={oldElectricReading}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label>Chỉ số mới:</label>
                                                <input 
                                                    type="number" 
                                                    value={newElectricReading}
                                                    onChange={(e) => calculateElectricConsumption(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label>Tiêu thụ:</label>
                                                <input 
                                                    type="text" 
                                                    value={electricConsumption}
                                                    className="consumption" 
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="reading-card">
                                            <h3>Nước</h3>
                                            <div className="input-group">
                                                <label>Chỉ số cũ:</label>
                                                <input 
                                                    type="number" 
                                                    value={oldWaterReading}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label>Chỉ số mới:</label>
                                                <input 
                                                    type="number" 
                                                    value={newWaterReading}
                                                    onChange={(e) => calculateWaterConsumption(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label>Tiêu thụ:</label>
                                                <input 
                                                    type="text" 
                                                    value={waterConsumption}
                                                    className="consumption" 
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-end">
                                    <button type="submit" className="btn btn-primary">
                                        Cập Nhật Chỉ Số
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Readings History */}
                    <div className="card">
                        <h5 className="card-header">Lịch Sử Chỉ Số Điện Nước</h5>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Phòng</th>
                                            <th>Tháng/Năm</th>
                                            <th>Chỉ số Điện (Cũ)</th>
                                            <th>Chỉ số Điện (Mới)</th>
                                            <th>Tiêu thụ Điện</th>
                                            <th>Chỉ số Nước (Cũ)</th>
                                            <th>Chỉ số Nước (Mới)</th>
                                            <th>Tiêu thụ Nước</th>
                                            <th>Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {readingHistory.length > 0 ? (
                                            readingHistory.map((reading, index) => (
                                                <tr key={index}>
                                                    <td>{reading.phong}</td>
                                                    <td>{reading.thangNam}</td>
                                                    <td>{reading.chiSoDienCu}</td>
                                                    <td>{reading.chiSoDienMoi}</td>
                                                    <td>{reading.tieuThuDien}</td>
                                                    <td>{reading.chiSoNuocCu}</td>
                                                    <td>{reading.chiSoNuocMoi}</td>
                                                    <td>{reading.tieuThuNuoc}</td>
                                                    <td>{reading.trangThai}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="9" className="text-center">
                                                    {selectedRoom ? 'Đang tải dữ liệu...' : 'Chọn phòng để xem lịch sử'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CapNhatChiSo; 