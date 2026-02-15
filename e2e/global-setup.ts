/**
 * Playwright global setup - runs once before all tests
 * Can be used to seed test data, start mock server, etc.
 */
export default async function globalSetup() {
  // Load env from .env if available
  const fs = await import('fs');
  const path = await import('path');
  const envPath = path.join(process.cwd(), 'e2e', '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    content.split('\n').forEach((line) => {
      const [key, ...v] = line.split('=');
      const value = v.join('=').trim().replace(/^["']|["']$/g, '');
      if (key && value) process.env[key.trim()] = value;
    });
  }
}
