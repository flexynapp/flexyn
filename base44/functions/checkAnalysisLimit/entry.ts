import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const DAILY_LIMIT = 5;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date().toISOString().slice(0, 10);
    const userData = user.analysis_usage || {};
    const lastDate = userData.date;
    const count = userData.count || 0;

    // Reset counter if it's a new day
    const currentCount = lastDate === today ? count : 0;

    if (currentCount >= DAILY_LIMIT) {
      const remaining = 0;
      return Response.json({ allowed: false, remaining }, { status: 429 });
    }

    // Increment the counter
    const newCount = currentCount + 1;
    await base44.auth.updateMe({
      analysis_usage: { date: today, count: newCount },
    });

    const remaining = DAILY_LIMIT - newCount;
    return Response.json({ allowed: true, remaining });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});