/**
 * Postman Post-Response Script
 * Extracts AWS Cognito ID Token from Hosted UI redirect response
 * Author: Saeed Badran (2025)
 */

console.log('Getting a new token from Cognito...');

try {
    // Save the original request for reuse
    pm.globals.set("get_token_request", JSON.stringify(pm.request));

    // Read the redirect location header
    const locHeader = pm.response.headers.get('Location');
    if (!locHeader) {
        console.error('No Location header found in response.');
        return;
    }

    // Extract the ID token from the Location header fragment
    const idToken = locHeader.substring(
        locHeader.indexOf('id_token=') + 9,
        locHeader.indexOf('&access_token')
    );

    if (!idToken) {
        console.error('Unable to extract ID token from redirect URL.');
        return;
    }

    // Persist token globally
    pm.globals.set('id_token', idToken);
    pm.globals.set('id_token_created_at', new Date());
    console.log(`New ID token saved successfully: ...${idToken.slice(-15)}`)

} catch (err) {
    console.error('Error while extracting token:', err);
}
