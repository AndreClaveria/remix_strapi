// app/routes/register.tsx
import { ActionFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { register } from "~/services/api/auth";
import { AxiosError } from "axios";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  try {
    const data = await register({ username, email, password });
    return new Response(JSON.stringify({ success: true, user: data.user }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    let message = "Erreur inconnue";

    if (error instanceof AxiosError && error.response) {
      message = error.response.data?.error?.message || "Erreur API inconnue";
    }

    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export default function RegisterPage() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Créer un compte</h1>
      <Form method="post" className="flex flex-col gap-2 mt-4">
        <input
          type="text"
          name="username"
          placeholder="Nom d'utilisateur"
          required
        />
        <input type="email" name="email" placeholder="Email" required />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          required
        />
        <button type="submit">Inscription</button>
      </Form>

      {actionData?.error && (
        <p className="text-red-500 mt-2">{actionData.error}</p>
      )}
      {actionData?.success && (
        <p className="text-green-500 mt-2">Inscription réussie !</p>
      )}
    </div>
  );
}
