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

    if (url.pathname === "/health") {
      return Response.json({
        name: "JARVIS",
        status: "online",
        ai: "not connected"
      }, { headers: cors });
    }

    if (url.pathname === "/think" && request.method === "POST") {
      return Response.json({
        message: "JARVIS AI connection is pending."
      }, { status: 501, headers: cors });
    }

    return Response.json(
      { error: "Not found" },
      { status: 404, headers: cors }
    );
  }
};
