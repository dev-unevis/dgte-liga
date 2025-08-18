import {
  CalendarToday,
  Email,
  Lock,
  Person,
  Phone,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import type React from "react";
import { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    setError("");

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Lozinke se ne poklapaju");
      return;
    }

    if (formData.password.length < 6) {
      setError("Lozinka mora imati najmanje 6 karaktera");
      return;
    }

    try {
      setLoading(true);
      // Add your registration logic here
      console.log("Registration data:", formData);
    } catch (error) {
      console.log(error);
      setError("Greška pri registraciji. Pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
                Registrirajte se za novi račun
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
                id="email"
                label="Email"
                placeholder="Email"
                name="email"
                autoComplete="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                id="birthDate"
                label="Datum rođenja"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleInputChange("birthDate")}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday color="action" />
                    </InputAdornment>
                  ),
                }}
              />

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

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Lozinka"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleInputChange("password")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Potvrdi lozinku"
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleInputChange("confirmPassword")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword
                          ? <VisibilityOff />
                          : <Visibility />}
                      </IconButton>
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
                {loading ? "Registracija u tijeku..." : "Registriraj se"}
              </Button>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Već imaš korisnički račun?{" "}
                  <Link href="/login" color="primary">
                    Prijavi se
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
