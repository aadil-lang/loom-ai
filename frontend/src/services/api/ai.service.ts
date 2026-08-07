import { toast } from 'sonner';

const getAIBase = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  return `${apiUrl}/ai`;
};

export const aiService = {
  /**
   * Streams a chat response from the unified LangGraph Supervisor.
   * Falls back to simple-chat REST endpoint if streaming fails or returns nothing.
   */
  async streamChat(
    message: string,
    sessionId: string,
    context: any,
    onToken: (text: string) => void,
    onAgentSwitch?: (agentName: string) => void
  ) {
    const API_BASE = getAIBase();
    let receivedAny = false;

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, sessionId, context })
      });

      if (!response.ok) {
        throw new Error(`AI stream returned ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('No readable stream');

      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const dataStr = line.replace('data: ', '').trim();
              if (dataStr) {
                const data = JSON.parse(dataStr);
                if (data.error) { console.warn('AI stream error chunk:', data.error); continue; }
                if (data.nextAgent && data.nextAgent !== 'FINISH' && onAgentSwitch) {
                  onAgentSwitch(data.nextAgent);
                }
                if (data.content) {
                  receivedAny = true;
                  onToken(data.content);
                }
              }
            } catch (e) {
              console.warn('Error parsing AI stream chunk', e, line);
            }
          }
        }
      }
    } catch (streamError) {
      console.warn('AI stream failed, falling back to simple-chat:', streamError);
    }

    // Fallback: if streaming failed or produced nothing, use simple REST endpoint
    if (!receivedAny) {
      try {
        const fallbackRes = await fetch(`${API_BASE}/procurement/simple-chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: message })
        });
        if (fallbackRes.ok) {
          const data = await fallbackRes.json();
          const reply = data?.data?.reply || data?.reply;
          if (reply) { onToken(reply); return; }
        }
      } catch (fallbackError) {
        console.error('AI fallback also failed:', fallbackError);
      }
      // Last resort: friendly message
      onToken("I'm sorry — I couldn't reach the AI assistant right now. Please try again in a moment.");
      toast.error('AI assistant is temporarily unavailable.');
    }
  }
};

