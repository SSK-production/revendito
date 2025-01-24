import { writeFile } from 'fs/promises';
import { join } from 'path';
import { fileTypeFromBuffer } from 'file-type';

interface ProcessedFormData {
  fields: Record<string, string>;
  photos: string[];
}

export async function processFormData(formData: FormData, uploadDir: string): Promise<ProcessedFormData> {
  const fields: Record<string, string> = {};
  const photos: string[] = [];

  for (const [key, value] of formData.entries()) {
    if (value instanceof Blob) {
      const buffer = Buffer.from(await value.arrayBuffer());

      // Vérification du type MIME
      const fileType = await fileTypeFromBuffer(buffer);
      if (!fileType || !fileType.mime.startsWith('image/')) {
        throw new Error(`Invalid file type for key "${key}". Only images are allowed.`);
      }

      // Génération du nom de fichier et chemin
      const filename = `${Date.now()}-${value.name}`;
      const filepath = join(process.cwd(), uploadDir, filename);

      // Sauvegarde du fichier
      await writeFile(filepath, buffer);

      // Ajout du chemin du fichier dans le tableau photos
      photos.push(`/${filename}`);
    } else {
      fields[key] = value.toString();
    }
  }

  return { fields, photos };
}
