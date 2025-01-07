import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

//export where we put out env vars in
//Essentially creating type checking for the env vars used by developer
export const env = createEnv({
  emptyStringAsUndefined: true,
  server: {
    DATABASE_URL: z.string().url(),
    CLERK_SECRET_KEY: z.string()
  },
  experimental__runtimeEnv: process.env
})