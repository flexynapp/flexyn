// ⚠️  DEPRECATED for new code.
// All new data-access logic MUST go through `src/lib/data/*` modules,
// NOT through this client directly. The data layer is the migration seam:
// when the app moves off Base44, only `src/lib/data/*` needs to be rewritten.
// See BACKEND_CONTRACT.md at the repository root for the migration spec.
//
// Existing direct usages of `base44.entities.X` are grandfathered and will
// be migrated incrementally as files get touched.

import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

//Create a client with authentication required
export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: '',
  requiresAuth: false,
  appBaseUrl
});