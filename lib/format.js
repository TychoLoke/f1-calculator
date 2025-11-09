export function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}

export function formatPoints(value) {
  return typeof value === "number" ? value.toLocaleString("en-GB") : value;
}

export function formatRound(round) {
  return round.toString().padStart(2, "0");
}
