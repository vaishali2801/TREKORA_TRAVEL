export type GearProduct = {
  _id: string;
  name: string;
  category: string;
  brand: string;
  image: string;
  gallery: string[];
  price: number;
  oldPrice?: number;
  rentPerDay?: number;
  rating: number;
  reviews: number;
  stock: number;
  tag?: string;
  weight: string;
  shortDescription: string;
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
};

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

export const GEAR_CATEGORIES = [
  "all",
  "Backpacks",
  "Tents",
  "Sleeping",
  "Footwear",
  "Clothing",
  "Accessories",
] as const;

export const GEAR_PRODUCTS: GearProduct[] = [
  {
    _id: "gear-1",
    name: "Summit Pro 65L Trekking Backpack",
    category: "Backpacks",
    brand: "TrekVista Gear",
    image: img("photo-1553062407-98eeb64c6a62"),
    gallery: [img("photo-1553062407-98eeb64c6a62"), img("photo-1622260614153-03223fb72052")],
    price: 8499,
    oldPrice: 10999,
    rentPerDay: 349,
    rating: 4.8,
    reviews: 214,
    stock: 18,
    tag: "Bestseller",
    weight: "1.9 kg",
    shortDescription: "Ventilated alpine carry system built for 10-day Himalayan expeditions.",
    description:
      "A 65-litre expedition hauler with an adjustable aluminium frame, breathable mesh back panel and rain cover. Load-lifter straps transfer weight to the hips so your shoulders stay fresh on long ascents.",
    features: [
      "Adjustable torso length (42–54 cm)",
      "Integrated storm-proof rain cover",
      "Hydration bladder sleeve up to 3L",
      "Dual ice-axe and trekking-pole loops",
    ],
    specs: [
      { label: "Capacity", value: "65 + 10 L" },
      { label: "Fabric", value: "420D ripstop nylon" },
      { label: "Frame", value: "Aluminium perimeter" },
      { label: "Warranty", value: "3 years" },
    ],
  },
  {
    _id: "gear-2",
    name: "Alpine Dome 2-Person Tent",
    category: "Tents",
    brand: "Basecamp Co.",
    image: img("photo-1504280390367-361c6d9f38f4"),
    gallery: [img("photo-1504280390367-361c6d9f38f4"), img("photo-1478131143081-80f7f84ca84d")],
    price: 14999,
    rentPerDay: 599,
    rating: 4.7,
    reviews: 138,
    stock: 9,
    tag: "Rental favourite",
    weight: "2.4 kg",
    shortDescription: "Four-season double-wall dome rated for high-wind ridgeline camps.",
    description:
      "Colour-coded DAC poles pitch in under four minutes. The 5000 mm hydrostatic-head fly and taped bathtub floor keep monsoon nights dry, while twin vestibules swallow packs and boots.",
    features: [
      "5000 mm waterproof rating",
      "Twin doors and vestibules",
      "Snow skirt for winter camps",
      "Packs to 46 × 18 cm",
    ],
    specs: [
      { label: "Sleeps", value: "2 adults" },
      { label: "Season", value: "4-season" },
      { label: "Poles", value: "DAC Featherlite" },
      { label: "Packed weight", value: "2.4 kg" },
    ],
  },
  {
    _id: "gear-3",
    name: "Everest -15°C Sleeping Bag",
    category: "Sleeping",
    brand: "NordFeather",
    image: img("photo-1520095972714-909e91b038e5"),
    gallery: [img("photo-1520095972714-909e91b038e5")],
    price: 9999,
    oldPrice: 12500,
    rentPerDay: 399,
    rating: 4.9,
    reviews: 176,
    stock: 22,
    weight: "1.3 kg",
    shortDescription: "800-fill goose-down mummy bag for sub-zero high-altitude nights.",
    description:
      "Ethically sourced 800-fill-power down inside a hydrophobic shell. Trapezoidal baffles stop cold spots and the anatomical hood cinches down to a small breathing port.",
    features: [
      "Comfort rating -15°C",
      "Hydrophobic 800FP down",
      "Anti-snag two-way zipper",
      "Compression sack included",
    ],
    specs: [
      { label: "Fill", value: "800FP goose down" },
      { label: "Shape", value: "Mummy" },
      { label: "Weight", value: "1.3 kg" },
      { label: "Packed size", value: "24 × 38 cm" },
    ],
  },
  {
    _id: "gear-4",
    name: "Ridgeline GTX Trekking Boots",
    category: "Footwear",
    brand: "Stonepath",
    image: img("photo-1520219306100-ec69c7596ec6"),
    gallery: [img("photo-1520219306100-ec69c7596ec6")],
    price: 11499,
    rentPerDay: 449,
    rating: 4.6,
    reviews: 302,
    stock: 31,
    tag: "New",
    weight: "1.1 kg / pair",
    shortDescription: "Waterproof nubuck boots with a stiff shank for scree and moraine.",
    description:
      "A GORE-TEX membrane keeps stream crossings honest while the Vibram Megagrip outsole bites into wet rock. A half-length shank supports crampon-compatible step kicking.",
    features: [
      "GORE-TEX waterproof lining",
      "Vibram Megagrip outsole",
      "Ankle-locking lacing system",
      "Removable orthotic footbed",
    ],
    specs: [
      { label: "Upper", value: "Nubuck leather" },
      { label: "Sizes", value: "UK 5 – 12" },
      { label: "Cut", value: "High ankle" },
      { label: "Weight", value: "550 g per boot" },
    ],
  },
  {
    _id: "gear-5",
    name: "Stormshield 3-Layer Jacket",
    category: "Clothing",
    brand: "TrekVista Gear",
    image: img("photo-1551028719-00167b16eac5"),
    gallery: [img("photo-1551028719-00167b16eac5")],
    price: 13499,
    oldPrice: 15999,
    rentPerDay: 499,
    rating: 4.7,
    reviews: 121,
    stock: 14,
    weight: "480 g",
    shortDescription: "Fully seam-sealed hardshell that packs into its own chest pocket.",
    description:
      "Three-layer laminate with pit zips, a helmet-compatible hood and articulated sleeves for scrambling. Weighs less than a water bottle yet shrugs off horizontal rain.",
    features: [
      "20k/20k waterproof-breathable",
      "Helmet-compatible storm hood",
      "Two-way pit ventilation zips",
      "Packs into chest pocket",
    ],
    specs: [
      { label: "Layers", value: "3L laminate" },
      { label: "Sizes", value: "XS – XXL" },
      { label: "Weight", value: "480 g" },
      { label: "Fit", value: "Athletic" },
    ],
  },
  {
    _id: "gear-6",
    name: "Carbon Quick-Lock Trekking Poles",
    category: "Accessories",
    brand: "Stonepath",
    image: img("photo-1533240332313-0db49b459ad6"),
    gallery: [img("photo-1533240332313-0db49b459ad6")],
    price: 5499,
    rentPerDay: 199,
    rating: 4.5,
    reviews: 96,
    stock: 40,
    weight: "460 g / pair",
    shortDescription: "Featherweight carbon poles that save your knees on long descents.",
    description:
      "Three-section carbon shafts with external quick-locks you can adjust with gloves on. Cork grips wick sweat and mould to your hand over time.",
    features: [
      "100% carbon-fibre shafts",
      "Glove-friendly quick-locks",
      "Natural cork grips",
      "Snow, mud and trekking baskets",
    ],
    specs: [
      { label: "Length", value: "65 – 135 cm" },
      { label: "Weight", value: "230 g each" },
      { label: "Sections", value: "3" },
      { label: "Includes", value: "3 basket types" },
    ],
  },
  {
    _id: "gear-7",
    name: "Trailburner Camp Stove Kit",
    category: "Accessories",
    brand: "Basecamp Co.",
    image: img("photo-1537565266759-34bbc16be345"),
    gallery: [img("photo-1537565266759-34bbc16be345")],
    price: 4299,
    rentPerDay: 179,
    rating: 4.4,
    reviews: 74,
    stock: 26,
    weight: "620 g",
    shortDescription: "Windproof canister stove with nesting 1L pot and heat exchanger.",
    description:
      "Boils a litre in three minutes at 4,500 m thanks to a pressure-regulated valve and heat-exchanger base. The whole kit nests around a 230 g gas canister.",
    features: [
      "Pressure-regulated in cold",
      "Piezo ignition",
      "Nesting 1L anodised pot",
      "Foldable canister stand",
    ],
    specs: [
      { label: "Output", value: "2600 W" },
      { label: "Boil time", value: "3 min / 1 L" },
      { label: "Fuel", value: "Butane-propane" },
      { label: "Weight", value: "620 g kit" },
    ],
  },
  {
    _id: "gear-8",
    name: "Insulated Base Layer Set",
    category: "Clothing",
    brand: "NordFeather",
    image: img("photo-1516762689617-e1cffcef479d"),
    gallery: [img("photo-1516762689617-e1cffcef479d")],
    price: 3599,
    rating: 4.3,
    reviews: 58,
    stock: 52,
    weight: "330 g",
    shortDescription: "Merino-blend thermals that stay odour-free for a week on trail.",
    description:
      "A 200 gsm merino and recycled-poly blend with flatlock seams. Warm when damp, quick to dry at camp and soft enough to sleep in.",
    features: [
      "200 gsm merino blend",
      "Flatlock chafe-free seams",
      "Odour resistant for 7+ days",
      "Top and bottom included",
    ],
    specs: [
      { label: "Material", value: "70% merino / 30% poly" },
      { label: "Sizes", value: "S – XXL" },
      { label: "Weight", value: "330 g set" },
      { label: "Care", value: "Machine wash cold" },
    ],
  },
];

export const MAX_GEAR_PRICE = 16000;

export const getGearById = (id: string) => GEAR_PRODUCTS.find((p) => p._id === id);
