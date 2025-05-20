import { json, type ActionFunction } from "@remix-run/node";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { login } from "~/services/api/auth";
import { AxiosError } from "axios";

// Action server-side
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const identifier = formData.get("identifier")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  try {
    const response = await login({ identifier, password });

    if (response.jwt) {
      // Renvoie le token pour stockage client
      return json({ success: true, token: response.jwt });
    }

    return json(
      { success: false, error: "Token manquant dans la réponse." },
      { status: 400 }
    );
  } catch (error: unknown) {
    let message = "Erreur inconnue";
    if (error instanceof AxiosError && error.response) {
      message = error.response.data?.error?.message || "Erreur API";
    }
    return json({ success: false, error: message }, { status: 400 });
  }
};

// Composant de page
export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();

  useEffect(() => {
    if (actionData?.success && actionData.token) {
      localStorage.setItem("token", actionData.token);
      navigate("/", { replace: true });
    }
  }, [actionData, navigate]);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Connexion</h1>
      <Form method="post" className="flex flex-col gap-3">
        <input
          type="text"
          name="identifier"
          placeholder="Nom d'utilisateur ou email"
          required
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          required
          className="p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Se connecter
        </button>
      </Form>

      {actionData?.error && (
        <p className="text-red-500 mt-4">{actionData.error}</p>
      )}
    </div>
  );
}
