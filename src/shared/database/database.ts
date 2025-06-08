import Dexie, { Table } from 'dexie';
import { Document, Image, CreateDocumentInput, UpdateDocumentInput, CreateImageInput } from './types';

class EditorDatabase extends Dexie {
  documents!: Table<Document>;
  images!: Table<Image>;

  constructor() {
    super('EditorDB');
    this.version(1).stores({
      documents: '++id, title, createdAt, updatedAt',
      images: '++id, documentId, uploadedAt'
    });
  }
}

export const db = new EditorDatabase();

// Document CRUD operations
export const documentService = {
  // Create document
  async create(input: CreateDocumentInput): Promise<number> {
    const now = new Date();
    return await db.documents.add({
      ...input,
      createdAt: now,
      updatedAt: now
    });
  },

  // Get document by ID
  async getById(id: number): Promise<Document | undefined> {
    return await db.documents.get(id);
  },

  // Get all documents
  async getAll(): Promise<Document[]> {
    return await db.documents.orderBy('updatedAt').reverse().toArray();
  },

  // Update document
  async update(id: number, input: UpdateDocumentInput): Promise<number> {
    return await db.documents.update(id, {
      ...input,
      updatedAt: new Date()
    });
  },

  // Delete document
  async delete(id: number): Promise<void> {
    // Also delete associated images
    await db.transaction('rw', [db.documents, db.images], async () => {
      await db.documents.delete(id);
      await db.images.where('documentId').equals(id).delete();
    });
  },

  // Search documents by title
  async searchByTitle(query: string): Promise<Document[]> {
    return await db.documents
      .where('title')
      .startsWithIgnoreCase(query)
      .toArray();
  },

  // Get document with its images
  async getWithImages(id: number): Promise<{ document: Document | undefined; images: Image[] }> {
    const document = await db.documents.get(id);
    const images = await db.images.where('documentId').equals(id).toArray();
    return { document, images };
  }
};

// Image CRUD operations
export const imageService = {
  // Create image
  async create(input: CreateImageInput): Promise<number> {
    return await db.images.add({
      ...input,
      uploadedAt: new Date()
    });
  },

  // Get image by ID
  async getById(id: number): Promise<Image | undefined> {
    return await db.images.get(id);
  },

  // Get all images
  async getAll(): Promise<Image[]> {
    return await db.images.orderBy('uploadedAt').reverse().toArray();
  },

  // Get images by document ID
  async getByDocumentId(documentId: number): Promise<Image[]> {
    const images = await db.images
      .where('documentId')
      .equals(documentId)
      .toArray();
    return images.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
  },

  // Get unassociated images (not linked to any document)
  async getUnassociated(): Promise<Image[]> {
    const images = await db.images
      .filter(image => image.documentId === undefined || image.documentId === null)
      .toArray();
    return images.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
  },

  // Associate image with document
  async associateWithDocument(imageId: number, documentId: number): Promise<number> {
    return await db.images.update(imageId, { documentId });
  },

  // Remove association (set documentId to undefined)
  async removeAssociation(imageId: number): Promise<number> {
    return await db.images.update(imageId, { documentId: undefined });
  },

  // Delete image
  async delete(id: number): Promise<void> {
    await db.images.delete(id);
  },

  // Delete all images for a document
  async deleteByDocumentId(documentId: number): Promise<number> {
    return await db.images.where('documentId').equals(documentId).delete();
  },

  // Auto-cleanup orphaned images (call periodically)
  async cleanupOrphaned(): Promise<number> {
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
  }
};