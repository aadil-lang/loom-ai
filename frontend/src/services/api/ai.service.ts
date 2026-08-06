import { toast } from 'sonner';

const API_BASE = 'http://localhost:5000/api/v1/ai'; // Adjust if proxy is used

export const aiService = {
  /**
   * Streams a chat response from the unified LangGraph Supervisor.
   * Calls the provided callbacks as stream chunks arrive.
   */
  async streamChat(
    message: string,
    sessionId: string,
    context: any,
    onToken: (text: string) => void,
    onAgentSwitch?: (agentName: string) => void
  ) {
    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}` // if needed
        },
        body: JSON.stringify({ message, sessionId, context })
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) return;

      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        // Process SSE lines
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || ''; // keep the incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const dataStr = line.replace('data: ', '').trim();
              if (dataStr) {
                const data = JSON.parse(dataStr);
                
                if (data.error) {
                  toast.error(`AI Error: ${data.error}`);
                  continue;
                }

                if (data.nextAgent && data.nextAgent !== 'FINISH' && onAgentSwitch) {
                  onAgentSwitch(data.nextAgent);
                }

                if (data.content) {
                  onToken(data.content);
                }
              }
            } catch (e) {
              console.warn("Error parsing AI stream chunk", e, line);
            }
          }
        }
      }
    } catch (error) {
      console.error("AI Stream Error:", error);
      toast.error("Failed to reach LoomAI Assistant.");
    }
  }
};
