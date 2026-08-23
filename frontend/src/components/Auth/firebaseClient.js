import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { firebaseAuth } from '../../config/firebase.js'

const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

export { firebaseAuth, googleProvider, signInWithPopup }
export const signOutFromFirebase = signOut
