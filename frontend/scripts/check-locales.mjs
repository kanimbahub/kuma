// Vérifie que fr.json et en.json ont les mêmes clés / Checks that fr.json and en.json have the same keys
import { readFileSync } from 'node:fs';

const dir = new URL('../src/locales/', import.meta.url);
const flatten = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' ? flatten(v, `${prefix}${k}.`) : [`${prefix}${k}`]);
const load = (lng) =>
  new Set(flatten(JSON.parse(readFileSync(new URL(`${lng}.json`, dir), 'utf8'))));

const fr = load('fr');
const en = load('en');
const missingInEn = [...fr].filter((k) => !en.has(k));
const missingInFr = [...en].filter((k) => !fr.has(k));

if (missingInEn.length || missingInFr.length) {
  console.error('Clés de traduction manquantes / Missing translation keys');
  if (missingInEn.length) console.error('  absentes de en.json :', missingInEn.join(', '));
  if (missingInFr.length) console.error('  absentes de fr.json :', missingInFr.join(', '));
  process.exit(1);
}
console.log(`Traductions OK / Translations OK : ${fr.size} clés`);
