import { BatIcon } from "./HalloweenIcon";
import { useTheme } from "@/contexts/ThemeContext";

export function SeasonalDetails() {
  const { isHalloween } = useTheme();
  if (!isHalloween) return null;
  return <div className="seasonal-details" aria-hidden="true"><BatIcon className="seasonal-bat bat-one" /><BatIcon className="seasonal-bat bat-two" /><div className="seasonal-mist" /></div>;
}