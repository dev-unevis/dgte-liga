import { Person, Phone } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import type React from "react";
import { useState } from "react";
import { supabase } from "../utils/supabase";

export function normalizeCroatianChars(text: string): string {
  if (!text) {
    return "";
  }

  // Step 1: Handle Digraphs (DŽ, LJ, NJ) first.
  // The most common transliteration keeps LJ/NJ as is, and DŽ as DZ.
  let normalizedText = text;

  // Use .replace() for case-insensitive global replacement (requires the 'g' flag)
  // Note: Older environments might need to chain multiple .replace() calls or polyfill .replaceAll()
  normalizedText = normalizedText
    .replace(/DŽ/g, "DZ")
    .replace(/Dž/g, "Dz")
    .replace(/dž/g, "dz")
    .replace(/LJ/g, "LJ")
    .replace(/Lj/g, "Lj")
    .replace(/lj/g, "lj")
    .replace(/NJ/g, "NJ")
    .replace(/Nj/g, "Nj")
    .replace(/nj/g, "nj");

  // Step 2: Handle single-character diacritics (Č, Ć, Š, Ž, Đ)
  const singleCharMap: { [key: string]: string } = {
    Č: "C",
    č: "c",
    Ć: "C",
    ć: "c",
    Š: "S",
    š: "s",
    Ž: "Z",
    ž: "z",
    Đ: "D",
    đ: "d",
  };

  // Create a regular expression to match all single diacritical characters
  const charRegex = /[ČčĆćŠšŽžĐđ]/g;

  // Use a replacement function to look up the correct substitute from the map
  normalizedText = normalizedText.replace(charRegex, (match: string) => {
    // We know 'match' will be a key in singleCharMap
    return singleCharMap[match];
  });

  return normalizedText;
}

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const fullName =
        formData.firstName.toLowerCase() +
        "." +
        formData.lastName.toLowerCase();

      const email = fullName + "@" + fullName + ".com";
      const { data } = await supabase.auth.signUp({
        email: normalizeCroatianChars(email),
        password:
          formData.firstName.toLowerCase() +
          formData.lastName.toLowerCase() +
          "123",
      });

      const id = data.user?.id;
      if (id) {
        await supabase.from("user").insert({
          user_id: id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email,
          phone: formData.phoneNumber,
        });
      }
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box className="min-h-screen flex flex-col justify-center items-center py-8">
        <Card className="w-full">
          <CardContent className="p-8!">
            <Box className="text-center mb-5">
              <Typography variant="h4" component="h1" gutterBottom>
                DGTE - LIGA
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Registriranje igrača
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="firstName"
                  label="Ime"
                  name="firstName"
                  placeholder="Ime"
                  autoComplete="given-name"
                  autoFocus
                  value={formData.firstName}
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
                  margin="normal"
                  required
                  fullWidth
                  id="lastName"
                  label="Prezime"
                  placeholder="Prezime"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
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
                margin="normal"
                required
                fullWidth
                id="phoneNumber"
                label="Broj telefona"
                placeholder="Broj telefona"
                name="phoneNumber"
                autoComplete="tel"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange("phoneNumber")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? "Registracija u tijeku..." : "Registriraj igrača"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
