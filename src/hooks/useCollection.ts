import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";

export const getData = async <T>(path: string) => {
  const ref = collection(getFirestore(), path);
  const docs = await getDocs(ref);
  const items: T[] = [];

  docs.forEach((doc) => {
    items.push({
      id: doc.id,
      ...(doc.data() as T),
    });
  });

  return items;
};

const useCollection = <T>(path: string) => {
  const [data, setData] = useState<T[]>([]);

  const refresh = async () => {
    const items = await getData<T>(path);
    setData(items);
  };

  useEffect(() => {
    refresh();
  }, [path]);

  return { data: data, refresh: refresh };
};

export default useCollection;
