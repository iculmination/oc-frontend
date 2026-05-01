import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .string()
    .url("NEXT_PUBLIC_API_URL must be a valid URL")
    .transform((value) => value.replace(/\/+$/, "")),
});

const parsedClientEnv = clientEnvSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

if (!parsedClientEnv.success) {
  const formatted = parsedClientEnv.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");
  throw new Error(`Invalid client environment variables: ${formatted}`);
}

export const env = parsedClientEnv.data;
