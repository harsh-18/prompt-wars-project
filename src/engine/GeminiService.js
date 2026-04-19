export const getAIRecommendation = async (nodesData, path, startNode, endNode) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'placeholder_replace_with_real_key') {
    return "AI recommendation is offline. Please configure your Gemini API key.";
  }

  // Build a summary of the current densities for context
  const densityContext = Object.entries(nodesData)
    .filter(([id]) => path.includes(id) || id === startNode || id === endNode)
    .map(([id, data]) => `${id} density is ${data.density}%`)
    .join(', ');

  const prompt = `You are an AI crowd navigation assistant for a stadium. 
The user wants to navigate from node ${startNode} to node ${endNode}.
The computed optimal path is: ${path.join(' -> ')}.
Current relevant crowd densities: ${densityContext}.
Based on this path and crowd density, provide a helpful and encouraging 2-sentence navigation recommendation. Be concise.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 100,
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Path looks clear, enjoy the event!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate AI recommendation at this time. Follow the blue route on your map.";
  }
};
