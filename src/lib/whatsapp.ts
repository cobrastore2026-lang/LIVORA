import { CartItem } from "@/types";

export const DEFAULT_WHATSAPP = "967737462144";

/**
 * Formats a phone number into international digits only without '+' or spaces.
 */
export function cleanWhatsAppNumber(phone?: string | null): string {
  if (!phone) return DEFAULT_WHATSAPP;
  const digits = phone.replace(/\D/g, "");
  return digits.length > 0 ? digits : DEFAULT_WHATSAPP;
}

export interface SingleProductOrderParams {
  productName: string;
  price: string | number;
  variantText?: string | null;
  productUrl?: string;
  whatsappNumber?: string;
}

/**
 * Generates WhatsApp URL for single product direct order.
 */
export function getSingleProductWhatsAppUrl({
  productName,
  price,
  variantText,
  productUrl,
  whatsappNumber = DEFAULT_WHATSAPP,
}: SingleProductOrderParams): string {
  const cleanPhone = cleanWhatsAppNumber(whatsappNumber);
  const formattedPrice = typeof price === "number" ? `${price.toLocaleString('ar-YE')} ر.ي` : price;

  let message = `السلام عليكم، أريد طلب هذا المنتج:\n\n`;
  message += `اسم المنتج: ${productName}\n`;
  message += `السعر: ${formattedPrice}\n`;
  if (variantText && variantText.trim() !== '') {
    message += `الخيارات: ${variantText}\n`;
  }
  if (productUrl) {
    message += `رابط المنتج: ${productUrl}\n`;
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export interface CartOrderParams {
  items: CartItem[];
  totalAmount: number;
  currency?: string;
  whatsappNumber?: string;
  notes?: string;
}

/**
 * Generates WhatsApp URL for cart checkout with multiple items.
 */
export function getCartWhatsAppUrl({
  items,
  totalAmount,
  currency = "ر.ي",
  whatsappNumber = DEFAULT_WHATSAPP,
  notes,
}: CartOrderParams): string {
  const cleanPhone = cleanWhatsAppNumber(whatsappNumber);

  let message = `السلام عليكم، أرغب في طلب المنتجات التالية من متجر ليفورا:\n\n`;

  items.forEach((item, index) => {
    const itemTotal = item.unitPrice * item.quantity;
    const variantStr = item.variantOption ? ` (${item.variantName || 'الخيار'}: ${item.variantOption})` : '';
    message += `${index + 1}. ${item.product.name}${variantStr} × ${item.quantity} = ${itemTotal.toLocaleString('ar-YE')} ${currency}\n`;
  });

  message += `\nالإجمالي: ${totalAmount.toLocaleString('ar-YE')} ${currency}\n`;

  if (notes && notes.trim() !== '') {
    message += `\nملاحظات: ${notes.trim()}\n`;
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}
