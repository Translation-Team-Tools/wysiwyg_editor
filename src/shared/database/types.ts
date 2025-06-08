export interface Document {
  id?: number;
  title: string;
  content: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface Image {
  id?: number;
  blob: Blob;
  documentId?: number;
  uploadedAt: Date;
}

export type CreateDocumentInput = Omit<Document, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateDocumentInput = Partial<Omit<Document, 'id' | 'createdAt'>>;
export type CreateImageInput = Omit<Image, 'id' | 'uploadedAt'>;