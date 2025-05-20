import { getProfile, getToken } from "~/services/api/profile";
import { useEffect, useState } from "react";

type Profile = {
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
};

export default function ProfilePage() {
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Récupère le token une fois qu'il est dispo (ex: cookie local ou appel API)
  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken();
      setToken(token);
    };
    fetchToken();
  }, []);

  // Récupère le profil dès que le token est dispo
  useEffect(() => {
    if (!token) return;
    const fetchProfile = async () => {
      const profileData = await getProfile(token);
      setProfile(profileData);
    };
    fetchProfile();
  }, [token]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Profile</h1>

      {profile && (
        <div className="bg-black-100 p-4 mt-4 rounded shadow">
          <p><strong>Nom d utilisateur :</strong> {profile.username}</p>
          <p><strong>Email :</strong> {profile.email}</p>
          <p><strong>Confirmé :</strong> {profile.confirmed ? "Oui" : "Non"}</p>
          <p><strong>Bloqué :</strong> {profile.blocked ? "Oui" : "Non"}</p>
        </div>
      )}
    </div>
  );
}
