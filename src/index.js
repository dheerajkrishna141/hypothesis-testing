import { createDataUrl } from "./helperFunction.js";
import { fetchLogProbs } from "./Services/OpenAIService.js";
import { analyzeUncertainty } from "./Services/UncertainityAnalyzer.js";

const imageDataUrl1 = createDataUrl(
  "/home/kratosfury/Research/scripts/assets/image_0001.png",
);
const imageDataUrl2 = createDataUrl(
  "/home/kratosfury/Research/scripts/assets/image_0020.png",
);

const imageDataUrl3 = createDataUrl(
  "/home/kratosfury/Research/scripts/assets/image_0056.jpeg",
);

const imageDataUrl4 = createDataUrl(
  "/home/kratosfury/Research/scripts/assets/image_0061.jpeg",
);

const images = [
  { id: "image_0001.png", url: imageDataUrl1 },
  { id: "image_0020.png", url: imageDataUrl2 },
  { id: "image_0056.jpeg", url: imageDataUrl3 },
  { id: "image_0061.jpeg", url: imageDataUrl4 },
];

const questions = [
  "Is there visible flooding in this image? Answer strictly with the label ('Yes' or 'No') followed by your confidence percentage (e.g., 'Yes 95%').",

  "Is the primary structure in this image elevated? Answer strictly with the label ('Yes' or 'No') followed by your confidence percentage (e.g., 'No 90%').",

  "On a scale of 0 to 4 (where 0 is no damage and 4 is destroyed), what is the wind state damage rating? Answer with the digit followed by your confidence percentage (e.g., '3 85%').",

  "What is the primary building type shown? Answer with the category name only followed by your confidence percentage (e.g., 'Residential 98%').",

  "What is the primary type of debris visible? Answer with the category name only followed by your confidence percentage (e.g., 'Vegetation 75%').",
];

// --- EXECUTION LOOP ---
async function runWorkflow() {
  console.log("Starting Uncertainty Quantification Workflow...");
  console.log(
    "NOTE: 'Silent Mode' is active. Only ambiguous results (Gap < 60%) will be logged.\n",
  );

  for (const image of images) {
    // Optional: Log which image is processing if you want to track progress
    // console.log(`Processing ${image.id}...`);

    for (const question of questions) {
      // 1. Call the API (The Tool)
      const result = await fetchLogProbs(image.url, question);

      if (result) {
        // 2. Analyze the result (The Research)
        analyzeUncertainty(
          result.tokenData,
          question,
          image.id,
          result.meta,
          result.fullText, // <--- New: Passing the model's spoken answer
        );
      }
    }
  }

  console.log("\n\nWorkflow Complete.");
}

runWorkflow();
