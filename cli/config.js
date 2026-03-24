import { readFileSync as fsReadFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const CONFIG_PATH = join(homedir(), '.spicy-specs', 'config.json');

const DEFAULTS = {
  apiBase: 'https://spicy-specs.com',
};

const defaultFs = {
  readFileSync: (path, encoding) => fsReadFileSync(path, encoding),
};

export function loadConfig(fs = defaultFs) {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULTS, ...parsed };
  } catch {
    return { ...DEFAULTS };
  }
}

export function getApiBase(fs = defaultFs) {
  return loadConfig(fs).apiBase;
}
