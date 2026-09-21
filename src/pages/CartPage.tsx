import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronRight,
  Home,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Store,
  Trash2,
  Truck,
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { useCart } from '../../src/context/CartContext';
import { useStore } from '../../src/context/StoreContext';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, totalQuantity, generateWhatsAppOrderUrl } =
    useCart();
  const { settings } = useStore();

  const [deliveryNotes, setDeliveryNotes] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [preferredSlot, setPreferredSlot] = useState<string>('Standard Delivery (2-3 hrs)');

  const handleWhatsAppCheckout = () => {
    const formattedNotes = [
      customerName ? `Customer: ${customerName}` : '',
      customerPhone ? `Phone: ${customerPhone}` : '',
      deliveryAddress ? `Address: ${deliveryAddress}` : 'Address: Sector 76, Noida',
      preferredSlot ? `Time: ${preferredSlot}` : '',
      deliveryNotes ? `Special Request: ${deliveryNotes}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const whatsappUrl = generateWhatsAppOrderUrl(settings, formattedNotes);
    window.open(whatsappUrl, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
        <SEO title="Your Cart is Empty | FNP Sector 76 Noida" />
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md border border-[#EADBDA] mb-4 text-[#831843]">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
        <p className="text-gray-500 max-w-sm mb-6 text-sm">
          Looks like you haven&apos;t added any celebratory cakes or fresh flower bouquets to your cart yet.
        </p>
        <Link
          to="/shop"
          className="px-8 py-3.5 rounded-full bg-[#831843] hover:bg-[#6b1336] text-white font-bold text-sm shadow-md transition-all"
        >
          Browse Our Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 sm:py-12">
      <SEO
        title={`Review Order (${totalQuantity} items) | FNP Florist & Bakery Noida Sector 76`}
        description="Review your selected celebration cakes and flowers before WhatsApp confirmation. Fast delivery across Sector 76, Noida."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-gray-800 flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link to="/shop" className="hover:text-gray-800">
            Shop
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-gray-900 font-semibold">Review Order &amp; WhatsApp Checkout</span>
        </nav>

        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#29141B] tracking-tight mb-8">
          Review Your Order
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADBDA] shadow-sm divide-y divide-gray-100">
              {cart.map((item, index) => {
                const itemSubtotal = item.product.price * item.quantity;
                const imageSrc =
                  item.product.images?.[0] ||
                  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=300&auto=format&fit=crop';

                return (
                  <div key={index} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Item visual + Details */}
                    <div className="flex items-start sm:items-center gap-4">
                      <img
                        src={imageSrc}
                        alt={item.product.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 border border-gray-100"
                      />

                      <div className="space-y-1">
                        <Link
                          to={`/product/${item.product.slug}`}
                          className="font-serif text-base sm:text-lg font-bold text-gray-900 hover:text-[#831843] transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>

                        <div className="text-xs text-gray-500 space-y-0.5">
                          {item.selectedWeight && (
                            <p>
                              Weight: <strong className="text-gray-700">{item.selectedWeight}</strong>
                            </p>
                          )}
                          {item.selectedFlavor && (
                            <p>
                              Type: <strong className="text-gray-700">{item.selectedFlavor}</strong>
                            </p>
                          )}
                          {item.customMessage && (
                            <p className="text-[#831843] font-medium italic">
                              Message: &ldquo;{item.customMessage}&rdquo;
                            </p>
                          )}
                        </div>

                        <p className="text-xs text-gray-400">₹{item.product.price} each</p>
                      </div>
                    </div>

                    {/* Quantity + Subtotal + Remove */}
                    <div className="flex items-center justify-between w-full sm:w-auto gap-6 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-0 border-gray-50">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50">
                        <button
                          type="button"
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          className="p-1.5 text-gray-600 hover:text-gray-900"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-gray-800">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="p-1.5 text-gray-600 hover:text-gray-900"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right min-w-[70px]">
                        <span className="text-base font-bold text-gray-900">₹{itemSubtotal}</span>
                      </div>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(index)}
                        className="p-2 text-gray-400 hover:text-rose-600 rounded-lg transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Delivery Details & Notes Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADBDA] shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-gray-900">
                Delivery Details &amp; Custom Instructions
              </h3>
              <p className="text-xs text-gray-500">
                Provide delivery recipient information or special instructions. These will be formatted directly into your WhatsApp message.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Recipient / Customer name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#831843]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="E.g., 9876543210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#831843]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Delivery Address / Society in Noida
                </label>
                <input
                  type="text"
                  placeholder="E.g., Flat 402, Tower 5, Amrapali Silicon City, Sector 76, Noida"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#831843]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Preferred Delivery Slot / Special Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="E.g., Deliver by 7:00 PM evening, please carry candles and cake knife."
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#831843]"
                />
              </div>
            </div>

            {/* Back to Shopping button */}
            <div className="flex justify-between items-center pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#831843] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>

              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-rose-600 hover:underline"
              >
                Clear Entire Cart
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary & WhatsApp Action */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADBDA] shadow-sm sticky top-24 space-y-6">
              <h2 className="font-serif text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Total Items</span>
                  <span className="font-medium text-gray-900">{totalQuantity}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Items Subtotal</span>
                  <span className="font-medium text-gray-900">₹{subtotal}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Local Delivery (Sector 76)</span>
                  <span className="text-emerald-700 font-semibold">Free / Inquire on WhatsApp</span>
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                  <span className="text-base font-bold text-gray-900">Estimated Total</span>
                  <span className="text-2xl font-extrabold text-[#831843]">₹{subtotal}</span>
                </div>
              </div>

              {/* Seamless Order on WhatsApp Primary CTA */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-base shadow-lg hover:shadow-xl flex items-center justify-center gap-2.5 transition-all active:scale-95"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>Order on WhatsApp</span>
                </button>

                <p className="text-[11px] text-gray-500 text-center leading-snug">
                  No online payment required right now. Clicking opens WhatsApp with your complete order breakdown pre-filled to confirm delivery with our store team.
                </p>
              </div>

              {/* Local Trust Badges */}
              <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#831843] shrink-0" />
                  <span>Pickup option: Shop 29, Crystal Home</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#831843] shrink-0" />
                  <span>Doorstep delivery across Sector 76 Noida</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#831843] shrink-0" />
                  <span>Pay on Delivery / UPI upon confirmation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
