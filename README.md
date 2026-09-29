# NTCM – Theo Dõi Cưu Mang

Ứng dụng quản lý và theo dõi các hoàn cảnh khó khăn được nhóm **Người Tôi Cưu Mang (NTCM)** hỗ trợ hàng tháng.

Hệ thống hỗ trợ theo dõi **Mạnh Thường Quân (MTQ)**, số tiền và giao dịch hỗ trợ theo từng tháng, thành viên phụ trách, trạng thái hoàn cảnh và báo cáo theo khu vực.

---

## Tính năng chính

* Danh sách hoàn cảnh, lọc theo **khu vực / trạng thái / tháng** và tìm kiếm theo **mã, tên, MTQ**.
* Theo dõi giao dịch hỗ trợ theo từng tháng của mỗi Mạnh Thường Quân.
* Quản lý thành viên phụ trách (**trung chuyển / hỗ trợ**) cho từng hoàn cảnh.
* Đăng nhập Admin để:

  * Thêm và chỉnh sửa hoàn cảnh.
  * Thay đổi trạng thái hoàn cảnh.
  * Thêm Mạnh Thường Quân.
  * Thêm thành viên.
* Thông tin liên hệ, vị trí Google Maps và thông tin chuyển khoản chỉ được hiển thị cho Admin.
* Báo cáo tổng hợp theo khu vực và theo tháng.

---

## Công nghệ sử dụng

| Phần         | Công nghệ                                      |
| ------------ | ---------------------------------------------- |
| **Backend**  | Java, Spring Boot, Spring Data JPA / Hibernate |
| **Frontend** | React, TypeScript, Zustand                     |
| **Database** | MySQL                                          |

---

## Cấu trúc thư mục

```text
NTCM_Theo_doi_cuu_mang/
├── backend/                    # Spring Boot REST API
├── cuumang-frontend/           # React + TypeScript SPA
├── database/
│   └── schema.sql              # Cấu trúc database
└── README.md
```

> Repository chỉ chứa **cấu trúc database** (`schema.sql`), không chứa dữ liệu thật.

Dữ liệu thực tế như tên, thông tin liên hệ, vị trí và thông tin chuyển khoản của các hoàn cảnh không được đưa lên repository nhằm bảo vệ thông tin cá nhân.

---

## Bắt đầu

### Yêu cầu môi trường

* **Java 17+**
* **Maven** hoặc Maven Wrapper đi kèm project
* **Node.js 18+**
* **npm**
* **MySQL 8+**

---

### 1. Thiết lập Database

Tạo database:

```bash
mysql -u root -p -e "CREATE DATABASE theodoicuumang CHARACTER SET utf8mb4;"
```

Import cấu trúc database:

```bash
mysql -u root -p theodoicuumang < database/schema.sql
```

Sau bước này, database sẽ có đầy đủ cấu trúc bảng nhưng chưa có dữ liệu.

Dữ liệu có thể được thêm thông qua giao diện Admin sau khi chạy ứng dụng hoặc chuẩn bị file seed riêng cho môi trường phát triển. Các file chứa dữ liệu thật không được commit lên repository.

---

### 2. Chạy Backend

Di chuyển vào thư mục Backend:

```bash
cd backend
```

Tạo file cấu hình local:

```text
src/main/resources/application-local.properties
```

Ví dụ:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/theodoicuumang
spring.datasource.username=root
spring.datasource.password=your_password
```

> File cấu hình local không được commit lên Git vì có thể chứa thông tin nhạy cảm.

Chạy Backend:

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

Trên Windows có thể sử dụng:

```bash
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
```

Backend mặc định chạy tại:

```text
http://localhost:8080
```

---

### 3. Chạy Frontend

Mở terminal mới và di chuyển vào thư mục Frontend:

```bash
cd cuumang-frontend
```

Cài đặt dependencies:

```bash
npm install
```

Chạy ứng dụng:

```bash
npm run dev
```

Frontend mặc định chạy tại:

```text
http://localhost:5173
```

Nếu Frontend cần cấu hình địa chỉ Backend API, tạo file `.env` hoặc `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

---

## Ghi chú bảo mật

* Không commit mật khẩu database hoặc các file cấu hình chứa thông tin nhạy cảm.
* Sử dụng biến môi trường hoặc file cấu hình local cho các thông tin riêng của môi trường.
* Repository chỉ chứa cấu trúc database (`schema.sql`), không chứa dữ liệu thật.
* Không đưa thông tin cá nhân của các hoàn cảnh lên repository công khai.
* Thông tin liên hệ, vị trí và thông tin chuyển khoản của từng hoàn cảnh chỉ được hiển thị cho Admin.
* Không commit các thông tin như mật khẩu, JWT secret, API key hoặc credentials lên Git.

---

## Đóng góp

Mọi ý kiến đóng góp, báo lỗi hoặc đề xuất tính năng đều được hoan nghênh.


