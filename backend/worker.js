import { think } from "./ai-engine.js";

export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    const url = new URL(request.url);

    if (url.pathname === "/health" && request.method === "GET") {
      return Response.json({
        name: "JARVIS",
        status: "online",
        ai: "waiting for provider setup"
      }, { headers: cors });
    }

    if (url.pathname === "/think" && request.method === "POST") {
      try {
        const body = await request.json();
        const result = await think(body.message, env);

        return Response.json(result, { headers: cors });
      } catch (error) {
        return Response.json({
          error: "JARVIS could not process that request."
        }, {
          status: 400,
          headers: cors
        });
      }
    }

    return Response.json(
      { error: "Not found" },
      { status: 404, headers: cors }
    );
  }
};
