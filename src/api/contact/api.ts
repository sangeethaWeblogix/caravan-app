// src/app/api/contact/route.ts
import { NextResponse } from "next/server";

const CFS_API_BASE = process.env.CFS_API_BASE!; // e.g. https://www.caravansforsale.com.au/wp-json/cfs/v1
const CFS_FORM_ID = process.env.CFS_FORM_ID || "155838";

const DEST = `${CFS_API_BASE.replace(
  /\/$/,
  ""
)}/contact-forms/${CFS_FORM_ID}/feedback`;

export async function POST(req: Request) {
  try {
    const p = await req.json();

    // Map to your CFS/CF7 tag names (you asked for: your-name, your-emai, your-postcode, message)
    const fd = new FormData();
    fd.append("your-name", p.name);
    // Handle both spellings just in case the form tag is "your-emai" (without 'l')
    fd.append("your-emai", p.email);
    fd.append("your-email", p.email);
    fd.append("your-postcode", p.postcode);
    fd.append("message", p.message);
    // Optional: include phone if your form has that field (won't break if it doesn't)
    if (p.phone) fd.append("your-phone", p.phone);

    const upstream = await fetch(DEST, {
      method: "POST",
      body: fd,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    const ct = upstream.headers.get("content-type") || "";
    const text = await upstream.text();

    if (!ct.includes("application/json")) {
      return NextResponse.json(
        {
          status: "mail_failed",
          message: "CFS returned non-JSON",
          preview: text.slice(0, 200),
        },
        { status: 502 }
      );
    }

    const data = JSON.parse(text);
    // Forward JSON. Use 200 if mail_sent, else 400 so client shows toast error.
    const ok = upstream.ok && data?.status === "mail_sent";
    return NextResponse.json(data, { status: ok ? 200 : 400 });
  } catch (e: any) {
    return NextResponse.json(
      { status: "mail_failed", message: e?.message || "Contact proxy failed" },
      { status: 500 }
    );
  }
}
