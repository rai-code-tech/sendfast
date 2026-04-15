"use client";

import { createAuthClient } from "better-auth/react";

// No baseURL — Better Auth uses relative URLs which work in both dev and prod.
// Never hardcode a fallback to localhost here; it breaks browser requests in production.
export const authClient = createAuthClient({});

export const { signIn, signUp, signOut, useSession } = authClient;
