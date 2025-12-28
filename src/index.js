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
  "On a scale of 0 to 4 (where 0 is no damage and 4 is destroyed), what is the wind state damage rating? Answer with the digit followed by your confidence percentage (e.g., '3 85%').",

  "What is the primary building type shown? Answer with the category name only (e.g., Residential, Commercial, Industrial) followed by your confidence percentage (e.g., 'Residential 98%').",

  "What is the primary composition of the debris visible? Answer with the category name only (e.g., Vegetation, Construction, Miscellaneous, White, NA ) followed by your confidence percentage (e.g., 'Vegetation 75%').",

  "Identify the primary construction material of the main structure. Answer with the category name only (e.g., Wood_Frame, Masonry, Metal) followed by your confidence percentage (e.g., 'Wood_Frame 90%').",

  "Classify the density of the debris field. Answer with the category name only (e.g., Low, Medium, Severe) followed by your confidence percentage (e.g., 'Severe 88%').",
];

async function runWorkflow() {
  console.log("Starting Uncertainty Quantification Workflow...");
  console.log(
    "NOTE: 'Silent Mode' is active. Only ambiguous results (Gap < 60%) will be logged.\n",
  );

  for (const image of images) {
    for (const question of questions) {
      const result = await fetchLogProbs(image.url, question);

      if (result) {
        analyzeUncertainty(
          result.tokenData,
          question,
          image.id,
          result.meta,
          result.fullText,
        );
      }
    }
  }

  console.log("\n\nWorkflow Complete.");
}

runWorkflow();
