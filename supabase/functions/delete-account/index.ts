import { withSupabase } from 'npm:@supabase/server@1';
import { handleDeleteAccount } from '../_shared/delete-account.mjs';

export default {
  fetch: withSupabase({ auth: 'user' }, async (request, context) => {
    const result = await handleDeleteAccount(request, context);
    if (result.status === 204) return new Response(null, { status: 204 });
    const headers = result.status === 405 ? { Allow: 'POST' } : undefined;
    return Response.json({ error: result.error }, { status: result.status, headers });
  }),
};
