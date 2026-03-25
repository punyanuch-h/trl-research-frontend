/**
 * Playwright global setup - runs once before all tests
 * Can be used to seed test data, start mock server, etc.
 */
export default async function globalSetup() {
  const fs = await import('fs');
  const path = await import('path');
  const { execFileSync } = await import('child_process');

  const loadEnvFile = (filePath: string) => {
    if (!fs.existsSync(filePath)) return;

    const content = fs.readFileSync(filePath, 'utf-8');
    content.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;

      const [key, ...v] = trimmed.split('=');
      const value = v.join('=').trim().replace(/^["']|["']$/g, '');
      if (key && value) process.env[key.trim()] = value;
    });
  };

  loadEnvFile(path.join(process.cwd(), 'e2e', '.env'));
  loadEnvFile(path.join(process.cwd(), '.env'));

  const backendDir = path.resolve(process.cwd(), '..', 'trl-research-backend');
  const seedScript = path.join('internal', 'script', 'seed_data', 'seed_all_data.go');
  const seedScriptPath = path.join(backendDir, seedScript);
  const apiUrl = process.env.VITE_PUBLIC_API_URL || '';
  const shouldForceSeed = process.env.PLAYWRIGHT_FORCE_BACKEND_SEED === 'true';
  const shouldSkipSeed = process.env.PLAYWRIGHT_SKIP_BACKEND_SEED === 'true';
  const usesLocalApi =
    !apiUrl ||
    apiUrl.includes('localhost') ||
    apiUrl.includes('127.0.0.1') ||
    apiUrl.includes('0.0.0.0');

  if (shouldSkipSeed) {
    console.log('[playwright] Skipping backend seed because PLAYWRIGHT_SKIP_BACKEND_SEED=true.');
    return;
  }

  if (!fs.existsSync(seedScriptPath)) {
    if (shouldForceSeed || usesLocalApi) {
      throw new Error(`Backend seed script not found at ${seedScriptPath}`);
    }

    console.log(
      `[playwright] Backend seed script not found at ${seedScriptPath}; continuing because VITE_PUBLIC_API_URL points to a non-local backend (${apiUrl}).`,
    );
    return;
  }

  execFileSync('go', ['run', seedScript], {
    cwd: backendDir,
    stdio: 'inherit',
    env: process.env,
  });
}
