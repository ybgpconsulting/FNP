import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, CustomerDeliveryAddress, Product, StoreSettings, VerifiedLocation } from '../types';
import { formatDistanceKm, getGoogleMapsLocationUrl } from '../utils/distance';

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    selectedWeight?: string,
    selectedFlavor?: string,
    customMessage?: string
  ) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalQuantity: number;
  toastMessage: string | null;
  hideToast: () => void;
  generateWhatsAppOrderUrl: (
    settings: StoreSettings,
    customerNotes?: string,
    deliveryPayload?: {
      customerAddress?: CustomerDeliveryAddress;
      verifiedLocation?: VerifiedLocation | null;
      radiusKm?: number;
    }
  ) => string;
  generateSingleProductWhatsAppUrl: (
    product: Product,
    settings: StoreSettings,
    quantity?: number,
    weight?: string,
    flavor?: string,
    customMessage?: string
  ) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'fnp_noida76_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [cart]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3000);
  };

  const hideToast = () => setToastMessage(null);

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedWeight?: string,
    selectedFlavor?: string,
    customMessage?: string
  ) => {
    const safeQuantity = Math.max(1, Math.min(99, Math.floor(quantity || 1)));
    const sanitizedProduct: Product = {
      ...product,
      price: Math.max(0, Number(product.price) || 0),
    };

    setCart((prev) => {
      // Find if identical product with exact same variations already in cart
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedWeight === selectedWeight &&
          item.selectedFlavor === selectedFlavor &&
          item.customMessage === customMessage
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity = Math.min(99, updated[existingIndex].quantity + safeQuantity);
        return updated;
      } else {
        return [
          ...prev,
          {
            product: sanitizedProduct,
            quantity: safeQuantity,
            selectedWeight,
            selectedFlavor,
            customMessage,
          },
        ];
      }
    });

    showToast(`Added "${product.name}" to cart`);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    const safeQuantity = Math.floor(quantity);
    if (safeQuantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index].quantity = Math.min(99, safeQuantity);
      }
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + Math.max(0, Number(item.product.price) || 0) * Math.max(1, Math.floor(item.quantity) || 1),
    0
  );
  const totalQuantity = cart.reduce((sum, item) => sum + Math.max(1, Math.floor(item.quantity) || 1), 0);

  /**
   * Generates the compliant WhatsApp Order message and returns the wa.me URL
   */
  const generateWhatsAppOrderUrl = (
    settings: StoreSettings,
    customerNotes = '',
    deliveryPayload?: {
      customerAddress?: CustomerDeliveryAddress;
      verifiedLocation?: VerifiedLocation | null;
      radiusKm?: number;
    }
  ): string => {
    const rawNumber = settings.whatsappNumber || '919999517599';
    // Clean phone number: remove +, -, spaces
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');

    // Format products list
    const productLines = cart.map((item, index) => {
      const optionsParts = [];
      if (item.selectedWeight) optionsParts.push(`Weight: ${item.selectedWeight}`);
      if (item.selectedFlavor) {
        const flavorClean = item.selectedFlavor.toLowerCase().includes('egg') ? '100% Eggless' : item.selectedFlavor;
        optionsParts.push(`Type: ${flavorClean}`);
      } else if (item.product.categoryId === 'cat-cakes' || item.product.categorySlug === 'cakes') {
        optionsParts.push(`Type: 100% Eggless`);
      }
      if (item.customMessage) optionsParts.push(`Message on Cake/Card: "${item.customMessage}"`);
      const optionsText = optionsParts.length > 0 ? `\n   (${optionsParts.join(', ')})` : '';

      const itemSubtotal = item.product.price * item.quantity;
      return `${index + 1}. ${item.product.name}${optionsText}\n   Qty: ${item.quantity}\n   Price: ₹${item.product.price}\n   Subtotal: ₹${itemSubtotal}`;
    });

    const productsBlock = productLines.join('\n\n');

    let deliveryBlock = '';
    const addr = deliveryPayload?.customerAddress;
    const loc = deliveryPayload?.verifiedLocation;
    const radius = deliveryPayload?.radiusKm || 10;

    if (addr) {
      const distFormatted = loc ? formatDistanceKm(loc.distanceKm) : 'Within standard range';
      const mapsUrl = loc ? getGoogleMapsLocationUrl(loc.latitude, loc.longitude) : '';

      deliveryBlock = `DELIVERY DETAILS

Customer Name: ${addr.name}
Mobile: ${addr.mobile}

Address:
House/Flat: ${addr.houseFlat}
Society/Building: ${addr.buildingSociety}
Area: ${addr.streetArea}
City: ${addr.city}
State: ${addr.state}
Pincode: ${addr.pincode}
${
  loc
    ? `
Delivery Location:
Latitude: ${loc.latitude.toFixed(6)}
Longitude: ${loc.longitude.toFixed(6)}

Distance from FNP Store:
${distFormatted}

Delivery Status:
Verified – Within ${radius} km

Google Maps Location:
${mapsUrl}
`
    : ''
}`;
    }

    const notesBlock = customerNotes.trim()
      ? `Special Instructions / Notes:\n${customerNotes.trim()}`
      : '';

    // Generate formatted message matching prompt specs
    const messageParts = [
      'Hi, I would like to place an order from FNP Florist & Bakery (Sector 76 Noida).',
      deliveryBlock,
      `Order Details:\n\n${productsBlock}`,
      `Total: ₹${subtotal}`,
      notesBlock,
      'Please confirm product availability and delivery details.',
    ].filter(Boolean);

    const message = messageParts.join('\n\n');
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${cleanNumber}?text=${encoded}`;
  };

  /**
   * Quick order directly for a single product from the Product Detail Page
   */
  const generateSingleProductWhatsAppUrl = (
    product: Product,
    settings: StoreSettings,
    quantity = 1,
    weight?: string,
    flavor?: string,
    customMessage?: string
  ): string => {
    const rawNumber = settings.whatsappNumber || '919999517599';
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');

    const optionsParts = [];
    if (weight) optionsParts.push(`Weight: ${weight}`);
    if (flavor) {
      const flavorClean = flavor.toLowerCase().includes('egg') ? '100% Eggless' : flavor;
      optionsParts.push(`Type: ${flavorClean}`);
    } else if (product.categoryId === 'cat-cakes' || product.categorySlug === 'cakes') {
      optionsParts.push(`Type: 100% Eggless`);
    }
    if (customMessage) optionsParts.push(`Message: "${customMessage}"`);
    const optionsText = optionsParts.length > 0 ? `\n   (${optionsParts.join(', ')})` : '';

    const total = product.price * quantity;

    const message = `Hi, I would like to order directly from FNP Florist & Bakery (Sector 76 Noida).

Product: ${product.name}${optionsText}
Quantity: ${quantity}
Price: ₹${product.price} each
Total Amount: ₹${total}

Please confirm availability and delivery to Sector 76, Noida.`;

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalQuantity,
        toastMessage,
        hideToast,
        generateWhatsAppOrderUrl,
        generateSingleProductWhatsAppUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
