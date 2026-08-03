import everest from "@/assets/dest-everest.jpg";
import ladakh from "@/assets/dest-ladakh.jpg";
import kerala from "@/assets/dest-kerala.jpg";
import camp from "@/assets/dest-camp.jpg";

export type PackageLike = {
  _id: string;
  title: string;
  destination: string;
  duration: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  difficulty: "Easy" | "Moderate" | "Challenging";
  image: string;
  tag?: string;
};

/** Fallback content shown until the REST API returns data. */
export const FALLBACK_PACKAGES: PackageLike[] = [
  {
    _id: "p1",
    title: "Everest Base Camp Expedition",
    destination: "Nepal Himalaya",
    duration: "14 Days / 13 Nights",
    price: 89999,
    oldPrice: 104999,
    rating: 4.9,
    reviews: 412,
    difficulty: "Challenging",
    image: everest,
    tag: "Bestseller",
  },
  {
    _id: "p2",
    title: "Ladakh Pangong Overland",
    destination: "Ladakh, India",
    duration: "8 Days / 7 Nights",
    price: 42999,
    oldPrice: 49999,
    rating: 4.8,
    reviews: 286,
    difficulty: "Moderate",
    image: ladakh,
    tag: "Trending",
  },
  {
    _id: "p3",
    title: "Kerala Backwater Retreat",
    destination: "Alleppey, Kerala",
    duration: "5 Days / 4 Nights",
    price: 24999,
    rating: 4.7,
    reviews: 198,
    difficulty: "Easy",
    image: kerala,
    tag: "Family",
  },
  {
    _id: "p4",
    title: "Alpine Stargazing Camp",
    destination: "Spiti Valley",
    duration: "4 Days / 3 Nights",
    price: 18999,
    oldPrice: 21999,
    rating: 4.8,
    reviews: 154,
    difficulty: "Easy",
    image: camp,
    tag: "New",
  },
];

export const DESTINATIONS = [
  { name: "Nepal Himalaya", trips: 24, image: everest },
  { name: "Ladakh", trips: 18, image: ladakh },
  { name: "Kerala", trips: 12, image: kerala },
  { name: "Spiti Valley", trips: 15, image: camp },
];

export type EventLike = {
  _id: string;
  title: string;
  date: string;
  location: string;
  seats: number;
  price: number;
  image: string;
};

export const FALLBACK_EVENTS: EventLike[] = [
  {
    _id: "e1",
    title: "Full Moon Ridge Trek",
    date: "12 Sep 2026",
    location: "Kasol, Himachal",
    seats: 12,
    price: 4999,
    image: camp,
  },
  {
    _id: "e2",
    title: "Monastery Photo Walk",
    date: "28 Sep 2026",
    location: "Leh, Ladakh",
    seats: 20,
    price: 3499,
    image: ladakh,
  },
  {
    _id: "e3",
    title: "Backwater Kayak Festival",
    date: "10 Oct 2026",
    location: "Alleppey, Kerala",
    seats: 30,
    price: 2999,
    image: kerala,
  },
];

export const TESTIMONIALS = [
  {
    name: "Ananya Menon",
    trip: "Everest Base Camp",
    rating: 5,
    text: "The guides were phenomenal and every logistic was handled. Easily the best organised trek I've done.",
  },
  {
    name: "Rahul Verma",
    trip: "Ladakh Overland",
    rating: 5,
    text: "Renting gear from TrekVista saved me a fortune. Quality kit, delivered on time, zero fuss.",
  },
  {
    name: "Sara Fernandes",
    trip: "Kerala Retreat",
    rating: 4,
    text: "Booking took two minutes and the itinerary was exactly as promised. We'll be back next winter.",
  },
  {
    name: "Dev Patil",
    trip: "Spiti Stargazing",
    rating: 5,
    text: "Small groups, great food and unforgettable night skies. The team genuinely cares about safety.",
  },
];

export const GALLERY_PREVIEW = [everest, ladakh, kerala, camp];
