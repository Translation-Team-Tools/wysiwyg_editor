// Database exports
export { db, documentService, imageService } from './database';

// Type exports
export type {
  Document,
  Image,
  CreateDocumentInput,
  UpdateDocumentInput,
  CreateImageInput
} from './types';

// Migration exports
export {
  runMigrations,
  clearDatabase,
  exportData,
  importData
} from './migrations';

// Utility exports
export {
  blobToBase64,
  base64ToBlob,
  getFileExtensionFromBase64,
  isValidBase64DataUrl,
  formatFileSize,
  getBlobInfo
} from './utils';

// Initialize database when module is imported
import { runMigrations } from './migrations';

// Auto-run migrations on import
runMigrations().catch(console.error);