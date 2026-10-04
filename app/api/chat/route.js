// Native fetch implementation for Gemini API

export async function POST(req) {
  try {
    const { messages } = await req.json();

    // Convert OpenAI format to Gemini format
    const geminiContents = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.OPENAI_API_KEY,
        },
        body: JSON.stringify({
          system_instruction: {
            parts: { text: "You are a helpful customer support assistant for VoltCare, a platform for MSEDCL electricity consumers. You help users with billing issues, power outages, and service requests. Be concise and polite." }
          },
          contents: geminiContents.filter(msg => msg.role !== "system" && msg.parts[0].text !== "You are a helpful customer support assistant for VoltCare, a platform for MSEDCL electricity consumers. You help users with billing issues, power outages, and service requests. Be concise and polite.") // system prompt is passed separately
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini error:", data);
      return Response.json(
        { error: data.error?.message || "Could not process your request." },
        { status: response.status }
      );
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    return Response.json({ message: { role: "assistant", content: reply } });
  } catch (error) {
    console.error("Chat error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
