import { Form } from "@remix-run/react";
import { useState } from "react";

export default function ContactForm() {
  // État local pour gérer la soumission du formulaire
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fonction de soumission du formulaire
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Empêche la soumission par défaut du formulaire
    setIsSubmitting(true);

    // Simuler une soumission avec un délai (tu peux ici effectuer une requête vers ton API ou ton backend)
    setTimeout(() => {
      setIsSubmitting(false); // Réinitialise l'état après la soumission
      // Ajouter ici la logique de gestion du succès ou de l'erreur
    }, 2000); // Simule un délai de 2 secondes
  };

  return (
    <div className="w-full max-w-3xl mt-16">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Contactez-nous
      </h2>
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
