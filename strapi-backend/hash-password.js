// fix-password.js
const bcrypt = require("bcrypt");

async function fixPassword() {
  console.log("🔧 CORRECTION DU HASH DE MOT DE PASSE\n");

  const passwords = ["admin1234", "admin123", "password"];

  for (const pwd of passwords) {
    try {
      const hash = await bcrypt.hash(pwd, 10);
      console.log(`🔑 Mot de passe: ${pwd}`);
      console.log(`   Hash à copier: ${hash}`);
      console.log("   ─".repeat(80));
    } catch (error) {
      console.error(`Erreur pour ${pwd}:`, error.message);
    }
  }

  console.log("\n📋 INSTRUCTIONS:");
  console.log("1. Arrêtez Strapi");
  console.log(
    '2. Dans votre DB, remplacez "admin1234" par un des hashes ci-dessus'
  );
  console.log("3. Sauvegardez (Ctrl+S)");
  console.log("4. Redémarrez Strapi");
  console.log("5. Connectez-vous avec le mot de passe correspondant");

  console.log("\n⚠️  IMPORTANT:");
  console.log(
    "   Le champ password doit contenir le HASH, pas le mot de passe !"
  );
}

fixPassword().catch(console.error);
