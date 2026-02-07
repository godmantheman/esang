import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

export async function generateCharacters(prompt: string, count: number) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const aiPrompt = `
    Create high-quality, creative, and diverse character descriptions for an "Ideal Type World Cup" game.
    The topic is: "${prompt}".
    Generate exactly ${count} unique characters.
    For each character, provide:
    1. A short, catchy name.
    2. A brief 1-sentence description.
    
    Output the result as a raw JSON array of objects with "name" and "description" keys.
    Do not include any other markdown formatting or text.
  `;

    try {
        const result = await model.generateContent(aiPrompt);
        const response = await result.response;
        const text = response.text();

        // Clean JSON if needed (sometimes Gemini wraps in ```json)
        const cleanText = text.replace(/```json|```/g, "").trim();
        const characters = JSON.parse(cleanText);

        return characters.map((c: any, i: number) => ({
            ...c,
            imageUrl: `https://picsum.photos/seed/${encodeURIComponent(prompt)}-${i}/800/1200`
        }));
    } catch (error) {
        console.error("Gemini Generation Error:", error);
        // Fallback in case of API error
        return Array.from({ length: count }).map((_, i) => ({
            name: `${prompt} Character #${i + 1}`,
            description: "AI generation failed, using fallback.",
            imageUrl: `https://picsum.photos/seed/${encodeURIComponent(prompt)}-${i}/800/1200`
        }));
    }
}
