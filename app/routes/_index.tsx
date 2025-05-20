import type { MetaFunction } from "@remix-run/node";
import { useEffect, useState } from "react";
import { getProfile, getToken } from "~/services/api/profile";
import ContactForm from "../components/forms";
import { getArticles } from "~/services/api/article";
import Article from "~/services/models/article";

const posts = await getArticles();

type Profile = {
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
};
export const meta: MetaFunction = () => {
  return [{ title: "Kachow" }, { name: "Cars", content: "I'm speed" }];
};

export default function Index() {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="sticky top-0 z-50 w-full bg-gray-100 bg-opacity-90 backdrop-blur-sm flex flex-col items-center pt-4 pb-2">
        {profile && (
          <div className="absolute top-4 left-4 bg-green-200 text-green-800 px-4 py-2 rounded shadow">
            Connected as {profile.username}
          </div>
        )}
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-teal-400 to-green-400 drop-shadow-lg mb-2">
          Kachow
        </h1>
        <div className="w-2/3 h-[2px] bg-gradient-to-r from-blue-500 via-teal-400 to-green-400 rounded-full opacity-70" />
      </div>

      <section className="w-full max-w-3xl space-y-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Nos derniers posts
        </h2>
        <div className="space-y-6">
          {posts.map((post: Article) => (
            <div
              key={post.id}
              className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg p-6"
            >
              <img
                src={"http://localhost:1337" + post.image.url}
                alt={post.Title}
                className="w-full md:w-1/3 h-auto object-cover rounded-md mb-4 md:mb-0"
              />
              <div className="md:ml-6 flex flex-col justify-between">
                <h3 className="text-xl font-semibold text-gray-800">
                  {post.Title}
                </h3>
                <p className="text-gray-600 mb-4">{post.Description}</p>
                <span className="text-sm text-gray-500">
                  Publié le {new Date(post.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ContactForm />
    </div>
  );
}
