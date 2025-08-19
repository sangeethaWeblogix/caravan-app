// src/api/requirements/cf7.ts
const SITE_BASE = process.env.NEXT_PUBLIC_CFS_API_BASE;
// CF7 form: 155838
const CF7_ENDPOINT = `${SITE_BASE}/contact-forms/155838/feedback`;

export type RequirementPayload = {
  // contact
  name: string;
  email: string;
  phone: string;

  // requirement
  type: string; // e.g. "Hybrid" -> "hybrid" (sent as category)
  condition: string; // e.g. "Near New" -> "near-new"
  location: string; // postcode e.g. "2033"
  requirements: string;
  budget: string; // number-as-string

  // optional flags
  featured?: "0" | "1";
  active?: "0" | "1";
};

export type CF7InvalidField = { into: string; message: string; idref?: string };
export type CF7Response =
  | { status: "mail_sent"; message: string }
  | {
      status: "validation_failed";
      message: string;
      invalid_fields: CF7InvalidField[];
    }
  | { status: "mail_failed"; message: string };

const toSlug = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\s+|_+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");

/**
 * Submit requirement to CF7 (id: 155838)
 * IMPORTANT: field names must match your CF7 form tag names.
 * Adjust the append() keys below to match your actual form.
 */
export async function createRequirementCF7(
  payload: RequirementPayload
): Promise<CF7Response> {
  // Build FormData (do NOT set Content-Type)
  const fd = new FormData();

  // ---- Contact fields (must match your CF7 [text* ...] names) ----
  fd.append("your-name", payload.name);
  fd.append("your-email", payload.email);
  fd.append("your-postcode", payload.phone);

  // ---- Requirement fields ----
  // If your CF7 inputs are named differently (e.g. req_type), change keys below accordingly.
  fd.append("caravan-type", toSlug(payload.type)); // send as lowercase-hyphen
  fd.append("condition", toSlug(payload.condition)); // e.g. "near-new"
  fd.append("location", payload.location); // postcode
  // fd.append("requirements", payload.requirements);
  // fd.append("budget", payload.budget);

  // Optional flags (only if you created hidden fields with these names in CF7)

  const res = await fetch(CF7_ENDPOINT, {
    method: "POST",
    body: fd,
    cache: "no-store",
  });

  // CF7 returns JSON like { status, message, invalid_fields? }
  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new Error(`CF7: Non-JSON response (${res.status})`);
  }

  const data = json as Partial<CF7Response>;
  if (!("status" in (data as object))) {
    throw new Error("CF7: Unexpected response shape");
  }

  // Treat both HTTP and CF7 status:
  if (!res.ok) {
    // Server error
    const msg = (data as any)?.message || `CF7 HTTP error ${res.status}`;
    throw new Error(msg);
  }

  return data as CF7Response;
}
