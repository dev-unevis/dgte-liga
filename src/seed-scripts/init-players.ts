import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { players } from "./players";
import { app } from "../../firebase.js";
import { addDoc, collection, getFirestore } from "firebase/firestore";

export const createUsers = async () => {
  const db = getFirestore(app);

  for (const player of players) {
    const defaultEmail =
      player.firstName +
      player.lastName +
      "@" +
      player.firstName +
      player.lastName;
    try {
      const auth = await createUserWithEmailAndPassword(
        getAuth(app),
        defaultEmail,
        player.password
      );

      if (auth.user) {
        const users = collection(db, "users");
        delete player["password"];
        await addDoc(users, {
          ...player,
        });
      }
    } catch {
      //
    }
  }
};
