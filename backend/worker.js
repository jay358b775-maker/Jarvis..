import { think } from "./ai-engine.js";

const MAX_MESSAGE_LENGTH = 4000;

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    const allowedOrigin = env.APP_ORIGIN;

    const cors = {
      "Content-Type": "application/json",
      "Vary": "Origin"
    };

    if (origin && origin === allowedOrigin) {
      cors["Access-Control-Allow-Origin"] = allowedOrigin;
      cors["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
      cors["Access-Control-Allow-Headers"] = "Content-Type";
    }

    if (request.method === "OPTIONS") {
      if (!origin || origin !== allowedOrigin) {
        return new Response(null, { status: 403 });
      }
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return Response.json({
        name: "JARVIS",
        status: "online",
        ai: "awaiting configuration"
      }, { headers: cors });
    }

    if (request.method === "POST" && url.pathname === "/think") {
      if (origin !== allowedOrigin) {
        return Response.json(
          { error: "Origin not allowed." },
          { status: 403, headers: cors }
        );
      }

      if (!request.headers.get("Content-Type")?.includes("application/json")) {
        return Response.json(
          { error: "JSON required." },
          { status: 415, headers: cors }
        );
      }

      try {
        const raw = await request.text();

        if (raw.length > 8000) {
          return Response.json(
            { error: "Request too large." },
            { status: 413, headers: cors }
          );
        }

        const body = JSON.parse(raw);

        if (
          typeof body.message !== "string" ||
          !body.message.trim() ||
          body.message.length > MAX_MESSAGE_LENGTH
        ) {
          return Response.json(
            { error: "Message must be 1–4000 characters." },
            { status: 400, headers: cors }
          );
        }

        const result = await think(body.message, env);
        return Response.json(result, { headers: cors });

      } catch {
        return Response.json(
          { error: "JARVIS could not process that request." },
          { status: 500, headers: cors }
        );
      }
    }

    return Response.json(
      { error: "Not found." },
      { status: 404, headers: cors }
    );
  }
};
