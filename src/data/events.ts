import everest from "@/assets/dest-everest.jpg";
import ladakh from "@/assets/dest-ladakh.jpg";
import kerala from "@/assets/dest-kerala.jpg";
import camp from "@/assets/dest-camp.jpg";
import hero from "@/assets/hero-mountains.jpg";

export type EventCategory = "Trek" | "Photography" | "Festival" | "Workshop";

export type EventItem = {
  _id: string;
  title: string;
  description: string;
  date: string;
  dateISO: string;
  time: string;
  location: string;
  category: EventCategory;
  seats: number;
  totalSeats: number;
  price: number;
  image: string;
  host: string;
  difficulty?: string;
};

export const EVENT_CATEGORIES: EventCategory[] = ["Trek", "Photography", "Festival", "Workshop"];

export const EVENTS: EventItem[] = [
  {
    _id: "ev1",
    title: "Full Moon Ridge Trek",
    description:
      "An overnight ridge walk timed with the full moon — headlamps off, skyline lit silver, hot soup at the summit camp.",
    date: "12 Sep 2026",
    dateISO: "2026-09-12",
    time: "6:00 PM",
    location: "Kasol, Himachal",
    category: "Trek",
    seats: 12,
    totalSeats: 30,
    price: 4999,
    image: camp,
    host: "Nikhil Rawat",
    difficulty: "Moderate",
  },
  {
    _id: "ev2",
    title: "Monastery Photo Walk",
    description:
      "A guided dawn-to-dusk photo walk through Ladakh's oldest monasteries with a working travel photographer.",
    date: "28 Sep 2026",
    dateISO: "2026-09-28",
    time: "5:30 AM",
    location: "Leh, Ladakh",
    category: "Photography",
    seats: 8,
    totalSeats: 20,
    price: 3499,
    image: ladakh,
    host: "Tenzin Norbu",
  },
  {
    _id: "ev3",
    title: "Backwater Kayak Festival",
    description:
      "Three days of kayaking, houseboat stays and Kerala cuisine along the Alleppey canals.",
    date: "10 Oct 2026",
    dateISO: "2026-10-10",
    time: "8:00 AM",
    location: "Alleppey, Kerala",
    category: "Festival",
    seats: 22,
    totalSeats: 60,
    price: 2999,
    image: kerala,
    host: "Maria Joseph",
    difficulty: "Easy",
  },
  {
    _id: "ev4",
    title: "Astro Photography Bootcamp",
    description:
      "Learn star trails, Milky Way stacking and light painting at 4,200 m under the clearest skies in India.",
    date: "24 Oct 2026",
    dateISO: "2026-10-24",
    time: "7:00 PM",
    location: "Spiti Valley",
    category: "Workshop",
    seats: 6,
    totalSeats: 15,
    price: 7999,
    image: hero,
    host: "Aditi Sharma",
  },
  {
    _id: "ev5",
    title: "Everest Region Acclimatisation Camp",
    description:
      "A five-day high-altitude prep camp for anyone heading to base camp this season — fitness, drills, kit checks.",
    date: "05 Nov 2026",
    dateISO: "2026-11-05",
    time: "7:00 AM",
    location: "Namche Bazaar, Nepal",
    category: "Trek",
    seats: 4,
    totalSeats: 18,
    price: 15999,
    image: everest,
    host: "Pemba Sherpa",
    difficulty: "Challenging",
  },
  {
    _id: "ev6",
    title: "Wildlife Long Lens Workshop",
    description:
      "Field craft, hides and long-lens technique with a two-day permit inside the reserve buffer zone.",
    date: "19 Nov 2026",
    dateISO: "2026-11-19",
    time: "6:00 AM",
    location: "Corbett, Uttarakhand",
    category: "Workshop",
    seats: 10,
    totalSeats: 12,
    price: 6499,
    image: kerala,
    host: "Rohan Iyer",
  },
];

export type GalleryPhoto = {
  _id: string;
  src: string;
  caption: string;
  location: string;
  category: "Mountains" | "Culture" | "Water" | "Camps";
  photographer: string;
};

export const GALLERY_CATEGORIES = ["Mountains", "Culture", "Water", "Camps"] as const;

export const GALLERY: GalleryPhoto[] = [
  {
    _id: "g1",
    src: everest,
    caption: "First light on the Khumbu icefall",
    location: "Nepal Himalaya",
    category: "Mountains",
    photographer: "Pemba Sherpa",
  },
  {
    _id: "g2",
    src: ladakh,
    caption: "Prayer flags above Pangong",
    location: "Ladakh, India",
    category: "Culture",
    photographer: "Tenzin Norbu",
  },
  {
    _id: "g3",
    src: kerala,
    caption: "Morning drift through the backwaters",
    location: "Alleppey, Kerala",
    category: "Water",
    photographer: "Maria Joseph",
  },
  {
    _id: "g4",
    src: camp,
    caption: "Base camp under a moonlit ridge",
    location: "Spiti Valley",
    category: "Camps",
    photographer: "Aditi Sharma",
  },
  {
    _id: "g5",
    src: hero,
    caption: "The long walk in",
    location: "Himachal Pradesh",
    category: "Mountains",
    photographer: "Nikhil Rawat",
  },
  {
    _id: "g6",
    src: ladakh,
    caption: "High pass switchbacks",
    location: "Leh, Ladakh",
    category: "Mountains",
    photographer: "Rohan Iyer",
  },
  {
    _id: "g7",
    src: kerala,
    caption: "Kayak festival flotilla",
    location: "Alleppey, Kerala",
    category: "Water",
    photographer: "Maria Joseph",
  },
  {
    _id: "g8",
    src: camp,
    caption: "Tents pitched before the storm",
    location: "Kasol, Himachal",
    category: "Camps",
    photographer: "Nikhil Rawat",
  },
  {
    _id: "g9",
    src: everest,
    caption: "Summit day silhouettes",
    location: "Nepal Himalaya",
    category: "Mountains",
    photographer: "Pemba Sherpa",
  },
];
