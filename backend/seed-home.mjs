import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import Event from "./models/Event.js";
import Gallery from "./models/Gallery.js";

await mongoose.connect(process.env.MONGO_URI);

const ADMIN = "6a70651b08d2a8c19f0dcd1d";
const u = (id, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const NEW_EVENTS = [
  {
    title: "Chadar Trek Frozen River Expedition",
    description:
      "Walk on the frozen Zanskar river in Ladakh — a once-in-a-lifetime winter expedition under crystal-clear skies.",
    eventType: "Upcoming",
    date: new Date("2026-12-20"),
    location: "Ladakh",
    price: 12999,
    banner: u("photo-1519681393784-d120267933ba"),
    availableSeats: 24,
  },
  {
    title: "Hampta Pass Valley Crossing",
    description:
      "Cross from the lush Kullu valley to the barren Lahaul desert — green to grey in a single summit push.",
    eventType: "Upcoming",
    date: new Date("2026-09-15"),
    location: "Himachal Pradesh",
    price: 9499,
    banner: u("photo-1506905925346-21bda4d32df4"),
    availableSeats: 18,
  },
  {
    title: "Monsoon Waterfall Trail Day Hike",
    description:
      "A misty day hike through roaring waterfalls and emerald ghats around Lonavala.",
    eventType: "Upcoming",
    date: new Date("2026-08-23"),
    location: "Lonavala",
    price: 1299,
    banner: u("photo-1432405972618-c60b0225b8f9"),
    availableSeats: 30,
  },
  {
    title: "Night Sky Camping at Tadiandamol",
    description:
      "Camp under a thousand stars on the highest peak of Coorg, with a stargazing session and bonfire.",
    eventType: "Special",
    date: new Date("2026-11-07"),
    location: "Coorg, Karnataka",
    price: 2499,
    banner: u("photo-1527004013197-933c4bb611b3"),
    availableSeats: 20,
  },
];
for (const ev of NEW_EVENTS) {
  const exists = await Event.findOne({ title: ev.title });
  if (exists) await Event.updateOne({ title: ev.title }, ev);
  else await Event.create(ev);
  console.log("event ok:", ev.title);
}

const NEW_PHOTOS = [
  { title: "Campfire stories at basecamp", category: "Camping", image: u("photo-1475483768296-6163e08872a1") },
  { title: "Sunbeams on the forest trail", category: "Trekking", image: u("photo-1441974231531-c6227db76b6e") },
  { title: "Rainbow splash at the falls", category: "Adventure", image: u("photo-1508672019048-805c876b67e2") },
  { title: "Dune sunset over the valley", category: "Destinations", image: u("photo-1473580044384-7ba9967e16a0") },
  { title: "Summit ridge line", category: "Trekking", image: u("photo-1464822759023-fed622ff2c3b") },
  { title: "Tent city by the lake", category: "Camping", image: u("photo-1501785888041-af3ef285b470") },
  { title: "Goa beach family walk", category: "Destinations", image: u("photo-1507525428034-b723cf961d3e") },
  { title: "Backwater houseboat cruise", category: "Destinations", image: u("photo-1476514525535-07fb3b4ae5f1") },
  { title: "Our hiking crew on day three", category: "Trekking", image: u("photo-1551632811-561732d1e306") },
  { title: "Evening light over the plantation", category: "Events", image: u("photo-1500382017468-9049fed747ef") },
];
for (const ph of NEW_PHOTOS) {
  const exists = await Gallery.findOne({ title: ph.title });
  if (!exists) await Gallery.create({ ...ph, uploadedBy: ADMIN });
}
const total = await Gallery.countDocuments();
console.log("gallery photos total:", total);
console.log("events total:", await Event.countDocuments());

await mongoose.disconnect();
