const bcrypt = require("bcrypt");

async function resetAdminPassword() {
  try {
    // Nouveau mot de passe que vous voulez utiliser
    const newPassword = "admin123"; // Changez ceci

    // Hash du nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    console.log("Nouveau mot de passe:", newPassword);
    console.log("Hash généré:", hashedPassword);
    console.log("\n--- Instructions ---");
    console.log("1. Arrêtez Strapi");
    console.log(
      "2. Ouvrez votre base de données SQLite avec un outil comme DB Browser for SQLite"
    );
    console.log('3. Allez dans la table "admin_users"');
    console.log("4. Trouvez votre utilisateur admin");
    console.log('5. Remplacez la valeur du champ "password" par:');
    console.log(`   ${hashedPassword}`);
    console.log("6. Sauvegardez et redémarrez Strapi");
    console.log(`7. Connectez-vous avec le mot de passe: ${newPassword}`);
  } catch (error) {
    console.error("Erreur:", error);
  }
}

resetAdminPassword();
