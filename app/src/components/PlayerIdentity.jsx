import { TShirt } from "@phosphor-icons/react/dist/csr/TShirt";
import { getApprovedPortrait, getKitPalette } from "../utils/playerIdentity.js";

export function PlayerIdentity({
  player,
  tone = "home",
  kitColor,
  className = "",
  decorative = false,
}) {
  const playerName = player?.name ?? "선수";
  const playerNumber = player?.number ?? "-";
  const portrait = getApprovedPortrait(player);
  const palette = getKitPalette(kitColor ?? (tone === "away" ? "#315f7c" : "#176f69"));
  const accessibilityProps = decorative
    ? { "aria-hidden": true }
    : {
        role: "img",
        "aria-label": `${playerName}, 등번호 ${playerNumber}, ${player?.role ?? "선수"}`,
      };

  if (portrait) {
    return (
      <span
        className={`player-identity has-approved-portrait is-${tone} ${className}`.trim()}
        data-identity-mode="approved-portrait"
        {...accessibilityProps}
      >
        <img src={portrait.src} alt="" draggable="false" />
      </span>
    );
  }

  return (
    <span
      className={`player-identity is-kit is-${tone} ${className}`.trim()}
      style={{ "--kit-color": palette.kit, "--kit-ink": palette.ink }}
      data-identity-mode="kit-number"
      {...accessibilityProps}
    >
      <TShirt className="player-identity-shirt" weight="fill" aria-hidden="true" />
      <strong className="player-identity-number">{playerNumber}</strong>
    </span>
  );
}
