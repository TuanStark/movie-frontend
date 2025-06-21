"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div>
            <Link href="/" className="flex items-center mb-4">
              <Image 
                src="/logo1.jpg" 
                alt="Movie Tickets" 
                width={40} 
                height={40} 
                className="mr-2"
              />
              <span className="text-white font-bold text-xl">MovieTickets</span>
            </Link>
            <p className="mb-4 text-gray-400">
              Đặt vé xem phim trực tuyến dễ dàng, nhanh chóng với nhiều ưu đãi hấp dẫn.
              Trải nghiệm điện ảnh tuyệt vời tại các rạp chiếu hàng đầu.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/movies" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Phim đang chiếu
                </Link>
              </li>
              <li>
                <Link href="/movies" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Phim sắp chiếu
                </Link>
              </li>
              <li>
                <Link href="/theaters" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Rạp chiếu phim
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Tin tức điện ảnh
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Tài khoản
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 text-primary-400" />
                <span>123 Đường Phim Ảnh, Quận 1, TP.HCM</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-primary-400" />
                <span>(+84) 123 456 789</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-primary-400" />
                <span>support@movietickets.vn</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Đăng ký nhận thông báo</h3>
            <p className="text-gray-400 mb-4">
              Nhận thông tin về phim mới và ưu đãi đặc biệt.
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Email của bạn"
                className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} MovieTickets. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
              Điều khoản sử dụng
            </Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
              Chính sách bảo mật
            </Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
              Trợ giúp
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 