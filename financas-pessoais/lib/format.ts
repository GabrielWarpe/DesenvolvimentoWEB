const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatCurrency(value: number) {
  return currency.format(value);
}

const dateFormat = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

// Recebe "YYYY-MM-DD"; interpreta em UTC para não "voltar um dia" por fuso horário.
export function formatDate(isoDate: string) {
  return dateFormat.format(new Date(`${isoDate}T00:00:00Z`));
}

// O servidor (Vercel) roda em UTC; o horário exibido é sempre o de Brasília.
export const TIME_ZONE = "America/Sao_Paulo";

const longDate = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: TIME_ZONE,
});

// Ex.: "terça-feira, 29 de setembro"
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
