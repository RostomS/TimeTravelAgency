# TimeTravel Agency

*Une agence de voyage temporel de luxe — explorez l'Histoire de près, sans jamais la déranger.*

**L'application en ligne : [time-travel-agency-nu.vercel.app](https://time-travel-agency-nu.vercel.app/)**

> Il n'y a rien à installer pour l'utiliser. Ouvrez le lien ci-dessus dans n'importe quel navigateur, sur ordinateur ou sur mobile, et tout fonctionne — y compris le chatbot.

---

## L'idée

TimeTravel Agency est une agence fictive qui propose à quelques privilégiés de partir observer trois moments précis de l'Histoire. Ce site est sa vitrine : on y découvre les destinations, on se laisse guider vers celle qui nous correspond, et on échange avec un conseiller pour préparer son départ.

Trois époques sont au catalogue :

- **Paris 1889** — la Belle Époque, la Tour Eiffel tout juste inaugurée et l'Exposition Universelle.
- **Crétacé, il y a 65 millions d'années** — une plaine sauvage de dinosaures, juste avant la grande extinction.
- **Florence 1504** — la Renaissance, le jour où le David de Michel-Ange est dressé sur la place publique.

Le projet a été réalisé dans le cadre du Mastère Expert IA (Ynov). Les destinations, les capsules et les tarifs sont entièrement imaginaires.

---

## Ce que l'on peut faire sur le site

- **Parcourir les trois destinations**, chacune avec sa fiche détaillée : le récit de l'époque, le programme du séjour, le tarif et la durée.
- **Passer le quiz "Trouvez votre époque idéale"** : quatre questions, et une recommandation rédigée sur mesure par l'intelligence artificielle à partir de vos réponses.
- **Discuter avec le conseiller-historien**, un chatbot qui connaît les trois époques et répond à vos questions sur les voyages, les prix ou le déroulement d'un séjour.
- **Réserver un départ** via un formulaire simple : date, nombre de voyageurs, contact.

---

## Comment s'en servir

Pour un visiteur, c'est immédiat :

1. Ouvrez **[time-travel-agency-nu.vercel.app](https://time-travel-agency-nu.vercel.app/)**.
2. Faites défiler pour découvrir les destinations, ou lancez le quiz.
3. Cliquez sur la bulle en bas à droite pour parler au conseiller.

Aucune inscription, aucune installation, rien à configurer.

---

## Sous le capot

Le site est volontairement léger : pas de framework, du code lisible et direct. La seule partie côté serveur est la fonction qui fait parler le chatbot, hébergée sur Vercel pour garder la clé d'accès à l'IA confidentielle.

| Élément | Choix technique |
|---|---|
| Interface | HTML, CSS et JavaScript natifs (sans framework) |
| Animations | Transitions CSS et IntersectionObserver (apparition au défilement) |
| Chatbot et reco du quiz | Fonction serverless sur Vercel, modèle **Llama 3.3 70B** via l'API **Groq** |
| Polices | Playfair Display et Inter (Google Fonts) |
| Hébergement | Vercel |

### Structure du projet

```
TimeTravel-Agency/
  index.html      la page
  styles.css      thème sombre et or, mise en page, animations
  app.js          destinations, quiz, formulaire, chatbot
  api/chat.js     fonction serverless qui interroge l'IA
  assets/         les visuels des trois époques
  README.md
```

---

## Faire tourner le projet en local (facultatif)

Inutile pour simplement consulter le site — c'est seulement pour reprendre le code.

```bash
# 1. Récupérer une clé gratuite sur https://console.groq.com (API Keys)
# 2. Copier .env.example en .env.local et y coller la clé
# 3. Lancer le petit serveur de développement fourni
node dev-server.mjs
# Le site est alors disponible sur http://localhost:3000
```

Sans clé, le site reste consultable : le chatbot bascule sur des réponses préenregistrées au lieu de l'IA.

---

## Crédits

Projet conçu, développé et rédigé par **Rostom**. La conception de l'interface, l'intégration du code, l'écriture des contenus historiques, la mise en place du chatbot et le déploiement ont été réalisés dans le cadre du **Mastère Expert IA (Ynov)** — projet pédagogique de la Session 2, à visée d'apprentissage.

Outils et ressources mobilisés : **Claude** (assistance à la maquette et au développement), API **Groq** (modèle Llama 3.3 70B) pour le conseiller et la recommandation du quiz, visuels des destinations générés en Session 1, polices Playfair Display et Inter (Google Fonts). Les destinations, capsules et tarifs sont fictifs.
