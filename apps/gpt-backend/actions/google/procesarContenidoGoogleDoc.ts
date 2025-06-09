// apps/gpt-backend/actions/google/procesarContenidoGoogleDoc.ts

import { JSDOM } from "jsdom";
import axios from "axios";

export async function procesarContenidoGoogleDoc(docUrl: string) {
  const response = await axios.get(docUrl);
  const dom = new JSDOM(response.data);
  const document = dom.window.document;

  const textoPlano = Array.from(
    document.querySelectorAll("p") as NodeListOf<HTMLParagraphElement>
  )
    .map((p) => p.textContent?.trim() || "")
    .filter(Boolean)
    .join("\n");

  return {
    url: docUrl,
    texto: textoPlano,
    longitud: textoPlano.length,
  };
}
