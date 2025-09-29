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
        email: email,
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
