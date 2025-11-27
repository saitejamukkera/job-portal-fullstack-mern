function postedTime(createdAt) {
  const now = new Date();
  const date = new Date(createdAt);

  const diffMs = now - date; // milliseconds difference
  const diffHrs = diffMs / (1000 * 60 * 60);
  const diffDays = diffHrs / 24;

  // --------------------------
  // HOURS (0–24)
  // --------------------------
  if (diffHrs < 24) {
    const hours = Math.floor(diffHrs);
    return hours <= 1 ? "1 hour ago" : `${hours} hours ago`;
  }

  // --------------------------
  // DAYS (1–30)
  // --------------------------
  if (diffDays < 30) {
    const days = Math.floor(diffDays);
    return days <= 1 ? "1 day ago" : `${days} days ago`;
  }

  // --------------------------
  // MONTHS (calendar-accurate)
  // --------------------------
  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth();
  const createdYear = date.getFullYear();
  const createdMonth = date.getMonth();

  // Calculate months difference accurately
  let months = (nowYear - createdYear) * 12 + (nowMonth - createdMonth);

  if (months < 12) {
    return months <= 1 ? "1 month ago" : `${months} months ago`;
  }

  // --------------------------
  // YEARS
  // --------------------------
  const years = Math.floor(months / 12);
  return years <= 1 ? "1 year ago" : `${years} years ago`;
}

export default postedTime;
