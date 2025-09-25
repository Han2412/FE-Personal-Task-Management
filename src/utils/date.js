// utils/date.js
export function formatDate(dateString) {
  if (!dateString) return "-";
  try {
    const d = new Date(dateString);
    if (isNaN(d)) return "-";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (e) {
    return "-";
  }
}
