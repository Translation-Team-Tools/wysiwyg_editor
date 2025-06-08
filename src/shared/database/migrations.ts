import { db } from './database';
import { blobToBase64, base64ToBlob } from './utils';

export const runMigrations = async (): Promise<void> => {
  try {
    // Version 1 - Initial schema
    db.version(1).stores({
      documents: '++id, title, createdAt, updatedAt',
      images: '++id, documentId, uploadedAt'
    });

    // Future migrations can be added here
    // Example:
    // db.version(2).stores({
    //   documents: '++id, title, createdAt, updatedAt, *tags',
    //   images: '++id, documentId, uploadedAt, name, size'
    // }).upgrade(tx => {
    //   // Migration logic for version 2
    //   return tx.documents.toCollection().modify(doc => {
    //     doc.tags = [];
    //   });
    // });

    await db.open();
    console.log('Database migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};

// Utility function to clear all data (useful for development)
export const clearDatabase = async (): Promise<void> => {
  await db.transaction('rw', [db.documents, db.images], async () => {
    await db.documents.clear();
    await db.images.clear();
  });
  console.log('Database cleared');
};

// Export/backup data
export const exportData = async () => {
  const documents = await db.documents.toArray();
  const images = await db.images.toArray();
  
  return {
    documents,
    images: await Promise.all(
      images.map(async (img) => ({
        ...img,
        blob: await blobToBase64(img.blob)
      }))
    )
  };
};

// Import/restore data
export const importData = async (data: any) => {
  await db.transaction('rw', [db.documents, db.images], async () => {
    if (data.documents) {
      await db.documents.bulkAdd(data.documents);
    }
    
    if (data.images) {
      const processedImages = await Promise.all(
        data.images.map(async (img: any) => ({
          ...img,
          blob: await base64ToBlob(img.blob)
        }))
      );
      await db.images.bulkAdd(processedImages);
    }
  });
};

// Cleanup orphaned images (images without associated documents)
export const cleanupOrphanedImages = async (): Promise<number> => {
  const allImages = await db.images.toArray();
  const documentIds = new Set((await db.documents.toArray()).map(doc => doc.id));
  
  const orphanedImages = allImages.filter(img => 
    img.documentId !== undefined && 
    img.documentId !== null && 
    !documentIds.has(img.documentId)
  );
  
  if (orphanedImages.length > 0) {
    const orphanedIds = orphanedImages.map(img => img.id!);
    await db.images.bulkDelete(orphanedIds);
  }
  
  return orphanedImages.length;
};