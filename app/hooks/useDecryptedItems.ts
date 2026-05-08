import { useState, useEffect } from 'react';
import { UnifiedDriveItem } from '@/app/lib/drive';
import { useCryptoStore } from '@/app/store/useCryptoStore';
import { decryptItemName } from '@/app/lib/crypto';

export function useDecryptedItems(items: UnifiedDriveItem[] | undefined) {
  const masterKey = useCryptoStore(state => state.masterKey);
  const [decryptedItems, setDecryptedItems] = useState<UnifiedDriveItem[] | undefined>(undefined);

  useEffect(() => {
    if (!items) {
      setDecryptedItems(undefined);
      return;
    }

    if (!masterKey) {
      console.log("useDecryptedItems: Master key missing, showing [Encrypted]");
      setDecryptedItems(items.map(item => ({
        ...item,
        name: item.encrypted ? "[Encrypted]" : item.name,
      })));
      return;
    }

    const decrypt = async () => {
      console.log(`useDecryptedItems: Decrypting ${items.length} items...`);
      const result = await Promise.all(
        items.map(async (item) => {
          try {
            const decryptedName = await decryptItemName(item.name, masterKey);
            return { ...item, name: decryptedName };
          } catch (err) {
            console.error(`Failed to decrypt item ${item.id}:`, err);
            return item;
          }
        })
      );
      setDecryptedItems(result);
    };

    decrypt();
  }, [items, masterKey]);

  return decryptedItems;
}

export function useDecryptedBreadcrumb(breadcrumb: { id: string; name: string; }[] | undefined) {
  const masterKey = useCryptoStore(state => state.masterKey);
  const [decryptedBreadcrumb, setDecryptedBreadcrumb] = useState<{ id: string; name: string; }[] | undefined>(undefined);

  useEffect(() => {
    if (!breadcrumb) {
      setDecryptedBreadcrumb(undefined);
      return;
    }

    if (!masterKey) {
      setDecryptedBreadcrumb(breadcrumb.map((node, i) => ({
        ...node,
        name: i === 0 ? node.name : "[Encrypted]", // Usually first one is "Home" or "Root"
      })));
      return;
    }

    const decrypt = async () => {
      const result = await Promise.all(
        breadcrumb.map(async (node) => ({
          ...node,
          name: await decryptItemName(node.name, masterKey),
        }))
      );
      setDecryptedBreadcrumb(result);
    };

    decrypt();
  }, [breadcrumb, masterKey]);

  return decryptedBreadcrumb;
}
