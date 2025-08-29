import admin from 'firebase-admin'

const projectId = process.env.FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
let privateKey = process.env.FIREBASE_PRIVATE_KEY

if (!admin.apps.length) {
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Firebase Admin env variables are missing')
  }
  // Fix escaped newlines
  privateKey = privateKey.replace(/\\n/g, '\n')
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey
    } as admin.ServiceAccount)
  })
}

export const adminDb = admin.firestore()
export const adminAuth = admin.auth()
