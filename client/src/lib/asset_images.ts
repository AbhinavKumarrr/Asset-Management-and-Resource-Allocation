type AssetLike = {
  name: string;
  category?: string;
};

const imageMap: Record<string, string> = {
  "canon eos 90d dslr": "/assets/canon-eos-90d.jpg",
  "canon 50mm f/1.8 lens": "/assets/canon-50mm-lens.jpg",
  "dslr camera": "/assets/dslr-camera.jpg",
  "studio light kit": "/assets/studio-light-kit.jpg",
  "godox sl-60w led light": "/assets/godox-sl60w.jpg",
  "jbl eon615 speaker": "/assets/jbl-speaker.jpg",
  "audio mixer": "/assets/audio-mixer.jpg",
  "canopy tent 10×10": "/assets/canopy-tent.jpg",
  "crowd barricade": "/assets/barricade.jpg",
  "folding banquet table": "/assets/banquet-table.jpg",
  "folk dance costume set": "/assets/costume-set.jpg",
  "stage prop set": "/assets/stage-props.jpg"
};

const categoryFallbacks: Record<string, string> = {
  "dslr cameras": "/assets/dslr-camera.jpg",
  "studio lighting": "/assets/studio-light-kit.jpg",
  "audio systems": "/assets/jbl-speaker.jpg",
  "event infrastructure": "/assets/canopy-tent.jpg",
  "costumes": "/assets/costume-set.jpg",
  "stage props": "/assets/stage-props.jpg"
};

export function getAssetImage(asset: AssetLike) {
  const nameKey = asset.name.trim().toLowerCase();
  const categoryKey = (asset.category || "").trim().toLowerCase();

  return (
    imageMap[nameKey] ||
    categoryFallbacks[categoryKey] ||
    "/assets/placeholder-asset.jpg"
  );
}