// reset-admin.js - À placer dans le dossier racine de votre projet Strapi
"use strict";

module.exports = async ({ strapi }) => {
  const adminUser = {
    username: "admin",
    email: "admin@example.com",
    password: "admin123", // Changez ce mot de passe
    firstname: "Admin",
    lastname: "User",
    blocked: false,
    isActive: true,
  };

  try {
    // Chercher s'il existe déjà un admin
    const existingAdmins = await strapi.db.query("admin::user").findMany();

    if (existingAdmins.length > 0) {
      // Mettre à jour le premier admin trouvé
      const updatedAdmin = await strapi.db.query("admin::user").update({
        where: { id: existingAdmins[0].id },
        data: {
          password: adminUser.password,
          email: adminUser.email,
          username: adminUser.username,
        },
      });

      console.log("✅ Admin mis à jour avec succès !");
      console.log(`📧 Email: ${adminUser.email}`);
      console.log(`🔑 Mot de passe: ${adminUser.password}`);
    } else {
      // Créer un nouvel admin
      const newAdmin = await strapi.db.query("admin::user").create({
        data: adminUser,
      });

      console.log("✅ Nouvel admin créé avec succès !");
      console.log(`📧 Email: ${adminUser.email}`);
      console.log(`🔑 Mot de passe: ${adminUser.password}`);
    }
  } catch (error) {
    console.error("❌ Erreur:", error.message);
  }
};
