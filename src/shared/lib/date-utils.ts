export const formatPublishDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const time = date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (diffDays === 1) return `Сегодня, в ${time}`;
  if (diffDays === 2) return `Вчера, в ${time}`;
  if (diffDays <= 5) return `${diffDays} дня назад, в ${time}`;
  if (diffDays <= 8) return `${diffDays} дней назад, в ${time}`;

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    hour: "2-digit",
    minute: "2-digit",
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
