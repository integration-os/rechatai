'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'

export async function completeOnboarding() {
  const { userId } = auth()

  if (!userId) {
    throw new Error('No Logged In User')
  }

  try {
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
      },
    })
    
    // Instead of redirecting, return a success status
    return { success: true, message: 'Onboarding completed' }
    
  } catch (e) {
    console.error('error', e)
    return { success: false, message: 'Failed to update user metadata' }
  }
}