import sharp from "sharp";
import path from "path";

async function processGreenBranch() {
  const inputPath = path.resolve("public/assets/branch-green.jpg");
  const outputPath = path.resolve("public/assets/branch-green.png");

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Clear perimeter to guarantee ZERO rectangular bounding box
      if (x < 6 || x > width - 7 || y < 6 || y > height - 7) {
        data[idx + 3] = 0;
        continue;
      }

      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      // If it's near-white background
      if (r > 225 && g > 225 && b > 225) {
        data[idx + 3] = 0;
      } else if (brightness > 200 && r > 185 && b > 185) {
        const alpha = Math.max(0, Math.min(255, Math.round(255 * (1 - (brightness - 200) / (230 - 200)))));
        data[idx + 3] = alpha;
      }
    }
  }

  await sharp(data, {
    raw: { width, height, channels: 4 }
  }).png().toFile(outputPath);

  console.log("Updated branch-green.png with 100% clean borders!");
}

async function processGoldBranch() {
  const inputPath = path.resolve("public/assets/branch-gold.jpg");
  const outputPath = path.resolve("public/assets/branch-gold.png");

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Clear perimeter to guarantee ZERO rectangular bounding box
      if (x < 6 || x > width - 7 || y < 6 || y > height - 7) {
        data[idx + 3] = 0;
        continue;
      }

      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      if (brightness < 45 && r < 50 && g < 50 && b < 50) {
        data[idx + 3] = 0;
      } else if (brightness < 75) {
        const alpha = Math.max(0, Math.min(255, Math.round(255 * ((brightness - 45) / (75 - 45)))));
        data[idx + 3] = alpha;
      }
    }
  }

  await sharp(data, {
    raw: { width, height, channels: 4 }
  }).png().toFile(outputPath);

  console.log("Updated branch-gold.png with 100% clean borders!");
}

async function run() {
  await processGreenBranch();
  await processGoldBranch();
}

run().catch(console.error);
