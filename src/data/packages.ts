import everest from "@/assets/dest-everest.jpg";
import ladakh from "@/assets/dest-ladakh.jpg";
import kerala from "@/assets/dest-kerala.jpg";
import camp from "@/assets/dest-camp.jpg";
import type { PackageLike } from "@/data/home";

export type ItineraryDay = { day: number; title: string; detail: string };

export type PackageDetail = PackageLike & {
  overview: string;
  highlights: string[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  gallery: string[];
  groupSize: string;
  bestSeason: string;
  days: number;
};

const gallery = [everest, ladakh, kerala, camp];

/** Demo catalogue used until the REST API returns data. */
export const ALL_PACKAGES: PackageDetail[] = [
  {
    _id: "p1",
    title: "Everest Base Camp Expedition",
    destination: "Nepal Himalaya",
    duration: "14 Days / 13 Nights",
    days: 14,
    price: 89999,
    oldPrice: 104999,
    rating: 4.9,
    reviews: 412,
    difficulty: "Challenging",
    image: everest,
    tag: "Bestseller",
    groupSize: "8–14 trekkers",
    bestSeason: "Mar–May, Sep–Nov",
    overview:
      "Walk the legendary trail to the foot of the world's highest peak. Sherpa villages, glacial moraines and sunrise over Kala Patthar make this the definitive Himalayan pilgrimage.",
    highlights: [
      "Sunrise panorama from Kala Patthar (5,545 m)",
      "Namche Bazaar acclimatisation days",
      "Tengboche Monastery visit",
      "Certified high-altitude guides & porters",
    ],
    itinerary: [
      { day: 1, title: "Arrive Kathmandu", detail: "Airport pickup, gear check and expedition briefing." },
      { day: 2, title: "Fly to Lukla, trek to Phakding", detail: "Scenic mountain flight followed by an easy valley walk." },
      { day: 3, title: "Namche Bazaar", detail: "Cross suspension bridges and climb into the Sherpa capital." },
      { day: 5, title: "Tengboche", detail: "Monastery visit with Ama Dablam towering ahead." },
      { day: 9, title: "Everest Base Camp", detail: "Step onto the Khumbu Glacier at 5,364 m." },
      { day: 14, title: "Depart Kathmandu", detail: "Farewell breakfast and airport transfer." },
    ],
    inclusions: ["All permits & TIMS card", "Teahouse accommodation", "Daily breakfast, lunch, dinner", "Guide, porter & insurance", "Kathmandu–Lukla flights"],
    exclusions: ["International airfare", "Personal trekking gear", "Travel insurance", "Tips & personal expenses"],
    gallery,
  },
  {
    _id: "p2",
    title: "Ladakh Pangong Overland",
    destination: "Ladakh, India",
    duration: "8 Days / 7 Nights",
    days: 8,
    price: 42999,
    oldPrice: 49999,
    rating: 4.8,
    reviews: 286,
    difficulty: "Moderate",
    image: ladakh,
    tag: "Trending",
    groupSize: "6–12 travellers",
    bestSeason: "May–Sep",
    overview:
      "A high-altitude road trip through Khardung La, Nubra's sand dunes and the surreal blue of Pangong Tso, with monastery stops and stargazing camps.",
    highlights: ["Khardung La pass crossing", "Nubra Valley camel safari", "Night at Pangong lakeside camp", "Thiksey & Hemis monasteries"],
    itinerary: [
      { day: 1, title: "Arrive Leh", detail: "Rest and acclimatise at 3,500 m." },
      { day: 3, title: "Nubra Valley", detail: "Drive over Khardung La to Hunder's dunes." },
      { day: 5, title: "Pangong Tso", detail: "Lakeside camping under the Milky Way." },
      { day: 8, title: "Departure", detail: "Transfer to Leh airport." },
    ],
    inclusions: ["Inner-line permits", "Hotels & camps", "Breakfast and dinner", "SUV with driver", "Oxygen support"],
    exclusions: ["Airfare to Leh", "Lunches", "Monastery camera fees"],
    gallery,
  },
  {
    _id: "p3",
    title: "Kerala Backwater Retreat",
    destination: "Alleppey, Kerala",
    duration: "5 Days / 4 Nights",
    days: 5,
    price: 24999,
    rating: 4.7,
    reviews: 198,
    difficulty: "Easy",
    image: kerala,
    tag: "Family",
    groupSize: "2–10 guests",
    bestSeason: "Oct–Mar",
    overview:
      "Slow travel through palm-fringed canals aboard a private houseboat, paired with Ayurveda spa sessions and a spice plantation walk in Munnar.",
    highlights: ["Private houseboat night", "Ayurvedic massage session", "Munnar tea estate tour", "Kathakali cultural evening"],
    itinerary: [
      { day: 1, title: "Arrive Kochi", detail: "Fort Kochi heritage walk and Chinese fishing nets." },
      { day: 2, title: "Munnar", detail: "Tea gardens and Eravikulam National Park." },
      { day: 4, title: "Houseboat", detail: "Cruise the Alleppey backwaters with onboard chef." },
      { day: 5, title: "Departure", detail: "Transfer to Kochi airport." },
    ],
    inclusions: ["Resort & houseboat stay", "All meals on houseboat", "AC vehicle", "Entry tickets"],
    exclusions: ["Flights", "Spa upgrades", "Personal shopping"],
    gallery,
  },
  {
    _id: "p4",
    title: "Alpine Stargazing Camp",
    destination: "Spiti Valley",
    duration: "4 Days / 3 Nights",
    days: 4,
    price: 18999,
    oldPrice: 21999,
    rating: 4.8,
    reviews: 154,
    difficulty: "Easy",
    image: camp,
    tag: "New",
    groupSize: "4–16 campers",
    bestSeason: "Jun–Sep",
    overview:
      "Three nights under one of the darkest skies in India — astrophotography workshops, bonfires and short ridge hikes above Langza.",
    highlights: ["Astrophotography workshop", "Key Monastery sunrise", "Fossil hunting at Langza", "Bonfire & local Spitian cuisine"],
    itinerary: [
      { day: 1, title: "Arrive Kaza", detail: "Camp setup and acclimatisation." },
      { day: 2, title: "Langza & Hikkim", detail: "World's highest post office and fossil village." },
      { day: 3, title: "Key & Kibber", detail: "Monastery visit and night sky session." },
      { day: 4, title: "Departure", detail: "Drive back to Manali." },
    ],
    inclusions: ["Alpine tents & sleeping bags", "All meals", "Telescope sessions", "Local transport"],
    exclusions: ["Travel to Kaza", "Personal gear", "Insurance"],
    gallery,
  },
  {
    _id: "p5",
    title: "Valley of Flowers Trek",
    destination: "Uttarakhand, India",
    duration: "6 Days / 5 Nights",
    days: 6,
    price: 21999,
    rating: 4.6,
    reviews: 132,
    difficulty: "Moderate",
    image: kerala,
    groupSize: "10–20 trekkers",
    bestSeason: "Jul–Aug",
    overview:
      "A UNESCO World Heritage bloom of over 500 alpine species, combined with a visit to the sacred Hemkund Sahib lake.",
    highlights: ["500+ alpine flower species", "Hemkund Sahib at 4,300 m", "Pushpawati river valley", "Small-group naturalist guide"],
    itinerary: [
      { day: 1, title: "Rishikesh to Joshimath", detail: "Scenic drive along the Alaknanda." },
      { day: 3, title: "Valley of Flowers", detail: "Full-day exploration of the bloom." },
      { day: 4, title: "Hemkund Sahib", detail: "Steep climb to the glacial lake." },
      { day: 6, title: "Return", detail: "Drive back to Rishikesh." },
    ],
    inclusions: ["Guesthouse stay", "All meals", "Forest permits", "Certified guide"],
    exclusions: ["Transport to Rishikesh", "Pony/porter charges"],
    gallery,
  },
  {
    _id: "p6",
    title: "Annapurna Circuit Classic",
    destination: "Nepal Himalaya",
    duration: "12 Days / 11 Nights",
    days: 12,
    price: 67999,
    oldPrice: 74999,
    rating: 4.9,
    reviews: 221,
    difficulty: "Challenging",
    image: everest,
    groupSize: "6–12 trekkers",
    bestSeason: "Mar–May, Oct–Nov",
    overview:
      "From subtropical valleys to the windswept Thorong La pass at 5,416 m — the most varied long-distance trek in the Himalaya.",
    highlights: ["Thorong La pass crossing", "Muktinath temple", "Manang acclimatisation", "Natural hot springs at Tatopani"],
    itinerary: [
      { day: 1, title: "Kathmandu to Besisahar", detail: "Drive to the trailhead." },
      { day: 6, title: "Manang", detail: "Rest day with side hike to Ice Lake." },
      { day: 9, title: "Thorong La", detail: "Pre-dawn ascent of the 5,416 m pass." },
      { day: 12, title: "Pokhara", detail: "Lakeside celebration dinner." },
    ],
    inclusions: ["ACAP permit & TIMS", "Teahouse lodging", "Three meals daily", "Guide & porter"],
    exclusions: ["International flights", "Hot showers & wifi", "Tips"],
    gallery,
  },
  {
    _id: "p7",
    title: "Rajasthan Desert Safari",
    destination: "Jaisalmer, Rajasthan",
    duration: "5 Days / 4 Nights",
    days: 5,
    price: 27999,
    rating: 4.5,
    reviews: 176,
    difficulty: "Easy",
    image: ladakh,
    tag: "Family",
    groupSize: "2–14 guests",
    bestSeason: "Nov–Feb",
    overview:
      "Golden forts, camel caravans over the Sam dunes and a luxury desert camp with folk music under the stars.",
    highlights: ["Jaisalmer Fort heritage walk", "Camel safari at sunset", "Luxury Swiss tents", "Rajasthani folk performance"],
    itinerary: [
      { day: 1, title: "Arrive Jodhpur", detail: "Mehrangarh Fort and blue-city lanes." },
      { day: 3, title: "Jaisalmer", detail: "Havelis, Gadisar lake and the living fort." },
      { day: 4, title: "Sam Dunes", detail: "Camel safari and desert camp night." },
      { day: 5, title: "Departure", detail: "Transfer to Jaisalmer airport." },
    ],
    inclusions: ["Heritage hotels & desert camp", "Breakfast and dinner", "AC vehicle", "Camel safari"],
    exclusions: ["Flights", "Lunches", "Monument cameras"],
    gallery,
  },
  {
    _id: "p8",
    title: "Meghalaya Living Roots Trail",
    destination: "Meghalaya, India",
    duration: "7 Days / 6 Nights",
    days: 7,
    price: 33999,
    rating: 4.7,
    reviews: 143,
    difficulty: "Moderate",
    image: camp,
    tag: "Trending",
    groupSize: "6–12 travellers",
    bestSeason: "Oct–Apr",
    overview:
      "Double-decker root bridges, turquoise rock pools and Asia's cleanest village — a monsoon-country adventure through the Khasi hills.",
    highlights: ["Nongriat double-decker root bridge", "Krang Suri waterfalls", "Mawlynnong village stay", "Dawki river boating"],
    itinerary: [
      { day: 1, title: "Arrive Shillong", detail: "Café hopping and Ward's Lake." },
      { day: 3, title: "Nongriat", detail: "3,500 steps down to the root bridges." },
      { day: 5, title: "Dawki & Mawlynnong", detail: "Crystal-clear Umngot river." },
      { day: 7, title: "Departure", detail: "Transfer to Guwahati." },
    ],
    inclusions: ["Homestays & hotels", "Breakfast", "Private vehicle", "Local guide"],
    exclusions: ["Airfare", "Most meals", "Activity tickets"],
    gallery,
  },
];

export const DESTINATION_OPTIONS = Array.from(new Set(ALL_PACKAGES.map((p) => p.destination)));
export const DIFFICULTY_OPTIONS = ["Easy", "Moderate", "Challenging"] as const;
export const MAX_PRICE = 100000;
