export type CropArea = { x: number; y: number; width: number; height: number };

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (e) => reject(e));
    img.setAttribute("crossOrigin", "anonymous");
    img.src = url;
  });

export async function cropImageToBlob(
  imageSrc: string,
  crop: CropArea,
  rotation = 0
): Promise<Blob> {
  const image = await createImage(imageSrc);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  // Draw the rotated image onto an offscreen canvas first.
  const rotRad = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rotRad));
  const cos = Math.abs(Math.cos(rotRad));
  const bBoxWidth = image.width * cos + image.height * sin;
  const bBoxHeight = image.width * sin + image.height * cos;

  const safeCanvas = document.createElement("canvas");
  safeCanvas.width = bBoxWidth;
  safeCanvas.height = bBoxHeight;
  const safeCtx = safeCanvas.getContext("2d");
  if (!safeCtx) throw new Error("Canvas not supported");

  safeCtx.translate(bBoxWidth / 2, bBoxHeight / 2);
  safeCtx.rotate(rotRad);
  safeCtx.translate(-image.width / 2, -image.height / 2);
  safeCtx.drawImage(image, 0, 0);

  canvas.width = crop.width;
  canvas.height = crop.height;
  ctx.drawImage(
    safeCanvas,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error("Failed to export image"));
      resolve(blob);
    }, "image/webp", 0.92);
  });
}

