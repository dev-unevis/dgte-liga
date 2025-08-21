import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { app } from "../../firebase.js";
import { players } from "./players";

export const createUsers = async () => {
  const db = getFirestore(app);

  for (const player of players) {
    try {
      const auth = await createUserWithEmailAndPassword(
        getAuth(app),
        player.email,
        player.password
      );

      if (auth.user) {
        const user = doc(db, "users", auth.user.uid);
        await setDoc(user, {
          firstName: player.firstName,
          lastName: player.lastName,
          phone: player.phone,
          email: player.email,
        });
      }
    } catch {
      //
    }
  }
};
