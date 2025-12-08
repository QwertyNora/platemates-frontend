export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5184',
  clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
} as const;