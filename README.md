# 🍕 La Pizzaia — Server (Express.js + MongoDB)

<div align="center">

**Backend REST API cho hệ thống quản lý nhà hàng pizza La Pizzaia**

[![Express](https://img.shields.io/badge/Express-5-000000?logo=express)](https://expressjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?logo=mongodb)](https://mongodb.com)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?logo=socket.io)](https://socket.io)
[![API Base URL](https://img.shields.io/badge/API-api.la--pizzaia.site-FF4500)](https://la-pizzaia.site)

</div>

---

## 🌐 Live Demo

Frontend: **→ [https://la-pizzaia.site](https://la-pizzaia.site)**

### Tài khoản test

| Vai trò | Email | Mật khẩu |
|---------|-------|----------|
| **Admin** | `admin@order.com` | `123456` |
| **Customer** | `customer@order.com` | `123456` |
| **Customer 2** | `customer2@order.com` | `123456` |

---

## 🛠️ Tech Stack

| Công nghệ | Mô tả |
|-----------|-------|
| **Express.js 5** | Web framework |
| **TypeScript 5** | Type safety |
| **MongoDB 7** | Database (MongoDB Atlas) |
| **Socket.IO 4** | Realtime communication |
| **fast-jwt** | JWT authentication |
| **bcryptjs** | Password hashing |
| **Zod 4** | Schema validation |
| **Multer + ImageKit** | Upload ảnh |
| **Helmet** | HTTP security headers |
| **nodemon + tsx** | Development hot reload |

---

## 📁 Cấu trúc dự án

```
sever/
├── src/
│   ├── index.ts              # Entry point, khởi tạo server
│   ├── config.ts             # Biến môi trường
│   ├── controllers/          # Xử lý business logic
│   │   ├── auth.controller.ts
│   │   ├── account.controller.ts
│   │   ├── product.controller.ts
│   │   ├── order.controller.ts
│   │   ├── cart.controller.ts
│   │   ├── menu.controller.ts
│   │   ├── ingredient.controller.ts
│   │   ├── supplier.controller.ts
│   │   ├── voucher.controller.ts
│   │   ├── customer.controller.ts
│   │   ├── loyaltyProgram.controller.ts
│   │   ├── indicator.controller.ts
│   │   └── media.controller.ts
│   ├── routes/               # Định nghĩa API routes
│   │   ├── auth.route.ts
│   │   ├── account.route.ts
│   │   ├── product.route.ts
│   │   ├── order.route.ts
│   │   ├── cart.route.ts
│   │   ├── menu.route.ts
│   │   ├── ingredient.route.ts
│   │   ├── supplier.route.ts
│   │   ├── voucher.route.ts
│   │   ├── customer.route.ts
│   │   ├── loyaltyProgram.route.ts
│   │   ├── indicator.route.ts
│   │   └── media.route.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts # JWT verify + phân quyền
│   │   └── error.middleware.ts
│   ├── database/
│   │   ├── index.ts          # MongoDB connection
│   │   └── seed.ts           # Seed dữ liệu mẫu
│   ├── libs/
│   │   └── socket.ts         # Socket.IO setup
│   ├── services/             # Tầng service
│   ├── schemaValidations/    # Zod schemas
│   ├── types/                # TypeScript types
│   └── utils/                # Helper functions
├── .env                      # Biến môi trường
├── nodemon.json
├── tsconfig.json
└── package.json
```

---

## 📡 API Endpoints

### 🔐 Auth — `/auth`

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `POST` | `/auth/login` | Đăng nhập | ❌ |
| `POST` | `/auth/logout` | Đăng xuất | ✅ |
| `POST` | `/auth/refresh-token` | Làm mới access token | ✅ |
| `GET` | `/auth/me` | Thông tin user hiện tại | ✅ |

### 👥 Accounts — `/accounts`

| Method | Endpoint | Mô tả | Role |
|--------|----------|-------|------|
| `GET` | `/accounts` | Danh sách tài khoản | Admin |
| `POST` | `/accounts` | Tạo tài khoản nhân viên | Admin |
| `PUT` | `/accounts/:id` | Cập nhật tài khoản | Admin |
| `DELETE` | `/accounts/:id` | Xóa tài khoản | Admin |
| `GET` | `/accounts/me` | Thông tin cá nhân | ✅ |
| `PUT` | `/accounts/me` | Cập nhật thông tin cá nhân | ✅ |
| `PUT` | `/accounts/me/change-password` | Đổi mật khẩu | ✅ |

### 🍕 Products — `/products`

| Method | Endpoint | Mô tả | Role |
|--------|----------|-------|------|
| `GET` | `/products` | Danh sách sản phẩm | Public |
| `GET` | `/products/:id` | Chi tiết sản phẩm | Public |
| `POST` | `/products` | Tạo sản phẩm | Admin/Manager |
| `PUT` | `/products/:id` | Cập nhật sản phẩm | Admin/Manager |
| `DELETE` | `/products/:id` | Xóa sản phẩm | Admin/Manager |

### 📦 Orders — `/orders`

| Method | Endpoint | Mô tả | Role |
|--------|----------|-------|------|
| `GET` | `/orders` | Danh sách đơn hàng | Admin/Manager |
| `GET` | `/orders/:id` | Chi tiết đơn hàng | ✅ |
| `POST` | `/orders` | Tạo đơn hàng mới | ✅ |
| `PUT` | `/orders/:id/status` | Cập nhật trạng thái | Admin/Manager |
| `GET` | `/orders/my-orders` | Đơn hàng của tôi | Customer |

### 🛒 Cart — `/cart`

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `GET` | `/cart` | Xem giỏ hàng | ✅ |
| `POST` | `/cart` | Thêm vào giỏ | ✅ |
| `PUT` | `/cart/:id` | Cập nhật số lượng | ✅ |
| `DELETE` | `/cart/:id` | Xóa khỏi giỏ | ✅ |

### 📂 Menus — `/menus`

| Method | Endpoint | Mô tả | Role |
|--------|----------|-------|------|
| `GET` | `/menus` | Danh sách danh mục | Public |
| `POST` | `/menus` | Tạo danh mục | Admin/Manager |
| `PUT` | `/menus/:id` | Cập nhật danh mục | Admin/Manager |
| `DELETE` | `/menus/:id` | Xóa danh mục | Admin/Manager |

### 🎫 Vouchers — `/vouchers`

| Method | Endpoint | Mô tả | Role |
|--------|----------|-------|------|
| `GET` | `/vouchers` | Danh sách voucher | Admin |
| `POST` | `/vouchers` | Tạo voucher | Admin |
| `PUT` | `/vouchers/:id` | Cập nhật voucher | Admin |
| `DELETE` | `/vouchers/:id` | Xóa voucher | Admin |
| `POST` | `/vouchers/apply` | Áp dụng voucher | ✅ |

### 📊 Indicators — `/indicators`

| Method | Endpoint | Mô tả | Role |
|--------|----------|-------|------|
| `GET` | `/indicators/dashboard` | Thống kê tổng quan | Admin/Manager |
| `GET` | `/indicators/revenue` | Doanh thu theo thời gian | Admin/Manager |
| `GET` | `/indicators/top-products` | Sản phẩm bán chạy | Admin/Manager |

### 📤 Media — `/media`

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `POST` | `/media/upload` | Upload ảnh (ImageKit) | ✅ |

### Các routes khác

- `GET/POST/PUT/DELETE /ingredients` — Nguyên liệu (Admin/Manager)
- `GET/POST/PUT/DELETE /suppliers` — Nhà cung cấp (Admin/Manager)
- `GET/POST/PUT/DELETE /customers` — Khách hàng (Admin/Manager)
- `GET/POST/PUT/DELETE /loyalty-programs` — Loyalty Program (Admin)

---

## 🔐 Xác thực & Phân quyền

Hệ thống sử dụng **JWT** với 2 token:
- **Access Token**: Hết hạn sau 15 phút, lưu trong cookie `httpOnly`
- **Refresh Token**: Hết hạn sau 7 ngày, lưu trong cookie `httpOnly`

### Middleware phân quyền

```
requireAuth      → Yêu cầu đăng nhập (token hợp lệ)
requireAdmin     → Chỉ Admin
requireManager   → Admin hoặc Manager
requireSales     → Admin, Manager hoặc Sales
```

---

## 🚀 Chạy localhost

### Yêu cầu

- Node.js >= 18
- npm
- MongoDB (local hoặc MongoDB Atlas account)

### 1. Clone và cài đặt

```bash
# Di chuyển vào thư mục server
cd sever

# Cài đặt dependencies
npm install
```

### 2. Cấu hình biến môi trường

Tạo file `.env` tại thư mục `sever/`:

```env
# Server
PORT=4000
CLIENT_URL=http://localhost:3000

# MongoDB
DB_USERNAME=your_mongodb_username
DB_PASSWORD=your_mongodb_password
DB_NAME=la_pizzaia

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_EXPIRES_IN=7d

# Admin mặc định (tự tạo khi khởi động lần đầu)
ADMIN_EMAIL=admin@order.com
ADMIN_PASSWORD=Admin123@

# ImageKit (upload ảnh)
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

### 3. Seed dữ liệu mẫu

```bash
npm run db:seed
```

Lệnh này sẽ tạo:
- ✅ Tài khoản Admin, Manager, Sales, Customer
- ✅ Sản phẩm mẫu (Pizza, Drinks, Desserts, Sides)
- ✅ Nguyên liệu, nhà cung cấp, voucher mẫu
- ✅ Đơn hàng và khách hàng mẫu

### 4. Chạy development server

```bash
npm run dev
```

Server sẽ chạy tại: **[http://localhost:4000](http://localhost:4000)**

### 5. Các lệnh hữu ích

```bash
# Development (nodemon + tsx, hot reload)
npm run dev

# Build TypeScript sang JavaScript
npm run build

# Chạy production build
npm start

# Seed database
npm run db:seed

# Lint
npm run lint
npm run lint:fix

# Prettier
npm run prettier
npm run prettier:fix
```

---

## 🔌 WebSocket (Socket.IO)

Server hỗ trợ realtime qua Socket.IO. Mỗi kết nối cần gửi kèm **Access Token** trong `handshake.auth`:

```js
// Client kết nối
const socket = io('http://localhost:4000', {
  auth: { Authorization: `Bearer ${accessToken}` }
})
```

### Events server → client

| Event | Trigger khi nào | Mô tả |
|-------|----------------|-------|
| `new-order` | Có đơn hàng mới | Thông báo đến phòng Admin/Manager |
| `order-status-updated` | Đơn hàng đổi trạng thái | Cập nhật realtime cho client |
| `dashboard-update` | Có thay đổi liên quan dashboard | Cập nhật số liệu thống kê |
| `refresh-token` | Admin **sửa thông tin** tài khoản nhân viên | Yêu cầu client làm mới token (role/info đổi) |
| `logout` | Admin **xóa** tài khoản nhân viên | Tự động đăng xuất user bị xóa |

### Cơ chế hoạt động

```
Admin xóa tài khoản nhân viên
  └─ Server: deleteEmployeeAccountController
       └─ Tìm socketId của nhân viên đó trong DB
            └─ io.to(socketId).emit('logout')
                 └─ Client: ListenLogoutSocket nhận event
                      └─ Gọi API logout + redirect về trang chủ

Admin sửa thông tin / đổi role nhân viên
  └─ Server: updateEmployeeAccountController
       └─ Tìm socketId của nhân viên đó trong DB
            └─ io.to(socketId).emit('refresh-token')
                 └─ Client: RefreshToken component nhận event
                      └─ Làm mới access token với thông tin role mới
```

---

## 🗄️ Database (MongoDB)

### Collections chính

| Collection | Mô tả |
|------------|-------|
| `accounts` | Tài khoản người dùng |
| `products` | Sản phẩm menu |
| `menus` | Danh mục sản phẩm |
| `orders` | Đơn hàng |
| `carts` | Giỏ hàng |
| `customers` | Thông tin khách hàng |
| `ingredients` | Nguyên liệu |
| `suppliers` | Nhà cung cấp |
| `vouchers` | Mã giảm giá |
| `loyaltyprograms` | Chương trình thành viên |

---

## 🔧 Chạy toàn bộ dự án (Client + Server)

```bash
# Terminal 1 — Backend
cd sever
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:3000 |
| **Backend API** | http://localhost:4000 |

---

<div align="center">

Made with ❤️ by **Thinh Nguyen** — La Pizzaia Restaurant System

</div>
