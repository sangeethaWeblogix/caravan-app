// src/api/enquiry/api.ts

// ---------- PRODUCT ENQUIRY (existing pattern) ----------
const API_BASE = process.env.NEXT_PUBLIC_CFS_API_BASE;
// e.g. "https://www.dev.caravansforsale.com.au/wp-json/cfs/v1"

export type ProductEnquiryPayload = {
  product_id: number | string;
  email: string;
  name: string;
  phone: string;
  postcode: string;
};

export type ProductEnquiryResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
};

export async function createProductEnquiry(
  payload: ProductEnquiryPayload
): Promise<ProductEnquiryResponse> {
  if (!API_BASE) throw new Error("Missing NEXT_PUBLIC_CFS_API_BASE");

  const res = await fetch(`${API_BASE}/product_enquiry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const raw = await res.text();
  let json: ProductEnquiryResponse;
  try {
    json = raw ? JSON.parse(raw) : {};
  } catch {
    json = { message: raw || "Invalid JSON from server" };
  }

  if (!res.ok) {
    throw new Error(json.message || "Product enquiry failed");
  }

  return json;
}

// ---------- CONTACT (CF7 via Next.js proxy: /api/contact) ----------
const CONTACT_API_BASE = process.env.NEXT_PUBLIC_CONTACT_API_BASE || "/api";

export type ContactFormPayload = {
  name: string;
  email: string;
  phone: string;
  postcode: string;
  message: string;
};

export type ContactResponse = {
  status?: "mail_sent" | "validation_failed" | "mail_failed" | string;
  message?: string;
  invalid_fields?: Array<{ into?: string; field: string; message: string }>;
};

export async function createContactEnquiry(
  payload: ContactFormPayload
): Promise<ContactResponse> {
  const res = await fetch(`${CONTACT_API_BASE}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const raw = await res.text();
  let json: ContactResponse;
  try {
    json = raw ? JSON.parse(raw) : {};
  } catch {
    json = { message: raw || "Invalid JSON from server" };
  }

  if (!res.ok) {
    throw new Error(json.message || "Contact enquiry failed");
  }

  return json;
}
