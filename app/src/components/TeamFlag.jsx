import AR from "country-flag-icons/react/3x2/AR";
import BE from "country-flag-icons/react/3x2/BE";
import BR from "country-flag-icons/react/3x2/BR";
import FR from "country-flag-icons/react/3x2/FR";
import GH from "country-flag-icons/react/3x2/GH";
import HR from "country-flag-icons/react/3x2/HR";
import JP from "country-flag-icons/react/3x2/JP";
import KR from "country-flag-icons/react/3x2/KR";
import PT from "country-flag-icons/react/3x2/PT";

const flagByCode = { AR, BE, BR, FR, GH, HR, JP, KR, PT };

export function TeamFlag({ code, label, className = "", decorative = false }) {
  const Flag = flagByCode[code];
  if (!Flag) {
    return (
      <span
        className={`team-flag team-flag-fallback ${className}`.trim()}
        aria-hidden={decorative || undefined}
        aria-label={decorative ? undefined : `${label ?? code} 국기`}
      >
        {code}
      </span>
    );
  }

  return (
    <span
      className={`team-flag ${className}`.trim()}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : `${label} 국기`}
    >
      <Flag aria-hidden="true" focusable="false" />
    </span>
  );
}
