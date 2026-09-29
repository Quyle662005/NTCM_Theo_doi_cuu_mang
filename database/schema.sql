-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th9 29, 2026 lúc 12:00 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `theodoicuumang`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `dang_ky_ho_tro`
--

CREATE TABLE `dang_ky_ho_tro` (
  `id` int(11) NOT NULL,
  `hoan_canh_id` int(11) NOT NULL,
  `mtq_id` int(11) NOT NULL,
  `muc_ho_tro_text` varchar(50) DEFAULT NULL,
  `muc_ho_tro_so` decimal(12,2) DEFAULT NULL,
  `ghi_chu` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `giao_dich_thang`
--

CREATE TABLE `giao_dich_thang` (
  `id` int(11) NOT NULL,
  `dang_ky_id` int(11) NOT NULL,
  `hoan_canh_id` int(11) NOT NULL,
  `mtq_id` int(11) NOT NULL,
  `thang` int(11) NOT NULL,
  `nam` int(11) NOT NULL,
  `so_tien` decimal(12,2) DEFAULT NULL,
  `gia_tri_text` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hoan_canh`
--

CREATE TABLE `hoan_canh` (
  `id` int(11) NOT NULL,
  `ma_hc` varchar(20) DEFAULT NULL,
  `ten_hoan_canh` varchar(500) NOT NULL,
  `khu_vuc_id` int(11) DEFAULT NULL,
  `khu_vuc_raw` varchar(200) DEFAULT NULL,
  `cach_thuc_nhan_tien` varchar(100) DEFAULT NULL,
  `thanh_vien_trung_chuyen` varchar(200) DEFAULT NULL,
  `thanh_vien_ho_tro` varchar(200) DEFAULT NULL,
  `link` varchar(500) DEFAULT NULL,
  `muc_de_xuat` decimal(12,2) DEFAULT NULL,
  `trang_thai` varchar(20) NOT NULL DEFAULT 'Dang ho tro',
  `ghi_chu` text DEFAULT NULL,
  `thong_tin_lien_he` varchar(300) DEFAULT NULL,
  `vi_tri` varchar(500) DEFAULT NULL,
  `thong_tin_chuyen_khoan` varchar(255) DEFAULT NULL,
  `muc_binh_quan` decimal(12,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `khu_vuc`
--

CREATE TABLE `khu_vuc` (
  `id` int(11) NOT NULL,
  `ten_khu_vuc` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mang_thuong_quan`
--

CREATE TABLE `mang_thuong_quan` (
  `id` int(11) NOT NULL,
  `ten_mtq` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thanh_vien`
--

CREATE TABLE `thanh_vien` (
  `id` int(11) NOT NULL,
  `hoan_canh_id` int(11) NOT NULL,
  `ten` varchar(200) NOT NULL,
  `loai` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `dang_ky_ho_tro`
--
ALTER TABLE `dang_ky_ho_tro`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_dang_ky_hoan_canh` (`hoan_canh_id`),
  ADD KEY `fk_dang_ky_mtq` (`mtq_id`);

--
-- Chỉ mục cho bảng `giao_dich_thang`
--
ALTER TABLE `giao_dich_thang`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_giao_dich_dangky_thang` (`dang_ky_id`,`thang`,`nam`),
  ADD KEY `fk_giao_dich_hoan_canh` (`hoan_canh_id`),
  ADD KEY `fk_giao_dich_mtq` (`mtq_id`),
  ADD KEY `idx_giao_dich_thang_nam` (`nam`,`thang`);

--
-- Chỉ mục cho bảng `hoan_canh`
--
ALTER TABLE `hoan_canh`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_hoan_canh_khu_vuc` (`khu_vuc_id`),
  ADD KEY `idx_hoan_canh_ma_hc` (`ma_hc`);

--
-- Chỉ mục cho bảng `khu_vuc`
--
ALTER TABLE `khu_vuc`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ten_khu_vuc` (`ten_khu_vuc`);

--
-- Chỉ mục cho bảng `mang_thuong_quan`
--
ALTER TABLE `mang_thuong_quan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ten_mtq` (`ten_mtq`);

--
-- Chỉ mục cho bảng `thanh_vien`
--
ALTER TABLE `thanh_vien`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_thanh_vien_hoan_canh` (`hoan_canh_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `dang_ky_ho_tro`
--
ALTER TABLE `dang_ky_ho_tro`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `giao_dich_thang`
--
ALTER TABLE `giao_dich_thang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `hoan_canh`
--
ALTER TABLE `hoan_canh`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `khu_vuc`
--
ALTER TABLE `khu_vuc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `mang_thuong_quan`
--
ALTER TABLE `mang_thuong_quan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `thanh_vien`
--
ALTER TABLE `thanh_vien`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `dang_ky_ho_tro`
--
ALTER TABLE `dang_ky_ho_tro`
  ADD CONSTRAINT `fk_dang_ky_hoan_canh` FOREIGN KEY (`hoan_canh_id`) REFERENCES `hoan_canh` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_dang_ky_mtq` FOREIGN KEY (`mtq_id`) REFERENCES `mang_thuong_quan` (`id`);

--
-- Các ràng buộc cho bảng `giao_dich_thang`
--
ALTER TABLE `giao_dich_thang`
  ADD CONSTRAINT `fk_giao_dich_dang_ky` FOREIGN KEY (`dang_ky_id`) REFERENCES `dang_ky_ho_tro` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_giao_dich_hoan_canh` FOREIGN KEY (`hoan_canh_id`) REFERENCES `hoan_canh` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_giao_dich_mtq` FOREIGN KEY (`mtq_id`) REFERENCES `mang_thuong_quan` (`id`);

--
-- Các ràng buộc cho bảng `hoan_canh`
--
ALTER TABLE `hoan_canh`
  ADD CONSTRAINT `fk_hoan_canh_khu_vuc` FOREIGN KEY (`khu_vuc_id`) REFERENCES `khu_vuc` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `thanh_vien`
--
ALTER TABLE `thanh_vien`
  ADD CONSTRAINT `fk_thanh_vien_hoan_canh` FOREIGN KEY (`hoan_canh_id`) REFERENCES `hoan_canh` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
