import { type ActionFunction, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { login } from "~/services/api/auth";
import { AxiosError } from "axios";
import { createUserSession } from "~/services/auth/session.server"; // Adapté à votre structure

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const identifier = formData.get("identifier")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  try {
    const response = await login({ identifier, password });

    // Vérifiez que vous avez bien un JWT dans la réponse
    if (response.jwt) {
      // Utilisez la fonction createUserSession de votre service d'authentification
      return createUserSession(response.jwt, "/");
    }

    // Fallback au cas où il n'y a pas de JWT mais l'authentification est réussie
    return redirect("/");
  } catch (error: unknown) {
    let message = "Erreur inconnue";
    if (error instanceof AxiosError && error.response) {
      message = error.response.data?.error?.message || "Erreur API";
    }
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export default function LoginPage() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Connexion</h1>
      <Form method="post" className="flex flex-col gap-2 mt-4">
        <input
          type="text"
          name="identifier"
          placeholder="Nom d'utilisateur ou email"
          required
          className="p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          required
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Se connecter
        </button>
      </Form>

      {actionData?.error && (
        <p className="text-red-500 mt-2">{actionData.error}</p>
      )}
    </div>
  );
}
