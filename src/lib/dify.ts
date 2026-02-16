export type DifyCallbacks = {
  onMessage: (answer: string, conversationId: string) => void;
  onError: (error: unknown) => void;
};

export async function sendDifyMessage(
  query: string,
  conversationId: string | null,
  userId: string,
  signal: AbortSignal,
  callbacks: DifyCallbacks
) {
  const API_KEY = import.meta.env.VITE_DIFY_API_KEY;
  const BASE_URL = import.meta.env.VITE_DIFY_BASE_URL;

  if (!API_KEY || !BASE_URL) {
    throw new Error("Missing Dify API configuration.");
  }

  const response = await fetch(`${BASE_URL}/chat-messages`, {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      inputs: {},
      query,
      response_mode: "streaming",
      conversation_id: conversationId,
      user: userId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) throw new Error("No reader available");

  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;

          let data;
          try {
            data = JSON.parse(jsonStr);
          } catch (e) {
            console.error("Error parsing JSON chunk", e);
            continue;
          }

          if (data.event === "message") {
            callbacks.onMessage(data.answer, data.conversation_id);
          }
        }
      }
    }
  } catch (e) {
    callbacks.onError(e);
    throw e;
  }
}
