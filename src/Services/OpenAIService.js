import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configuration Constants
const MODEL_CONFIG = {
  name: "gpt-4o",
  temperature: 1.0,
};

/**
 * Sends image and text to LLM and retrieves logprobs + metadata.
 * @param {string} imagePath - Local path to the image.
 * @param {string} question - The classification question.
 * @returns {Promise<object|null>} Object containing tokenData and config, or null.
 */
export const fetchLogProbs = async (imageDataUrl, question) => {
  if (!imageDataUrl) return null;

  try {
    const response = await openai.chat.completions.create({
      model: MODEL_CONFIG.name,
      logprobs: true,
      top_logprobs: 5,
      max_tokens: 20, // Increased slightly to allow for "Label 100%"
      temperature: MODEL_CONFIG.temperature,
      messages: [
        {
          role: "system",
          content:
            "You are a data labeling agent. You MUST output the label followed by the confidence percentage (e.g., 'Yes 95%', '3 100%'). Do not output only the label.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: question },
            { type: "image_url", image_url: { url: imageDataUrl } },
          ],
        },
      ],
    });

    return {
      tokenData: response.choices[0].logprobs.content[0],
      fullText: response.choices[0].message.content, // Capture the text response
      meta: {
        model: response.model,
        temperature: MODEL_CONFIG.temperature,
      },
    };
  } catch (error) {
    console.error(
      `\n[API Error] Failed to process ${imagePath}:`,
      error.message,
    );
    return null;
  }
};
