import { Form } from "@remix-run/react";
import { useState } from "react";
import { postMessage, MessagePayload } from "~/services/api/message"; // adapte le chemin si besoin

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSuccess(null);
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload: MessagePayload = {
      Message: formData.get("message") as string,
      email: formData.get("email") as string,
    };
    console.log(payload);

    try {
      const response = await postMessage(payload);
      console.log(response);

      setSuccess("Message envoyé avec succès !");
      form.reset(); // Réinitialise le formulaire
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de l'envoi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mt-16">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Contactez-nous
      </h2>

      {success && (
        <p className="text-green-600 font-medium text-center mb-4">{success}</p>
      )}
      {error && (
        <p className="text-red-600 font-medium text-center mb-4">{error}</p>
      )}

      <Form method="post" onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full p-4 mt-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-200 bg-white dark:bg-white dark:text-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            className="w-full p-4 mt-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-200 bg-white dark:bg-white dark:text-gray-700 dark:border-gray-600"
            rows={5}
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full p-4 mt-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Envoi en cours..." : "Envoyer"}
        </button>
      </Form>
    </div>
  );
}
