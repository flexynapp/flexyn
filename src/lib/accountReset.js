/**
 * Filter records to hide anything created before the user's most recent
 * account reset. This is a defensive layer: even if backend deletion fails,
 * these records will not appear in the UI.
 */
export function filterAfterReset(records, userProfile) {
  if (!records || !Array.isArray(records)) return records || [];
  const resetAt = userProfile?.account_reset_at;
  if (!resetAt) return records;
  const resetTime = new Date(resetAt).getTime();
  if (isNaN(resetTime)) return records;
  return records.filter(r => {
    if (!r?.created_date) return true; // no timestamp = keep it (shouldn't happen)
    return new Date(r.created_date).getTime() >= resetTime;
  });
}