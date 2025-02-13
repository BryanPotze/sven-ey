import { db } from "./firebase"
import {
  doc,
  setDoc,
  increment,
  runTransaction,
  collection,
  getDocs,
  writeBatch,
  deleteDoc,
  query,
 getDoc } from "firebase/firestore"

export async function addUser(name: string, drinkType = "beer") {
  await setDoc(doc(db, "Config", "users", "users", name), {
    name,
    totalSlokken: 0,
    drinkType,
  })
}

export async function addSlokToUser(userId: string) {
  await runTransaction(db, async (transaction) => {
    const userRef = doc(db, "Config", "users", "users", userId)
    const counterRef = doc(db, "Config", "counter")

    const userDoc = await transaction.get(userRef)
    const counterDoc = await transaction.get(counterRef)

    if (!userDoc.exists() || !counterDoc.exists()) {
      throw "Document does not exist!"
    }

    const userData = userDoc.data()
    const counterData = counterDoc.data()

    if (userData.totalSlokken < counterData.totalSlokken) {
      transaction.update(userRef, {
        totalSlokken: increment(1),
      })
    } else {
      throw "User's slokken count cannot exceed total slokken count"
    }
  })
}

export async function removeSlokFromUser(userId: string) {
  await runTransaction(db, async (transaction) => {
    const userRef = doc(db, "Config", "users", "users", userId)
    const userDoc = await transaction.get(userRef)

    if (!userDoc.exists()) {
      throw "User document does not exist!"
    }

    const userData = userDoc.data()
    if (userData.totalSlokken > 0) {
      transaction.update(userRef, {
        totalSlokken: increment(-1),
      })
    } else {
      throw "User's slokken count cannot be negative"
    }
  })
}

export async function addSlokToTotal() {
  await runTransaction(db, async (transaction) => {
    const counterRef = doc(db, "Config", "counter")
    const counterDoc = await transaction.get(counterRef)

    if (!counterDoc.exists()) {
      throw "Document does not exist!"
    }

    const newTotal = (counterDoc.data().totalSlokken || 0) + 1
    transaction.update(counterRef, { totalSlokken: newTotal })
  })
}

export async function removeSlokFromTotal() {
  await runTransaction(db, async (transaction) => {
    const counterRef = doc(db, "Config", "counter")
    const counterDoc = await transaction.get(counterRef)

    if (!counterDoc.exists()) {
      throw "Document does not exist!"
    }

    const currentTotal = counterDoc.data().totalSlokken || 0
    if (currentTotal > 0) {
      transaction.update(counterRef, { totalSlokken: currentTotal - 1 })
    } else {
      throw "Total slokken count cannot be negative"
    }
  })
}

export async function resetAllSlokken() {
  const batch = writeBatch(db)

  // Reset the total counter
  const counterRef = doc(db, "Config", "counter")
  batch.update(counterRef, { totalSlokken: 0 })

  // Reset all user counters
  const usersRef = collection(db, "Config", "users", "users")
  const userDocs = await getDocs(usersRef)

  userDocs.forEach((userDoc) => {
    batch.update(userDoc.ref, { totalSlokken: 0 })
  })

  // Commit the batch
  await batch.commit()
}

export async function deleteUser(userId: string) {
  await deleteDoc(doc(db, "Config", "users", "users", userId))
}

export async function getAllUsers() {
  const usersRef = collection(db, "Config", "users", "users")
  const usersSnapshot = await getDocs(query(usersRef))
  return usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export async function getTargetSlokken() {
  const counterRef = doc(db, "Config", "counter")
  const counterDoc = await getDoc(counterRef)
  return counterDoc.data()?.targetSlokken || 100 // Default to 100 if not set
}

