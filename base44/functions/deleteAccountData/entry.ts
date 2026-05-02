import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const ENTITIES = [
  'WorkoutLog',
  'Regimen',
  'Goal',
  'BodyMetric',
  'ChatSession',
  'NutritionLog',
  'Achievement',
  'WorkoutTemplate',
];

// Delete all records for one entity, with retry + verify.
// Returns the number of records that could NOT be deleted (0 = clean).
async function wipeEntity(base44, entityName, userEmail) {
  const entity = base44.asServiceRole.entities[entityName];
  const MAX_PASSES = 3;

  for (let pass = 0; pass < MAX_PASSES; pass++) {
    const records = await entity.filter({ created_by: userEmail }, '-created_date', 1000);
    if (records.length === 0) {
      return 0; // clean
    }

    // Delete sequentially so one failure doesn't abort the rest
    for (const r of records) {
      try {
        await entity.delete(r.id);
      } catch (err) {
        console.error(`Failed to delete ${entityName} ${r.id}:`, err?.message || err);
      }
    }

    // Small pause to let eventual consistency catch up before re-verifying
    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  // Final check after all passes
  const finalCheck = await entity.filter({ created_by: userEmail }, '-created_date', 1000);
  return finalCheck.length;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = user.email;
    const results = {};
    const failures = {};

    // Stamp account_reset_at FIRST — this is the authoritative cutoff.
    // Even if entity deletion fails, the client can hide stale records by this timestamp.
    const resetTimestamp = new Date().toISOString();
    try {
      await base44.auth.updateMe({
        username: null,
        display_name: null,
        age: null,
        total_xp: 0,
        onboarding_complete: false,
        gender: null,
        birthday: null,
        height_inches: null,
        weight_lbs: null,
        account_reset_at: resetTimestamp,
      });
    } catch (err) {
      console.error('Failed to reset user profile:', err?.message || err);
      return Response.json({
        success: false,
        error: 'Could not reset profile. Please try again.',
      }, { status: 500 });
    }

    // Delete each entity sequentially — fully complete one before moving to the next.
    for (const entityName of ENTITIES) {
      try {
        const remaining = await wipeEntity(base44, entityName, userEmail);
        results[entityName] = remaining === 0 ? 'cleaned' : `failed (${remaining} remaining)`;
        if (remaining > 0) {
          failures[entityName] = remaining;
        }
      } catch (err) {
        results[entityName] = `error: ${err?.message || 'unknown'}`;
        failures[entityName] = -1;
      }
    }

    if (Object.keys(failures).length > 0) {
      // Entity deletion partially failed — but account_reset_at is set, so the
      // client will hide stale records. Return success so the user can proceed.
      console.warn('Some entities could not be deleted, but reset_at is set:', failures);
    }

    return Response.json({
      success: true,
      details: results,
      account_reset_at: resetTimestamp,
    });
  } catch (error) {
    console.error('deleteAccountData fatal error:', error);
    return Response.json({ error: error?.message || 'Unknown error' }, { status: 500 });
  }
});