const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function handleDeleteAccount(request, context) {
  if (request.method !== 'POST') return { status: 405, error: 'method_not_allowed' };
  return deleteOwnAccount(context?.userClaims, context?.supabaseAdmin);
}

export async function deleteOwnAccount(userClaims, supabaseAdmin) {
  const userId = userClaims?.id || userClaims?.sub;
  if (typeof userId !== 'string' || !UUID.test(userId)) {
    return { status: 401, error: 'unauthorized' };
  }

  try {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId, false);
    if (!error || error.status === 404 || error.code === 'user_not_found') {
      return { status: 204 };
    }
  } catch {
    // Keep provider details and privileged operations out of the client response.
  }

  return { status: 502, error: 'account_deletion_failed' };
}
