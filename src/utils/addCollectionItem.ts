import { addDoc, collection, getFirestore } from "firebase/firestore";

export const addCollectionItem = async <T>(path: string, item: T) => {
  const ref = collection(getFirestore(), path);
  await addDoc(ref, item as object);
};
