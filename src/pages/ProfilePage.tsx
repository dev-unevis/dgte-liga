import {
  CalendarToday,
  Cancel,
  Email,
  Lock,
  Person,
  Phone,
  PhotoCamera,
  Save,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import type React from "react";
import { useRef, useState } from "react";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  phoneNumber: string;
  avatar?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "Marko",
    lastName: "Petrović",
    email: "marko.petrovic@example.com",
    birthDate: "1990-05-15",
    phoneNumber: "+381 60 123 4567",
    avatar: "/placeholder.svg?height=120&width=120",
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleInputChange =
    (field: keyof UserProfile) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditedProfile((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handlePasswordChange =
    (field: keyof typeof passwordData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setAvatarPreview(result);
        setEditedProfile((prev) => ({
          ...prev,
          avatar: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      console.log("Updated profile:", editedProfile);

      setProfile(editedProfile);
      setAvatarPreview(null);
      setSuccess("Profil je uspešno ažuriran!");
    } catch (error) {
      console.log(error);
      setError("Greška pri ažuriranju profila. Pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setError("");
    setSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Nove lozinke se ne poklapaju");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Nova lozinka mora imati najmanje 6 karaktera");
      return;
    }

    try {
      setLoading(true);
      console.log("Password change requested");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSuccess("Lozinka je uspešno promenjena!");
    } catch (error) {
      console.log(error);
      setError("Greška pri promeni lozinke. Pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setAvatarPreview(null);
    setError("");
  };

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
              {/* Avatar Section */}
              <Box className="flex flex-col items-center">
                <Box sx={{ position: "relative", mb: 2 }}>
                  <Avatar
                    src={avatarPreview || editedProfile.avatar}
                    sx={{
                      width: 120,
                      height: 120,
                      cursor: "pointer",
                    }}
                    onClick={handleAvatarClick}
                  >
                    {editedProfile.firstName[0]}
                    {editedProfile.lastName[0]}
                  </Avatar>
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      backgroundColor: "primary.main",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                      width: 32,
                      height: 32,
                    }}
                    onClick={handleAvatarClick}
                  >
                    <PhotoCamera fontSize="small" />
                  </IconButton>
                </Box>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />
                <Typography variant="h6">
                  {editedProfile.firstName} {editedProfile.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {editedProfile.email}
                </Typography>
              </Box>

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
                  label="Email"
                  type="email"
                  value={editedProfile.email}
                  onChange={handleInputChange("email")}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Datum rođenja"
                  type="date"
                  value={editedProfile.birthDate}
                  onChange={handleInputChange("birthDate")}
                  sx={{ mb: 2 }}
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
                  fullWidth
                  label="Broj telefona"
                  value={editedProfile.phoneNumber}
                  onChange={handleInputChange("phoneNumber")}
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
        </Card>

        {/* Password Change Card */}
        <Card>
          <CardContent className="p-8">
            <Typography variant="h5" component="h2" gutterBottom>
              Promjena lozinke
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box className="max-w-md">
              <TextField
                fullWidth
                label="Trenutna lozinka"
                type={showPasswords.current ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={handlePasswordChange("currentPassword")}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility("current")}
                        edge="end"
                      >
                        {showPasswords.current ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Nova lozinka"
                type={showPasswords.new ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={handlePasswordChange("newPassword")}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility("new")}
                        edge="end"
                      >
                        {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Potvrdi novu lozinku"
                type={showPasswords.confirm ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange("confirmPassword")}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility("confirm")}
                        edge="end"
                      >
                        {showPasswords.confirm ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                variant="contained"
                onClick={handleChangePassword}
                disabled={
                  loading ||
                  !passwordData.currentPassword ||
                  !passwordData.newPassword ||
                  !passwordData.confirmPassword
                }
              >
                {loading ? "Menjanje..." : "Promeni lozinku"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
