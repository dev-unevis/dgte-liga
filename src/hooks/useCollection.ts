import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";

const useCollection = <T>(path: string) => {
  const [data, setData] = useState<T[]>([]);

  const getData = async () => {
    const ref = collection(getFirestore(), path);
    const docs = await getDocs(ref);
    const items: T[] = [];

    docs.forEach((doc) => {
      items.push({
        id: doc.id,
        ...(doc.data() as T),
      });
    });

    setData(items);
  };

  useEffect(() => {
    getData();
  }, [path]);

  return { data: data, refresh: getData };
};

export default useCollection;
