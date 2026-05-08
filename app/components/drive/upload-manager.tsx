"use client";

import { useEffect, useRef } from "react";
import { useUploadStore } from "@/app/store/useUploadStore";
import { uploadDriveFile, createFolder } from "@/app/lib/drive";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { useCryptoStore } from "@/app/store/useCryptoStore";
import { generateFileKey, encryptData, exportKey, importKey, hashData, encryptString } from "@/app/lib/crypto";

export function UploadManager() {
  const { queue, updateItemStatus, updateChildStatus } = useUploadStore();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const masterKey = useCryptoStore(state => state.masterKey);
  const processingRef = useRef(false);

  useEffect(() => {
    if (!session?.backendToken || processingRef.current) return;

    const nextItem = queue.find(item => item.status === "queue");
    if (!nextItem) return;

    const processNext = async () => {
      processingRef.current = true;
      updateItemStatus(nextItem.id, "in_progress", 0);

      try {
        if (nextItem.type === "file") {
          if (!nextItem.file) throw new Error("File missing");
          
          let fileToUpload: Blob = nextItem.file;
          let fileNameToUpload: string = nextItem.name;
          let encryptedFileKey: string | undefined;
          let ivString: string | undefined;
          let fileHash: string | undefined;

          if (masterKey) {
            // 1. Encrypt filename
            fileNameToUpload = await encryptString(nextItem.name, masterKey);

            // 2. Generate unique file key
            const fileKey = await generateFileKey();
            
            // 2. Encrypt file content
            const fileBuffer = await nextItem.file.arrayBuffer();
            const { ciphertext, iv } = await encryptData(fileBuffer, fileKey);
            fileToUpload = new Blob([ciphertext], { type: nextItem.file.type });
            
            // 3. Calculate hash of encrypted content
            fileHash = await hashData(ciphertext);
            
            // 4. Encrypt File Key with Master Key
            const rawFileKey = await exportKey(fileKey);
            const { ciphertext: encryptedKeyBuffer, iv: keyIv } = await encryptData(
              new TextEncoder().encode(rawFileKey), 
              masterKey
            );
            
            // We combine Encrypted Key + Key IV for storage
            const combinedKey = btoa(String.fromCharCode(...new Uint8Array(encryptedKeyBuffer))) + ":" + btoa(String.fromCharCode(...keyIv));
            encryptedFileKey = combinedKey;
            ivString = btoa(String.fromCharCode(...iv));
          }

          const uploadedFile = await uploadDriveFile(
            fileToUpload, 
            fileNameToUpload,
            nextItem.parentId, 
            session.backendToken,
            encryptedFileKey,
            ivString,
            fileHash
          );
          updateItemStatus(nextItem.id, "completed", 100, undefined, uploadedFile.id);
        } else {
          // Folder upload
          const folderCache: Record<string, string> = {};
          
          // 1. Create root folder
          const folderName = masterKey ? await encryptString(nextItem.name, masterKey) : nextItem.name;
          const rootFolder = await createFolder(folderName, nextItem.parentId, session.backendToken!);
          folderCache[nextItem.name] = rootFolder.id;
          
          // 2. Process children
          const children = nextItem.children || [];
          for (let idx = 0; idx < children.length; idx++) {
            const child = children[idx];
            updateChildStatus(nextItem.id, child.id, "in_progress", 0);
            
            try {
              // Resolve correct parentId based on path
              const parts = child.relativePath?.split('/') || [];
              let currentParentId = rootFolder.id;
              
              // Iterate through path parts (excluding root and file name)
              let pathAcc = parts[0];
              for (let i = 1; i < parts.length - 1; i++) {
                const part = parts[i];
                pathAcc += '/' + part;
                
                if (!folderCache[pathAcc]) {
                  const encryptedPart = masterKey ? await encryptString(part, masterKey) : part;
                  const folder = await createFolder(encryptedPart, currentParentId, session.backendToken!);
                  folderCache[pathAcc] = folder.id;
                }
                currentParentId = folderCache[pathAcc];
              }
              
              if (!child.file) throw new Error("File missing in child");

              let fileToUpload: Blob = child.file;
              let fileNameToUpload: string = child.name;
              let encryptedFileKey: string | undefined;
              let ivString: string | undefined;
              let fileHash: string | undefined;

              if (masterKey) {
                fileNameToUpload = await encryptString(child.name, masterKey);
                const fileKey = await generateFileKey();
                const fileBuffer = await child.file.arrayBuffer();
                const { ciphertext, iv } = await encryptData(fileBuffer, fileKey);
                fileToUpload = new Blob([ciphertext], { type: child.file.type });
                
                fileHash = await hashData(ciphertext);
                
                const rawFileKey = await exportKey(fileKey);
                const { ciphertext: encryptedKeyBuffer, iv: keyIv } = await encryptData(
                  new TextEncoder().encode(rawFileKey), 
                  masterKey
                );
                
                encryptedFileKey = btoa(String.fromCharCode(...new Uint8Array(encryptedKeyBuffer))) + ":" + btoa(String.fromCharCode(...keyIv));
                ivString = btoa(String.fromCharCode(...iv));
              }

              const uploadedChild = await uploadDriveFile(
                fileToUpload, 
                fileNameToUpload,
                currentParentId, 
                session.backendToken!,
                encryptedFileKey,
                ivString,
                fileHash
              );
              updateChildStatus(nextItem.id, child.id, "completed", 100, uploadedChild.id, currentParentId);
            } catch (err) {
              updateChildStatus(nextItem.id, child.id, "error", 0);
              // We continue with other files in the folder
            }
          }
          // Parent status is updated by updateChildStatus in store
        }
        
        // Invalidate cache to show new items
        queryClient.invalidateQueries({ queryKey: ["folderContent", nextItem.parentId || "root"] });
        queryClient.invalidateQueries({ queryKey: ["folderTreeFull"] });
      } catch (error) {
        updateItemStatus(nextItem.id, "error", undefined, (error as Error).message);
      } finally {
        processingRef.current = false;
      }
    };

    processNext();
  }, [queue, session, updateItemStatus, updateChildStatus, queryClient]);

  return null; // Invisible manager
}
