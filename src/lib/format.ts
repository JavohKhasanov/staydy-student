export const formatSum = (n: number) => new Intl.NumberFormat("uz-UZ").format(n) + " so'm";
export const formatCoins = (n: number) => new Intl.NumberFormat("uz-UZ").format(n);

const MONTHS_UZ = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr",
];

export const formatDateUz = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS_UZ[d.getMonth()]}`;
};

export const formatDateTimeUz = (iso: string) => {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${d.getDate()} ${MONTHS_UZ[d.getMonth()]}, ${hh}:${mm}`;
};

export const timeRemaining = (iso: string): { label: string; urgent: boolean; passed: boolean } => {
  const target = new Date(iso).getTime();
  const diff = target - Date.now();
  if (diff <= 0) return { label: "Muddat o'tdi", urgent: true, passed: true };
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(hours / 24);
  if (days >= 1) return { label: `${days} kun qoldi`, urgent: days <= 1, passed: false };
  return { label: `${hours} soat qoldi`, urgent: true, passed: false };
};
