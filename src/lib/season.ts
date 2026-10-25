/** Seasonal details are enabled October 15–31 in the visitor's local calendar. */
export function isHalloweenSeason(date = new Date()): boolean {
  return date.getMonth() === 9 && date.getDate() >= 15;
}