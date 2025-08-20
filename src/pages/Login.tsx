import { Lock, Person, Visibility, VisibilityOff } from "@mui/icons-material";
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
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import type React from "react";
import { useState } from "react";
import { app } from "../../firebase";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      // We are just trying to have some way of user management, meaning that each user
      // has it's profile but is not bothered with the whole registration flow
      const email = username + '@' + username
      await signInWithEmailAndPassword(getAuth(app), email, password);
    } catch (error) {
      console.log(error);
      setError("Korisničko ime ili lozinka su netočni, molim vas pokušajte opet.")
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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
                Prijavite se za nastavak
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Korisničko ime"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                name="password"
                label="Lozinka"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
                disabled={loading}
              >
                {loading ? "Prijava u tijeku..." : "Prijavi se"}
              </Button>

              {/* <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Nemaš korisnički račun?{" "}
                  <Link href="/register" color="primary">
                    Registriraj se
                  </Link>
                </Typography>
              </Box> */}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
