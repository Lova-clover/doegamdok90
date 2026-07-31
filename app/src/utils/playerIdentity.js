const portraitRequirements = ["src", "license", "attribution", "permissionReference"];

export function getApprovedPortrait(player) {
  const portrait = player?.portrait;
  if (!portrait || portrait.rightsStatus !== "cleared") return null;
  if (!portraitRequirements.every((field) => String(portrait[field] ?? "").trim())) {
    return null;
  }
  return portrait;
}

const normalizeHex = (color) => {
  const value = String(color ?? "").trim();
  if (/^#[0-9a-f]{6}$/i.test(value)) return value;
  if (/^#[0-9a-f]{3}$/i.test(value)) {
    return `#${value.slice(1).split("").map((digit) => `${digit}${digit}`).join("")}`;
  }
  return "#176f69";
};

export function getKitPalette(color) {
  const kit = normalizeHex(color);
  const red = Number.parseInt(kit.slice(1, 3), 16);
  const green = Number.parseInt(kit.slice(3, 5), 16);
  const blue = Number.parseInt(kit.slice(5, 7), 16);
  const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
  return {
    kit,
    ink: luminance > 0.62 ? "#10251b" : "#ffffff",
  };
}
