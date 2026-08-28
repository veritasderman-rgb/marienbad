import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { env, requireEnv } from './env'

/**
 * Objektové úložiště pro zdrojové soubory importů (Cloudflare R2, S3 API).
 *
 * Úložiště je VOLITELNÉ: bez kompletní čtveřice env proměnných se
 * `isStorageConfigured()` vrátí false a volající si uloží jen záznam importu
 * bez `storage_path` (NAVRH sekce 4 — „NULL = úložiště nebylo nakonfigurováno").
 * Přímé volání put/get bez konfigurace vyhodí srozumitelnou chybu.
 */

let client: S3Client | null = null

export function isStorageConfigured(): boolean {
  return Boolean(
    env('R2_ENDPOINT') && env('R2_ACCESS_KEY_ID') && env('R2_SECRET_ACCESS_KEY') && env('R2_BUCKET'),
  )
}

function getClient(): S3Client {
  if (!isStorageConfigured()) {
    throw new Error(
      'Úložiště R2 není nakonfigurováno — chybí R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY nebo R2_BUCKET',
    )
  }
  if (!client) {
    client = new S3Client({
      region: 'auto',
      endpoint: requireEnv('R2_ENDPOINT'),
      forcePathStyle: true,
      credentials: {
        accessKeyId: requireEnv('R2_ACCESS_KEY_ID'),
        secretAccessKey: requireEnv('R2_SECRET_ACCESS_KEY'),
      },
    })
  }
  return client
}

export async function putObject(key: string, body: Uint8Array, contentType: string): Promise<void> {
  const s3 = getClient()
  await s3.send(
    new PutObjectCommand({
      Bucket: requireEnv('R2_BUCKET'),
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  )
}

export async function getObject(key: string): Promise<Uint8Array> {
  const s3 = getClient()
  const response = await s3.send(
    new GetObjectCommand({ Bucket: requireEnv('R2_BUCKET'), Key: key }),
  )
  if (!response.Body) throw new Error(`Objekt ${key} nemá tělo odpovědi`)
  return response.Body.transformToByteArray()
}

/** Jen pro testy — zahodí nacachovaného klienta po změně env. */
export function resetStorageClient(): void {
  client = null
}
