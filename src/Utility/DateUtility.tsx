const formatDate = (dateString: any) => {
  if (!dateString) return undefined;

  return new Date(dateString).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatDateTime = (dateString: any) => {
  if (!dateString) return undefined;

  return new Date(dateString).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export { formatDate, formatDateTime };
