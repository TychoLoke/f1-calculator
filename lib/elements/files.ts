import fs from 'fs';
import path from 'path';

export const exportRoot = path.join(process.cwd(), 'data', 'elements-export');

function safeReadFile(filePath: string): { content: string } | { error: string } {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return { content };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { error: `Unable to read ${filePath}: ${message}` };
  }
}

export function listFolderContents(folderPath = exportRoot) {
  try {
    return fs.readdirSync(folderPath);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return [`Unable to read directory: ${message}`];
  }
}

export function readJsonFromExport<T>(...segments: string[]): { data: T | null; error?: string } {
  const resolvedPath = path.join(exportRoot, ...segments);
  const file = safeReadFile(resolvedPath);
  if ('error' in file) {
    return { data: null, error: file.error };
  }

  try {
    return { data: JSON.parse(file.content) as T };
  } catch (parseError) {
    const message = parseError instanceof Error ? parseError.message : String(parseError);
    return { data: null, error: `Unable to parse ${resolvedPath}: ${message}` };
  }
}

export function customerFolder(customerId: string) {
  return path.join(exportRoot, `customer_${customerId}`);
}

export function listCustomerFolder(customerId: string) {
  return listFolderContents(customerFolder(customerId));
}
