const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatCurrency(value: number) {
  return currency.format(value);
}

const dayMonth = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", timeZone: "UTC" });
const dayMonthYear = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function parseIsoDate(isoDate: string) {
  return new Date(`${isoDate}T00:00:00Z`);
}

export function formatDayHeading(isoDate: string, today: string) {
  const yesterday = parseIsoDate(today);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);

  if (isoDate === today) return "Hoje";
  if (isoDate === yesterday.toISOString().slice(0, 10)) return "Ontem";

  const sameYear = isoDate.slice(0, 4) === today.slice(0, 4);
  return (sameYear ? dayMonth : dayMonthYear).format(parseIsoDate(isoDate));
}

export const TIME_ZONE = "America/Sao_Paulo";

const longDate = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: TIME_ZONE,
});

export function formatLongDate(date: Date) {
  return longDate.format(date);
}

const hourFormat = new Intl.DateTimeFormat("pt-BR", {
  hour: "numeric",
  hourCycle: "h23",
  timeZone: TIME_ZONE,
});

export function greeting(date: Date) {
  const hour = Number(hourFormat.format(date));
  if (hour >= 5 && hour < 12) return "Bom dia";
  if (hour >= 12 && hour < 18) return "Boa tarde";
  return "Boa noite";
}
