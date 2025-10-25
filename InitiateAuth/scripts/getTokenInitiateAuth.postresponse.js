// Post-response script for InitiateAuth API
// This is embedded in the collection, but kept here for reference

console.log('Getting a new token using InitiateAuth...');
const response = pm.response.json();
const result = response.AuthenticationResult;

if (result && result.IdToken) {
    pm.globals.set('id_token', result.IdToken);
    pm.globals.set('id_token_created_at', new Date());
    console.log(`New ID token saved: ...${result.IdToken.slice(-15)}`);
} else {
    console.error('Failed to get token:', response);
}