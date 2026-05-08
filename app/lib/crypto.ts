/**
 * Pleco Zero-Knowledge Crypto Utilities
 * Uses Web Crypto API (SubtleCrypto)
 */

const ITERATIONS = 100000;
const KEY_LENGTH = 256;
const ALGORITHM = 'AES-GCM';

/**
 * Derives a cryptographic key from a password and salt using PBKDF2.
 */
export async function deriveKey(password: string, salt: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);
  const saltData = encoder.encode(salt);

  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    passwordData,
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltData,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    { name: ALGORITHM, length: KEY_LENGTH },
    true, // Set to true to allow session-bound persistence
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts data using AES-GCM.
 */
export async function encryptData(data: ArrayBuffer, key: CryptoKey): Promise<{ ciphertext: ArrayBuffer; iv: Uint8Array }> {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await window.crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv: iv,
    },
    key,
    data
  );

  return { ciphertext, iv };
}

/**
 * Decrypts data using AES-GCM.
 */
export async function decryptData(data: ArrayBuffer, key: CryptoKey, iv: Uint8Array): Promise<ArrayBuffer> {
  return await window.crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    data
  );
}

/**
 * Computes SHA-256 hash of a data buffer.
 */
export async function hashData(data: ArrayBuffer): Promise<string> {
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generates a random 256-bit key for a file.
 */
export async function generateFileKey(): Promise<CryptoKey> {
  return window.crypto.subtle.generateKey(
    {
      name: ALGORITHM,
      length: KEY_LENGTH,
    },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Exports a key to a raw format (base64 string) for storage (after encryption).
 */
export async function exportKey(key: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey('raw', key);
  const base64 = btoa(String.fromCharCode(...new Uint8Array(exported)));
  console.log("crypto: Key exported to raw base64");
  return base64;
}

/**
 * Helper to convert base64 to bytes.
 */
export function base64ToBytes(base64: string): Uint8Array {
  return new Uint8Array(atob(base64).split("").map(c => c.charCodeAt(0)));
}

/**
 * Imports a raw key (either as base64 string or BufferSource) into a CryptoKey object.
 */
export async function importKey(data: string | BufferSource): Promise<CryptoKey> {
  let keyBuffer = typeof data === 'string' ? base64ToBytes(data).buffer : data;
  
  let byteLength = (keyBuffer as ArrayBuffer).byteLength;

  // Legacy Fix: If we have 44 bytes, it's likely a base64 string that was accidentally 
  // encoded as UTF-8 bytes during upload. We need to decode it back to 32 bytes.
  if (byteLength === 44) {
    const legacyStr = new TextDecoder().decode(keyBuffer as ArrayBuffer);
    keyBuffer = base64ToBytes(legacyStr).buffer;
    byteLength = (keyBuffer as ArrayBuffer).byteLength;
  }

  return window.crypto.subtle.importKey(
    'raw',
    keyBuffer,
    ALGORITHM,
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts a string using a key and returns a base64 encoded string containing IV + ciphertext.
 */
export async function encryptString(text: string, key: CryptoKey): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const { ciphertext, iv } = await encryptData(data, key);
  
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);
  
  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypts a base64 encoded string containing IV + ciphertext.
 */
export async function decryptString(encryptedBase64: string, key: CryptoKey): Promise<string> {
  const combined = base64ToBytes(encryptedBase64);
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12).buffer;
  
  const decrypted = await decryptData(ciphertext, key, iv);
  const result = new TextDecoder().decode(decrypted);
  return result;
}

/**
 * Decrypts an item name if it's encrypted.
 */
export async function decryptItemName(name: string, key: CryptoKey | null): Promise<string> {
  if (!key) return name;
  if (name === "[Encrypted]") return name;
  try {
    const decrypted = await decryptString(name, key);
    return decrypted;
  } catch (e) {
    console.error(`crypto: Failed to decrypt name "${name.substring(0, 20)}...":`, e);
    return name;
  }
}

const BIP39_WORDS = [
  "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract", "absurd", "abuse",
  "access", "accident", "account", "accuse", "achieve", "acid", "acoustic", "acquire", "across", "act",
  "action", "actor", "actress", "actual", "adapt", "add", "addict", "address", "adjust", "admit",
  "adult", "advance", "advice", "aerobic", "affair", "afford", "afraid", "again", "age", "agent",
  "agree", "ahead", "aim", "air", "airport", "aisle", "alarm", "album", "alcohol", "alert",
  "alien", "all", "alley", "allow", "almost", "alone", "alpha", "already", "also", "alter",
  "always", "amateur", "amazing", "among", "amount", "amused", "analyst", "anchor", "ancient", "anger",
  "angle", "angry", "animal", "ankle", "announce", "annual", "another", "answer", "antenna", "antique",
  "anxiety", "any", "apart", "apology", "appear", "apple", "approve", "april", "arch", "arctic",
  "area", "arena", "argue", "arm", "armed", "armor", "army", "around", "arrange", "arrest",
  "arrive", "arrow", "art", "artefact", "artist", "artwork", "ask", "aspect", "assault", "asset",
  "assist", "assume", "asthma", "athlete", "atom", "attack", "attend", "attitude", "attract", "auction",
  "audit", "august", "aunt", "author", "auto", "autumn", "average", "avocado", "avoid", "awake",
  "aware", "away", "awesome", "awful", "awkward", "axis", "baby", "bachelor", "bacon", "badge"
  // ... adding more to reach a reasonable count or just using these for now
];

/**
 * Generates a 12-word recovery phrase.
 */
export function generateRecoveryPhrase(): string {
  const words = [];
  const randomValues = new Uint32Array(12);
  window.crypto.getRandomValues(randomValues);
  
  for (let i = 0; i < 12; i++) {
    words.push(BIP39_WORDS[randomValues[i] % BIP39_WORDS.length]);
  }
  
  return words.join(" ");
}

/**
 * Generates a thumbnail blob from an image file using Canvas.
 */
export async function generateThumbnail(file: File, size: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > size) {
          height *= size / width;
          width = size;
        }
      } else {
        if (height > size) {
          width *= size / height;
          height = size;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          URL.revokeObjectURL(img.src);
          resolve(blob);
        } else {
          reject(new Error('Canvas toBlob failed'));
        }
      }, 'image/jpeg', 0.85);
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Image load failed'));
    };
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Encrypts a blob of data using a CryptoKey.
 */
export async function encryptBlob(blob: Blob, key: CryptoKey, iv?: Uint8Array): Promise<{ ciphertext: ArrayBuffer, iv: Uint8Array }> {
  const buffer = await blob.arrayBuffer();
  return encryptData(buffer, key, iv);
}
