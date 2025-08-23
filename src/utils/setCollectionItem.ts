import { doc, getFirestore, setDoc } from "firebase/firestore";

export const setCollectionItem = async <T>(path: string, item: T) => {
  const ref = doc(getFirestore(), path);
  await setDoc(ref, item as object);
};
