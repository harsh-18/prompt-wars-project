export const getAIRecommendation = async (nodesData, path, startNode, endNode, surgeActive = false) => {
  try {
    const response = await fetch('/api/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nodesData,
        path,
        startNode,
        endNode,
        surgeActive,
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend returned status: ${response.status}`);
    }

    const data = await response.json();
    return data.recommendation || "Path looks clear, enjoy the event!";
  } catch (error) {
    console.error("Recommendation API Error:", error);
    return "Unable to generate AI recommendation at this time. Follow the blue route on your map.";
  }
};
