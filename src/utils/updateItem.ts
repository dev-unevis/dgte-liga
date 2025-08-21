import { doc, getFirestore, updateDoc } from "firebase/firestore";

export const updateItem = async <T>(path: string, id: string, item: T) => {
  const ref = doc(getFirestore(), path + "/" + id);
  await updateDoc(ref, item as object);
};
