import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      mobile,
      selectedFrame,
      frameSize,
      quantity,
      cityPincode,
      address,
      notes,
    } = body;

    const whatsappNumber = process.env.WHATSAPP_NUMBER;

    if (!whatsappNumber) {
      return NextResponse.json(
        { error: "WhatsApp number not configured" },
        { status: 500 }
      );
    }

    // Build message lines
    const lines: string[] = [
      "नमस्कार रिद्धी सिद्धी फ्रेम्स!",
      "",
      "मला फ्रेम ऑर्डर करायची आहे.",
      "",
      `ग्राहकाचे नाव: ${customerName}`,
      `मोबाईल नंबर: ${mobile}`,
      `निवडलेली फ्रेम: ${selectedFrame}`,
    ];

    if (frameSize) {
      lines.push(`आकार: ${frameSize}`);
    }

    lines.push(`प्रमाण: ${quantity}`);
    lines.push(`शहर / पिनकोड: ${cityPincode}`);

    if (address && address.trim()) {
      lines.push(`पत्ता: ${address}`);
    }

    if (notes && notes.trim()) {
      lines.push(`विशेष सूचना: ${notes}`);
    }

    lines.push("");
    lines.push("कृपया ऑर्डर आणि पुढील प्रक्रियेबद्दल माहिती द्या.");
    lines.push("");
    lines.push("धन्यवाद!");

    const message = lines.join("\n");
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    return NextResponse.json({ url: whatsappUrl });
  } catch {
    return NextResponse.json(
      { error: "ऑर्डर पाठवताना काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा." },
      { status: 500 }
    );
  }
}

// GET endpoint for simple WhatsApp chat link (contact section)
export async function GET() {
  const whatsappNumber = process.env.WHATSAPP_NUMBER;

  if (!whatsappNumber) {
    return NextResponse.json(
      { error: "WhatsApp number not configured" },
      { status: 500 }
    );
  }

  const message = encodeURIComponent(
    "नमस्कार! मला रिद्धी सिद्धी फ्रेम्सबद्दल माहिती हवी आहे."
  );
  const url = `https://wa.me/${whatsappNumber}?text=${message}`;

  return NextResponse.json({ url });
}
