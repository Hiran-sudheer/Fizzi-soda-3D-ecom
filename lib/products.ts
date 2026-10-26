export const products = [
  {
    id: "black-cherry",
    flavor: "blackCherry",
    name: "Black Cherry",
    note: "Dark cherry. Bright personality.",
    description:
      "Deep, juicy cherry with a refreshingly crisp finish. The bold one in the bunch, made for late afternoons and whatever comes next.",
    color: "#b90e42",
    background: "#f8dce4",
    label: "/labels/cherry.png",
    accent: "#a8d500",
    tag: "THE CROWD FAVORITE",
  },
  {
    id: "lemon-lime",
    flavor: "lemonLime",
    name: "Lemon Lime",
    note: "A little zing. A lot of sunshine.",
    description:
      "A lively squeeze of lemon meets a bright twist of lime. Familiar, refreshing, and always ready to make an ordinary moment feel a little sunnier.",
    color: "#42652a",
    background: "#e4edc4",
    label: "/labels/lemon-lime.png",
    accent: "#d4ed53",
    tag: "FRESH PICK",
  },
  {
    id: "grape",
    flavor: "grape",
    name: "Grape Goodness",
    note: "Your childhood favorite, all grown up.",
    description:
      "Big, nostalgic grape flavor with a light, sparkling finish. A playful little throwback with a whole new outlook.",
    color: "#713d8d",
    background: "#eaddf2",
    label: "/labels/grape.png",
    accent: "#bea0de",
    tag: "PURE NOSTALGIA",
  },
  {
    id: "strawberry-lemonade",
    flavor: "strawberryLemonade",
    name: "Strawberry Lemonade",
    note: "Sweet meets a sunny little twist.",
    description:
      "Ripe strawberry and a splash of tart lemonade. Your favorite summer afternoon, all dressed up in bubbles.",
    color: "#b63851",
    background: "#f8d9d4",
    label: "/labels/strawberry.png",
    accent: "#ffc27c",
    tag: "SUNSHINE IN A CAN",
  },
  {
    id: "watermelon",
    flavor: "watermelon",
    name: "Watermelon Crush",
    note: "Summer called. We canned it.",
    description:
      "Crisp, juicy watermelon with easygoing bubbles. A picnic, a pool day, a very good excuse to take a break.",
    color: "#4d6b2b",
    background: "#e3eccb",
    label: "/labels/watermelon.png",
    accent: "#fc8b9c",
    tag: "SUMMER STATE OF MIND",
  },
] as const;

export type Product = (typeof products)[number];
export type ProductId = Product["id"];
export const PACK_SIZE = 12;
export const PACK_PRICE = 2999;
export const FREE_SHIPPING = 5000;
export const SHIPPING = 499;
export const MAX_QUANTITY = 12;
export const money = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100,
  );
export const getProduct = (id: string) =>
  products.find((product) => product.id === id);
