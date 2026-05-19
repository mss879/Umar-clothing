import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full bg-[#f4f6f8] text-gray-900 border-t border-gray-200">
      <div className="max-w-[1600px] mx-auto px-6 py-20 lg:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-8 mb-24">
          
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <Link href="/" className="text-3xl font-bold tracking-tighter select-none">Novure</Link>
            <div className="max-w-md">
              <h4 className="text-sm font-semibold mb-4">Subscribe to our newsletter</h4>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Be the first to know about new arrivals, exclusive collections, and inside access to the world of Novure.
              </p>
              <form className="flex border-b border-gray-300 pb-2 group focus-within:border-gray-900 transition-colors">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                  required
                />
                <button type="submit" className="p-1 hover:bg-gray-100 rounded-full transition-colors group-hover:text-gray-900 text-gray-400">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="flex flex-col gap-6">
            <h4 className="text-sm font-semibold uppercase tracking-widest text-gray-400">Shop</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium">
              <li><Link href="/collections/new-arrivals" className="hover:text-gray-500 transition-colors">New Arrivals</Link></li>
              <li><Link href="/collections/mens" className="hover:text-gray-500 transition-colors">Menswear</Link></li>
              <li><Link href="/collections/womens" className="hover:text-gray-500 transition-colors">Womenswear</Link></li>
              <li><Link href="/collections/accessories" className="hover:text-gray-500 transition-colors">Accessories</Link></li>
              <li><Link href="/collections/sale" className="hover:text-gray-500 transition-colors">Archive Sale</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="flex flex-col gap-6">
            <h4 className="text-sm font-semibold uppercase tracking-widest text-gray-400">Support</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium">
              <li><Link href="/pages/contact" className="hover:text-gray-500 transition-colors">Contact Us</Link></li>
              <li><Link href="/pages/shipping" className="hover:text-gray-500 transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/pages/faq" className="hover:text-gray-500 transition-colors">FAQ</Link></li>
              <li><Link href="/pages/track-order" className="hover:text-gray-500 transition-colors">Track Order</Link></li>
              <li><Link href="/pages/size-guide" className="hover:text-gray-500 transition-colors">Size Guide</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-200 text-xs font-medium text-gray-500">
          <div className="flex items-center gap-6">
            <p>© {new Date().getFullYear()} Novure Studios. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/pages/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
            <Link href="/pages/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
          </div>
          <div className="flex items-center gap-4 text-gray-400 font-semibold text-xs uppercase tracking-widest">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-gray-900 transition-colors">
              Instagram
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-gray-900 transition-colors">
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
