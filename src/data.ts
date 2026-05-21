// 1. Stan konta Emerald
export const emeraldWallet = {
  balance: 4250.0,
};

// 2. Baza słowników (do list rozwijanych i podpowiedzi)
export const availableTowns = [
  "Warszawa",
  "Kraków",
  "Wrocław",
  "Poznań",
  "Gdańsk",
  "Szczecin",
  "Bydgoszcz",
  "Lublin",
  "Rzeszów",
  "Ropczyce",
];

export const availableKeywords = [
  "elektronika",
  "sport",
  "turystyka",
  "gaming",
  "dom",
  "ogród",
  "moda",
  "buty",
  "akcesoria",
  "smartfon",
  "laptop",
  "audio",
];

// 3. Baza Produktów (Twój asortyment)
export const products = [
  {
    id: "prod_001",
    name: "Słuchawki Bezprzewodowe PRO",
    price: 299.99,
    stock: 45,
    imageUrl:
      "https://cdn.pixabay.com/photo/2014/12/10/12/28/iphone-563072_1280.jpg",
  },
  {
    id: "prod_002",
    name: "Smartwatch Sportowy X",
    price: 599.0,
    stock: 12,
    imageUrl:
      "https://cdn.pixabay.com/photo/2014/12/10/12/28/iphone-563072_1280.jpg",
  },
  {
    id: "prod_003",
    name: "Plecak Turystyczny 40L",
    price: 149.5,
    stock: 105,
    imageUrl:
      "https://cdn.pixabay.com/photo/2014/12/10/12/28/iphone-563072_1280.jpg",
  },
  {
    id: "prod_004",
    name: "Klawiatura Mechaniczna RGB",
    price: 349.0,
    stock: 8,
    imageUrl:
      "https://cdn.pixabay.com/photo/2014/12/10/12/28/iphone-563072_1280.jpg",
  },
];

// 4. Baza Kampanii (Zwróć uwagę na klucz 'productId', który łączy kampanię z produktem)
export const campaigns = [
  {
    id: "camp_101",
    productId: "prod_001", // Powiązane ze słuchawkami
    name: "Wiosenna wyprzedaż audio",
    keywords: ["elektronika", "audio", "gaming"],
    bidAmount: 0.55,
    fund: 500.0,
    status: true, // Kampania aktywna (On)
    town: "Warszawa",
    radius: 25,
  },
  {
    id: "camp_102",
    productId: "prod_003", // Powiązane z plecakiem
    name: "Góry 2026 Promo",
    keywords: ["sport", "turystyka", "akcesoria"],
    bidAmount: 1.2,
    fund: 150.0,
    status: false, // Kampania wstrzymana (Off)
    town: "Kraków",
    radius: 50,
  },
];
