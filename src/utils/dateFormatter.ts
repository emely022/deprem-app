/**
 * Formats a timestamp into relative time in Turkish (e.g. "5 dk önce", "2 sa önce").
 */
export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diffMs = Math.max(0, now - timestamp);
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) {
    return 'Az önce';
  }
  if (diffMin < 60) {
    return `${diffMin} dk önce`;
  }
  if (diffHours < 24) {
    return `${diffHours} sa önce`;
  }
  if (diffDays < 7) {
    return `${diffDays} gün önce`;
  }

  const d = new Date(timestamp);
  return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1)
    .toString()
    .padStart(2, '0')}.${d.getFullYear()}`;
}

/**
 * Formats a timestamp into a full date and time string.
 */
export function formatFullDateTime(timestamp: number): string {
  const d = new Date(timestamp);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const seconds = d.getSeconds().toString().padStart(2, '0');

  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}
