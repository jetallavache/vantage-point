export const formatPublishDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();

  const dateOnly = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.floor(
    (nowOnly.getTime() - dateOnly.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "сегодня";
  if (diffDays === 1) return "вчера";
  if (diffDays >= 2 && diffDays <= 7) {
    return `${diffDays} ${diffDays <= 4 ? "дня" : "дней"} назад`;
  }

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  };

  return date.toLocaleDateString("ru-RU", options);
};

export const formatDateTime = (dateString: string | number): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleDateString("ru-RU", options);
};
