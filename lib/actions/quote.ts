"use server";

import { Resend } from "resend";

export type QuoteRequestState = {
  status: "idle" | "success" | "error";
  message: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const GENERIC_ERROR_MESSAGE =
  "Não foi possível enviar o pedido. Tenta novamente mais tarde.";

const MAX_LENGTHS = {
  name: 120,
  phone: 40,
  message: 5000,
};

function sanitizeSingleLine(value: string, maxLength: number) {
  const withoutControlChars = Array.from(value)
    .filter((char) => {
      const code = char.codePointAt(0) ?? 0;
      return code >= 0x20 && code !== 0x7f;
    })
    .join("");

  return withoutControlChars.trim().slice(0, maxLength);
}

export async function sendQuoteRequest(
  _prevState: QuoteRequestState,
  formData: FormData
): Promise<QuoteRequestState> {
  const name = sanitizeSingleLine(
    String(formData.get("name") ?? ""),
    MAX_LENGTHS.name
  );
  const email = String(formData.get("email") ?? "").trim();
  const phone = sanitizeSingleLine(
    String(formData.get("phone") ?? ""),
    MAX_LENGTHS.phone
  );
  const message = String(formData.get("message") ?? "")
    .trim()
    .slice(0, MAX_LENGTHS.message);

  if (!name || !email || !message) {
    return { status: "error", message: "Preenche o nome, email e mensagem." };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { status: "error", message: "Indica um email válido." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.RESEND_TO_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !toEmail || !fromEmail) {
    console.error(
      "Resend não está configurado: define RESEND_API_KEY, RESEND_TO_EMAIL e RESEND_FROM_EMAIL."
    );
    return { status: "error", message: GENERIC_ERROR_MESSAGE };
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `Novo pedido de orçamento — ${name}`,
      text: [
        `Nome: ${name}`,
        `Email: ${email}`,
        phone ? `Telefone: ${phone}` : null,
        "",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    if (error) {
      console.error("Resend error:", error);
      return { status: "error", message: GENERIC_ERROR_MESSAGE };
    }
  } catch (err) {
    console.error("Resend error:", err);
    return { status: "error", message: GENERIC_ERROR_MESSAGE };
  }

  return {
    status: "success",
    message: "Pedido enviado com sucesso. Entraremos em contacto brevemente.",
  };
}
