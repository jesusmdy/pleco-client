"use client";

import { useEffect, useRef } from "react";
import { useUploadStore } from "@/app/store/useUploadStore";
import { uploadDriveFile, createFolder } from "@/app/lib/drive";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { useCryptoStore } from "@/app/store/useCryptoStore";
import { 
  generateFileKey, 
  encryptData, 
  exportKey, 
  importKey, 
  hashData, 
  encryptString,
  generateThumbnail,
  encryptBlob
} from "@/app/lib/crypto";

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
            const rawFileKeyBuffer = await window.crypto.subtle.exportKey('raw', fileKey);
            const { ciphertext: encryptedKeyBuffer, iv: keyIv } = await encryptData(
              rawFileKeyBuffer, 
              masterKey
            );
            
            // 5. Generate and Encrypt Thumbnails (for images)
            let thumb200: Blob | undefined;
            let thumb500: Blob | undefined;

            if (nextItem.file.type.startsWith("image/")) {
              try {
                // Generate
                const t200Raw = await generateThumbnail(nextItem.file, 200);
                const t500Raw = await generateThumbnail(nextItem.file, 500);

                // Encrypt using unique IVs for each thumbnail (Required for AES-GCM)
                const t200Enc = await encryptBlob(t200Raw, fileKey);
                const t500Enc = await encryptBlob(t500Raw, fileKey);

                // We prepend the IV to the ciphertext so the thumbnail is self-contained
                const t200Combined = new Uint8Array(t200Enc.iv.length + t200Enc.ciphertext.byteLength);
                t200Combined.set(t200Enc.iv);
                t200Combined.set(new Uint8Array(t200Enc.ciphertext), t200Enc.iv.length);

                const t500Combined = new Uint8Array(t500Enc.iv.length + t500Enc.ciphertext.byteLength);
                t500Combined.set(t500Enc.iv);
                t500Combined.set(new Uint8Array(t500Enc.ciphertext), t500Enc.iv.length);

                thumb200 = new Blob([t200Combined], { type: 'application/octet-stream' });
                thumb500 = new Blob([t500Combined], { type: 'application/octet-stream' });
              } catch (err) {
                console.error("ZK Thumbnail generation failed:", err);
              }
            }
            
            // We combine Encrypted Key + Key IV for storage
            const combinedKey = btoa(String.fromCharCode(...new Uint8Array(encryptedKeyBuffer))) + ":" + btoa(String.fromCharCode(...keyIv));
            encryptedFileKey = combinedKey;
            ivString = btoa(String.fromCharCode(...iv));

            const uploadedFile = await uploadDriveFile(
              fileToUpload, 
              fileNameToUpload,
              nextItem.parentId, 
              session.backendToken,
              encryptedFileKey,
              ivString,
              fileHash,
              thumb200,
              thumb500
            );
            updateItemStatus(nextItem.id, "completed", 100, undefined, uploadedFile.id);
          } else {
            // Non-encrypted file upload
            const uploadedFile = await uploadDriveFile(
              fileToUpload, 
              fileNameToUpload,
              nextItem.parentId, 
              session.backendToken,
            );
            updateItemStatus(nextItem.id, "completed", 100, undefined, uploadedFile.id);
          }
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
              let thumb200: Blob | undefined;
              let thumb500: Blob | undefined;

              if (masterKey) {
                fileNameToUpload = await encryptString(child.name, masterKey);
                const fileKey = await generateFileKey();
                const fileBuffer = await child.file.arrayBuffer();
                const { ciphertext, iv } = await encryptData(fileBuffer, fileKey);
                fileToUpload = new Blob([ciphertext], { type: child.file.type });
                
                fileHash = await hashData(ciphertext);
                
                const rawFileKeyBuffer = await window.crypto.subtle.exportKey('raw', fileKey);
                const { ciphertext: encryptedKeyBuffer, iv: keyIv } = await encryptData(
                  rawFileKeyBuffer, 
                  masterKey
                );
                
                // Generate and Encrypt Thumbnails
                if (child.file.type.startsWith("image/")) {
                  try {
                    const t200Raw = await generateThumbnail(child.file, 200);
                    const t500Raw = await generateThumbnail(child.file, 500);

                    const t200Enc = await encryptBlob(t200Raw, fileKey);
                    const t500Enc = await encryptBlob(t500Raw, fileKey);

                    const t200Combined = new Uint8Array(t200Enc.iv.length + t200Enc.ciphertext.byteLength);
                    t200Combined.set(t200Enc.iv);
                    t200Combined.set(new Uint8Array(t200Enc.ciphertext), t200Enc.iv.length);

                    const t500Combined = new Uint8Array(t500Enc.iv.length + t500Enc.ciphertext.byteLength);
                    t500Combined.set(t500Enc.iv);
                    t500Combined.set(new Uint8Array(t500Enc.ciphertext), t500Enc.iv.length);

                    thumb200 = new Blob([t200Combined], { type: 'application/octet-stream' });
                    thumb500 = new Blob([t500Combined], { type: 'application/octet-stream' });
                  } catch (err) {
                    console.error("ZK Thumbnail generation failed:", err);
                  }
                }

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
                fileHash,
                thumb200,
                thumb500
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
