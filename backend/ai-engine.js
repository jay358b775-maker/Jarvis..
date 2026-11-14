export async function think(message, env) {
  if (typeof message !== "string" || !message.trim()) {
    throw new Error("A message is required.");
  }

  if (!env.AI_API_KEY || !env.AI_API_URL || !env.AI_MODEL) {
    return {
      status: "not_connected",
      message: "JARVIS is waiting for its AI provider."
    };
  }

  const response = await fetch(env.AI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.AI_API_KEY}`
    },
    body: JSON.stringify({
      model: env.AI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are JARVIS, a helpful AI assistant. Be clear, accurate and ask for approval before external actions."
        },
        {
          role: "user",
          content: message.trim()
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error("AI provider request failed.");
  }

  const data = await response.json();

  return {
    status: "success",
    reply: data.choices?.[0]?.message?.content || "I couldn't generate a response."
  };
}
