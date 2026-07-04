function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

export function getTelHref(phone) {
  const normalized = String(phone || "").replace(/[^\d+]/g, "");
  return normalized ? `tel:${normalized}` : "tel:";
}

export function getWhatsAppHref(whatsapp, phone) {
  if (typeof whatsapp === "string") {
    const trimmed = whatsapp.trim();

    if (!trimmed) {
      const phoneDigits = digitsOnly(phone);
      return phoneDigits ? `https://wa.me/${phoneDigits}` : "https://wa.me/";
    }

    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }

    const whatsappDigits = digitsOnly(trimmed);
    if (whatsappDigits) {
      return `https://wa.me/${whatsappDigits}`;
    }
  }

  const phoneDigits = digitsOnly(phone);
  return phoneDigits ? `https://wa.me/${phoneDigits}` : "https://wa.me/";
}
