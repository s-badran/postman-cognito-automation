/**
 * Postman Pre-Request Script
 * Validates and refreshes AWS Cognito ID token if expired
 * Author: Saeed Badran (2025)
 */

console.log('Checking Cognito token validity...')

try {
  const createdAt = new Date(pm.globals.get('id_token_created_at'))
  const token = pm.globals.get('id_token')
  const requestOptions = JSON.parse(pm.globals.get('get_token_request') || '{}')

  if (!token || !createdAt) {
    console.warn('No existing token found — retrieving a new one.')
    pm.sendRequest(requestOptions, (err, res) => {
      if (err) {
        console.error('Token request failed:', err)
        return
      }
      const locationHeader = res.headers.get('Location')
      if (!locationHeader) {
        console.error('No Location header found in token refresh response.')
        return
      }
      const newToken = locationHeader.substring(
        locationHeader.indexOf('id_token=') + 9,
        locationHeader.indexOf('&access_token')
      )
      pm.globals.set('id_token', newToken)
      pm.globals.set('id_token_created_at', new Date())
      console.log(`Token refreshed: ...${newToken.slice(-15)}`)
    })
    return
  }

  // Check expiry (1 hour window)
  const now = new Date()
  const ageInMs = now - createdAt
  const expired = ageInMs > 60 * 60 * 1000 // 1 hour in ms

  if (expired) {
    console.log('Token expired — refreshing...')
    pm.sendRequest(requestOptions, (err, res) => {
      if (err) {
        console.error('Failed to refresh token:', err)
        return
      }
      const locationHeader = res.headers.get('Location')
      const newToken = locationHeader.substring(
        locationHeader.indexOf('id_token=') + 9,
        locationHeader.indexOf('&access_token')
      )
      pm.globals.set('id_token', newToken)
      pm.globals.set('id_token_created_at', new Date())
      console.log(`New token obtained: ...${newToken.slice(-15)}`)
    })
  } else {
    console.log('Token is still valid.')
  }
} catch (err) {
  console.error('Pre-request script error:', err)
}
