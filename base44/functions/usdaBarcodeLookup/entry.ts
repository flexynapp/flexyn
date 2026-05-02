import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const USDA_BASE = 'https://api.nal.usda.gov/fdc/v1';

// Nutrient IDs mirror the previous client-side mapping in src/lib/foodLookup.js.
const NUTRIENT_IDS = {
  calories:        1008,
  protein:         1003,
  carbs:           1005,
  fat:             1004,
  fiber:           1079,
  sugar:           1063,
  sodium:          1093,
  cholesterol:     1253,
  calcium_mg:      1087,
  iron_mg:         1089,
  magnesium_mg:    1090,
  potassium_mg:    1092,
  vitamin_a_iu:    1106,
  vitamin_c_mg:    1162,
  vitamin_d_iu:    1114,
  vitamin_b12_mcg: 1178,
};

function extractNutrient(nutrients, id) {
  const found = nutrients?.find(
    (n) => n.nutrientId === id || n.nutrientNumber === String(id)
  );
  return found?.value ?? null;
}

function round1(v) {
  return v != null ? Math.round(v * 10) / 10 : null;
}

Deno.serve(async (req) => {
  try {
    // Authenticate. Unauthenticated callers are rejected so the function
    // doesn't become a public proxy for our USDA quota.
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Accept the barcode from the request body. Validate strictly — we
    // forward this into a third-party URL, so anything unexpected gets
    // rejected before it leaves the function.
    const body = await req.json().catch(() => ({}));
    const barcode = typeof body?.barcode === 'string' ? body.barcode.trim() : '';
    if (!barcode || !/^[0-9]{6,18}$/.test(barcode)) {
      return Response.json({ error: 'Invalid barcode' }, { status: 400 });
    }

    // Read the API key from Base44's secret store. Do NOT log this value.
    const apiKey = Deno.env.get('USDA_API_KEY');
    if (!apiKey) {
      // Log the misconfiguration on the server but never surface the key
      // (or its absence as a stack trace) to the client.
      console.error('[usdaBarcodeLookup] USDA_API_KEY secret is not set');
      return Response.json({ error: 'Service unavailable' }, { status: 503 });
    }

    // Step 1: search the Branded foods index for the barcode.
    const searchUrl =
      `${USDA_BASE}/foods/search` +
      `?query=${encodeURIComponent(barcode)}` +
      `&dataType=Branded` +
      `&pageSize=5` +
      `&api_key=${encodeURIComponent(apiKey)}`;
    const searchResp = await fetch(searchUrl);
    if (!searchResp.ok) {
      // Treat upstream errors as "not found" — the client waterfall will
      // fall through to its existing "not found" UI. We don't surface the
      // upstream status code because it can leak rate-limit / auth signal.
      return Response.json(null);
    }
    const searchJson = await searchResp.json();
    const padded = barcode.padStart(14, '0');
    const match = (searchJson.foods || []).find((f) => {
      const gtin = String(f.gtinUpc || '').replace(/\s/g, '');
      return gtin === barcode || gtin === padded || gtin.endsWith(barcode);
    });
    if (!match) return Response.json(null);

    // Step 2: fetch the detailed nutrient record.
    const detailUrl =
      `${USDA_BASE}/food/${encodeURIComponent(match.fdcId)}` +
      `?api_key=${encodeURIComponent(apiKey)}`;
    const detailResp = await fetch(detailUrl);
    if (!detailResp.ok) return Response.json(null);
    const detail = await detailResp.json();
    const nutrients = detail.foodNutrients || [];

    const num = (id) => round1(extractNutrient(nutrients, id));

    const servingLabel =
      detail.householdServingFullText ||
      (detail.servingSize
        ? `${detail.servingSize}${detail.servingSizeUnit || 'g'}`
        : '1 serving');

    return Response.json({
      barcode,
      name: detail.description || match.description || `Product ${barcode}`,
      servingLabel,
      source: 'usda',
      nutrition: {
        calories:    num(NUTRIENT_IDS.calories),
        protein:     num(NUTRIENT_IDS.protein),
        carbs:       num(NUTRIENT_IDS.carbs),
        fat:         num(NUTRIENT_IDS.fat),
        fiber:       num(NUTRIENT_IDS.fiber),
        sugar:       num(NUTRIENT_IDS.sugar),
        sodium:      num(NUTRIENT_IDS.sodium),
        cholesterol: num(NUTRIENT_IDS.cholesterol),
      },
      vitamins: {
        calcium_mg:      num(NUTRIENT_IDS.calcium_mg),
        iron_mg:         num(NUTRIENT_IDS.iron_mg),
        magnesium_mg:    num(NUTRIENT_IDS.magnesium_mg),
        potassium_mg:    num(NUTRIENT_IDS.potassium_mg),
        vitamin_a_iu:    num(NUTRIENT_IDS.vitamin_a_iu),
        vitamin_c_mg:    num(NUTRIENT_IDS.vitamin_c_mg),
        vitamin_d_iu:    num(NUTRIENT_IDS.vitamin_d_iu),
        vitamin_b12_mcg: num(NUTRIENT_IDS.vitamin_b12_mcg),
      },
    });
  } catch (error) {
    console.error('[usdaBarcodeLookup] failed:', error);
    return Response.json({ error: 'Lookup failed' }, { status: 500 });
  }
});