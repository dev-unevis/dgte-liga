import { Cancel, Person, Phone, Save } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  InputAdornment,
  TextField,
} from "@mui/material";
import { getAuth, updateEmail } from "firebase/auth";
import { isEmpty } from "lodash-es";
import type React from "react";
import { useEffect, useState } from "react";
import { useUsers } from "../providers/UsersProvider";
import type { TUser } from "../types";
import { updateItem } from "../utils/updateItem";

export default function ProfilePage() {
  const { users, refresh } = useUsers();
  const auth = getAuth();
  const [profile, setProfile] = useState<TUser>(
    users.find((u) => u.id === auth.currentUser?.uid) as TUser
  );

  const [editedProfile, setEditedProfile] = useState<TUser>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    avatar: "",
    id: "",
    isAdmin: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange =
    (field: keyof TUser) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditedProfile((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSaveProfile = async () => {
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      console.log("Updated profile:", editedProfile);

      if (auth.currentUser) {
        await updateItem("users", profile.id, editedProfile);
        const defaultEmail =
          profile.firstName.toLowerCase() +
          "." +
          profile.lastName.toLowerCase() +
          "@" +
          profile.firstName.toLowerCase() +
          "." +
          profile.lastName.toLowerCase();
        const email = !isEmpty(editedProfile.email)
          ? editedProfile.email
          : defaultEmail;
        await updateEmail(auth.currentUser, email);
      }
      setSuccess("Profil je uspešno ažuriran!");
    } catch (error) {
      console.log(error);
      setError("Greška pri ažuriranju profila. Pokušajte ponovo.");
    } finally {
      await refresh();
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setError("");
  };

  useEffect(() => {
    const userProfile = users.find((u) => u.id === auth.currentUser?.uid);

    if (userProfile) {
      const defaultEmail =
        userProfile.firstName.toLowerCase() +
        "." +
        userProfile.lastName.toLowerCase() +
        "@" +
        userProfile.firstName.toLowerCase() +
        "." +
        userProfile.lastName.toLowerCase();

      if (userProfile.email === defaultEmail) {
        userProfile.email = "";
      }

      setProfile(userProfile);
      setEditedProfile(userProfile);
    }
  }, [users, auth.currentUser]);

  if (!profile) return;

  return (
    <Container component="main" maxWidth="md">
      <Box className="min-h-screen py-8">
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        {/* Profile Information Card */}
        <Card className="mb-6">
          <CardContent className="p-8">
            <Box className="flex flex-col md:flex-row gap-6">
              {/* Profile Form */}
              <Box className="flex-1">
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Ime"
                    value={editedProfile.firstName}
                    onChange={handleInputChange("firstName")}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Prezime"
                    value={editedProfile.lastName}
                    onChange={handleInputChange("lastName")}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <TextField
                  fullWidth
                  label="Broj telefona"
                  value={editedProfile.phone}
                  onChange={handleInputChange("phone")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <Box className="flex gap-2 mt-4">
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSaveProfile}
                    disabled={loading}
                  >
                    {loading ? "Čuvanje..." : "Sačuvaj"}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Otkaži
                  </Button>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>{" "}
      </Box>
    </Container>
  );
}
