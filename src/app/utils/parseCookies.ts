export function parseCookies(cookieString: string): Record<string, string> {
  const cookies: Record<string, string> = {};  // Define cookies as an object with string keys and string values
  
  // Split by "; " to handle individual cookie pairs
  const rawCookies = cookieString.split(/;\s*/);
  
  rawCookies.forEach((cookie) => {
    // Split each cookie by the first "=" only to get the name and value
    const [key, ...valueParts] = cookie.split('=');
    const value = valueParts.join('=').trim();  // Join back in case the value contains '='
    
    // Only consider meaningful key-value pairs (exclude Path, Expires, etc.)
    if (key === 'userId' || key === 'role') {
      cookies[key.trim()] = value;
    }
  });
  
  return cookies;
}
