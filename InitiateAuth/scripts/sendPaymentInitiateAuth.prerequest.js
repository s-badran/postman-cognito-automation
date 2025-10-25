// Pre-request script for API calls
// Note: Token refresh via InitiateAuth is not implemented in this version.
// For simplicity, this uses the same logic as the main hack, but in a real implementation,
// you'd call InitiateAuth again for refresh.

console.log('Checking Cognito token validity...');

try {
  const createdAt = new Date(pm.globals.get('id_token_created_at'));
  const token = pm.globals.get('id_token');

  if (!token || !createdAt) {
    console.warn('No existing token found.');
    return;
  }

  // Check expiry (1 hour window)
  const now = new Date();
  const ageInMs = now - createdAt;
  const expired = ageInMs > 60 * 60 * 1000; // 1 hour in ms

  if (expired) {
    console.log('Token expired — manual refresh needed (call Get Token via InitiateAuth).');
  } else {
    console.log('Token is still valid.');
  }
} catch (err) {
  console.error('Pre-request script error:', err);
}