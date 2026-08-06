import { generateText } from "../services/llmService";

export async function procurementAgent(query: string) {

    const prompt = `
    You are an expert textile procurement assistant.

    User Query:
    ${query}
    `;

    return await generateText(prompt);

}
