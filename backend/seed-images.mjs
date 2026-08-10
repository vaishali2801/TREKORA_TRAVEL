import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import Package from "./models/Package.js";
import Event from "./models/Event.js";
import Product from "./models/Product.js";

await mongoose.connect(process.env.MONGO_URI);

const ADMIN = "6a70651b08d2a8c19f0dcd1d";
const u = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

// ---- 1. Remove duplicate Goa package ----
const dupes = await Package.find({ title: "Goa Beach Family Tour" });
dupes.slice(1).forEach(async (d) => {
  await Package.findByIdAndDelete(d._id);
});
console.log("removed duplicate Goa packages:", dupes.length - 1);

// ---- 2. Update existing packages: images + featured ----
const updates = [
  { title: "Goa Beach Family Tour", images: [u("photo-1507525428034-b723cf961d3e")], isFeatured: true },
  { title: "Lonavala Monsoon Trek", images: [u("photo-1432405972618-c60b0225b8f9")], isFeatured: true },
];
for (const upd of updates) {
  const r = await Package.updateOne({ title: upd.title }, upd);
  console.log(`updated ${upd.title}:`, r.modifiedCount);
}

// ---- 3. Seed new featured packages ----
const NEW_PACKAGES = [
  {
    title: "Ladakh Snow Trek Expedition",
    location: "Ladakh",
    duration: 7,
    price: 18999,
    category: "Snow Trek",
    difficulty: "Hard",
    bestSeason: "June – September",
    isFeatured: true,
    images: [u("photo-1544735716-392fe2489ffa")],
    description:
      "Cross high-altitude passes, visit remote monasteries and camp under star-filled skies on this classic Ladakh expedition.",
    highlights: ["Khardung La Pass", "Pangong Lake sunrise", "Nubra Valley sand dunes", "Monastery visits"],
    included: ["All camping equipment", "Meals on trek", "Certified mountain guide", "Transport from Leh"],
    excluded: ["International flights", "Travel insurance", "Personal expenses"],
    rating: 4.8,
  },
  {
    title: "Kerala Backwaters Family Tour",
    location: "Kerala",
    duration: 5,
    price: 15999,
    category: "Family Tour",
    difficulty: "Easy",
    bestSeason: "October – March",
    isFeatured: true,
    images: [u("photo-1476514525535-07fb3b4ae5f1")],
    description:
      "Glide through palm-fringed backwaters on a private houseboat, with ayurvedic spa, tea plantations and village life.",
    highlights: ["Private houseboat cruise", "Munnar tea gardens", "Kathakali performance", "Ayurvedic massage"],
    included: ["Houseboat stay (2 nights)", "Daily breakfast & dinner", "AC transfers", "Local guide"],
    excluded: ["Lunch on shore days", "Spa treatments", "Personal expenses"],
    rating: 4.9,
  },
  {
    title: "Kedarkantha Winter Trek",
    location: "Uttarakhand",
    duration: 6,
    price: 9999,
    category: "Snow Trek",
    difficulty: "Moderate",
    bestSeason: "December – April",
    isFeatured: true,
    images: [u("photo-1483728642387-6c3bdd6c93e5")],
    description:
      "India's most loved winter summit — snow-clad ridges, pine forests and a 360° view of the Garhwal Himalayan giants.",
    highlights: ["Summit at 12,500 ft", "Snow camping", "Winter photography", "Bonfire nights"],
    included: ["All meals on trek", "Camping & safety gear", "Experienced trek leader", "Forest permits"],
    excluded: ["Personal trekking gear", "Insurance", "Tips & gratuities"],
    rating: 4.7,
  },
  {
    title: "Rishikesh Adventure Camp",
    location: "Rishikesh",
    duration: 3,
    price: 7499,
    category: "Adventure Camp",
    difficulty: "Moderate",
    bestSeason: "All year",
    isFeatured: true,
    images: [u("photo-1504280390367-361c6d9f38f4")],
    description:
      "White-water rafting, cliff jumping, kayaking and riverside camping by the Ganges — an adventure weekend in the yoga capital.",
    highlights: ["16 km river rafting", "Cliff jump & kayaking", "Riverside camping", "Ganga aarti"],
    included: ["Camp stay (2 nights)", "All adventure activities", "Meals at camp", "Rafting safety gear"],
    excluded: ["Transport to Rishikesh", "Insurance", "Personal expenses"],
    rating: 4.6,
  },
  {
    title: "Coorg One Day Picnic",
    location: "Coorg, Karnataka",
    duration: 1,
    price: 1999,
    category: "One Day Picnic",
    difficulty: "Easy",
    bestSeason: "September – May",
    isFeatured: true,
    images: [u("photo-1500382017468-9049fed747ef")],
    description:
      "A day among misty coffee estates, waterfalls and spice gardens — with a traditional Kodava lunch.",
    highlights: ["Coffee estate walk", "Abbey Falls", "Spice plantation tour", "Kodava cuisine lunch"],
    included: ["Transfers from Mysuru", "Lunch", "Local guide", "Entry tickets"],
    excluded: ["Personal expenses", "Insurance"],
    rating: 4.5,
  },
];
for (const pkg of NEW_PACKAGES) {
  const exists = await Package.findOne({ title: pkg.title });
  if (exists) {
    await Package.updateOne({ title: pkg.title }, pkg);
    console.log(`existing -> updated ${pkg.title}`);
  } else {
    await Package.create({ ...pkg, createdBy: ADMIN, description: pkg.description });
    console.log(`created ${pkg.title}`);
  }
}

// ---- 4. Events: banners ----
await Event.updateOne(
  { title: "Old Trek" },
  { banner: u("photo-1464822759023-fed622ff2c3b") },
);
const kedar = await Event.findOne({ title: "Kedarkantha Winter Trek" });
if (kedar && !kedar.banner) {
  kedar.banner = u("photo-1506905925346-21bda4d32df4");
  await kedar.save();
}
console.log("event banners set");

// ---- 5. Products: images + a couple more ----
const prodImgs = [
  { name: "Trekking Backpack", image: u("photo-1622260614153-03223fb72052", 900) },
  { name: "Rain Jacket", image: u("photo-1521334884684-d80222895322", 900) },
];
for (const p of prodImgs) await Product.updateOne({ name: p.name }, p);
const NEW_PRODUCTS = [
  { name: "Camping Tent (2P)", category: "Camping", buyPrice: 5499, rentPrice: 350, stock: 12, image: u("photo-1504280390367-361c6d9f38f4", 900), description: "Lightweight 2-person dome tent, waterproof 3000mm, packs to 2.4 kg." },
  { name: "Insulated Water Bottle", category: "Accessories", buyPrice: 999, rentPrice: 0, stock: 30, image: u("photo-1602143407151-7111542de6e8", 900), description: "1L stainless steel bottle, keeps drinks cold 24h / hot 12h." },
  { name: "Trail Running Shoes", category: "Clothing", buyPrice: 4499, rentPrice: 250, stock: 8, image: u("photo-1542291026-7eec264c27ff", 900), description: "Grippy all-terrain trail shoes with cushioned midsole." },
];
for (const p of NEW_PRODUCTS) {
  const exists = await Product.findOne({ name: p.name });
  if (!exists) await Product.create(p);
}
console.log("products ready");

// ---- 6. Summary ----
const pkgs = await Package.find().select("title isFeatured images");
console.log("\nSUMMARY — packages:", pkgs.length, "| featured:", pkgs.filter((p) => p.isFeatured).length);
pkgs.filter((p) => p.isFeatured).forEach((p) => console.log("  featured:", p.title, "| imgs:", p.images.length));

await mongoose.disconnect();
