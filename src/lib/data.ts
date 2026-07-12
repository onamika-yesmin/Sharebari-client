export type ItemCategory =
  | "tools-equipment"
  | "cameras-electronics"
  | "event-party"
  | "outdoor-sports"
  | "home-kitchen"
  | "books-learning";

export type RentalItem = {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: ItemCategory;
  dailyPrice: number;
  securityDeposit: number;
  location: string;
  condition: "like-new" | "excellent" | "good" | "fair";
  availability: "available" | "rented" | "unavailable";
  brand: string;
  model: string;
  minimumRentalDays: number;
  images: string[];
  rating: number;
  featured: boolean;
  owner: { name: string; location: string; phone: string; email: string };
};

export const categories: Array<{ id: ItemCategory; name: string; description: string }> = [
  { id: "tools-equipment", name: "Tools & Equipment", description: "Drills, ladders, cutters, and repair gear." },
  { id: "cameras-electronics", name: "Cameras & Electronics", description: "Cameras, lights, tripods, and audio kits." },
  { id: "event-party", name: "Event & Party Supplies", description: "Decor, sound, seating, and celebration essentials." },
  { id: "outdoor-sports", name: "Outdoor & Sports", description: "Camping, cycling, fishing, and fitness items." },
  { id: "home-kitchen", name: "Home & Kitchen", description: "Appliances, cleaners, cookware, and home tools." },
  { id: "books-learning", name: "Books & Learning", description: "Study kits, exam books, and creative learning sets." },
];

export const rentalItems: RentalItem[] = [
  {
    id: "bosch-drill-kit",
    title: "Bosch Drill Kit",
    shortDescription: "Cordless drill with bit set for quick home repairs.",
    fullDescription: "A reliable drill kit for mounting shelves, assembling furniture, and handling weekend repair work. Includes common bit sizes and a carrying case.",
    category: "tools-equipment",
    dailyPrice: 450,
    securityDeposit: 1500,
    location: "Khulna",
    condition: "excellent",
    availability: "available",
    brand: "Bosch",
    model: "GSR 120-LI",
    minimumRentalDays: 1,
    images: ["https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=900&q=80", "https://images.unsplash.com/photo-1609205807107-e8ec2120f9de?auto=format&fit=crop&w=900&q=80"],
    rating: 4.9,
    featured: true,
    owner: { name: "Nusrat Jahan", location: "Sonadanga, Khulna", phone: "+8801711000001", email: "nusrat@example.com" },
  },
  {
    id: "canon-eos-camera",
    title: "Canon EOS Camera",
    shortDescription: "Beginner-friendly DSLR body with portrait lens.",
    fullDescription: "Capture events, product shots, and family portraits with a clean DSLR setup. Comes with battery, charger, memory card, and camera bag.",
    category: "cameras-electronics",
    dailyPrice: 1200,
    securityDeposit: 6000,
    location: "Dhaka",
    condition: "like-new",
    availability: "available",
    brand: "Canon",
    model: "EOS 200D",
    minimumRentalDays: 1,
    images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&q=80", "https://images.unsplash.com/photo-1495121553079-4c61bcce1894?auto=format&fit=crop&w=900&q=80"],
    rating: 4.8,
    featured: true,
    owner: { name: "Rafi Ahmed", location: "Dhanmondi, Dhaka", phone: "+8801711000002", email: "rafi@example.com" },
  },
  {
    id: "party-speaker-set",
    title: "Party Speaker Set",
    shortDescription: "Bluetooth speaker pair for birthdays and small events.",
    fullDescription: "Two powered speakers with microphone support for small gatherings. Ideal for rooftop events, birthdays, and community programs.",
    category: "event-party",
    dailyPrice: 900,
    securityDeposit: 3000,
    location: "Chattogram",
    condition: "good",
    availability: "available",
    brand: "JBL",
    model: "PartyBox Kit",
    minimumRentalDays: 1,
    images: ["https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80", "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=900&q=80"],
    rating: 4.6,
    featured: true,
    owner: { name: "Mahin Chowdhury", location: "Agrabad, Chattogram", phone: "+8801711000003", email: "mahin@example.com" },
  },
  {
    id: "camping-tent-four-person",
    title: "Four Person Camping Tent",
    shortDescription: "Water-resistant tent for weekend outdoor trips.",
    fullDescription: "Compact tent with rain cover, pegs, and carry bag. Works well for winter trips, riverside camping, and scout activities.",
    category: "outdoor-sports",
    dailyPrice: 650,
    securityDeposit: 2500,
    location: "Sylhet",
    condition: "excellent",
    availability: "available",
    brand: "Quechua",
    model: "Arpenaz 4.1",
    minimumRentalDays: 2,
    images: ["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1532339142463-fd0a8979791a?auto=format&fit=crop&w=900&q=80", "https://images.unsplash.com/photo-1478827387698-1527781a4887?auto=format&fit=crop&w=900&q=80"],
    rating: 4.7,
    featured: false,
    owner: { name: "Sadia Karim", location: "Zindabazar, Sylhet", phone: "+8801711000004", email: "sadia@example.com" },
  },
  {
    id: "stand-mixer",
    title: "Kitchen Stand Mixer",
    shortDescription: "Heavy-duty mixer for baking and dessert prep.",
    fullDescription: "A dependable stand mixer for cake batter, dough, frosting, and festive cooking days. Includes bowl and standard attachments.",
    category: "home-kitchen",
    dailyPrice: 550,
    securityDeposit: 2200,
    location: "Rajshahi",
    condition: "excellent",
    availability: "rented",
    brand: "KitchenAid",
    model: "Classic",
    minimumRentalDays: 1,
    images: ["https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1607877742574-a435ffbb654d?auto=format&fit=crop&w=900&q=80", "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80"],
    rating: 4.5,
    featured: false,
    owner: { name: "Tanha Rahman", location: "Boalia, Rajshahi", phone: "+8801711000005", email: "tanha@example.com" },
  },
  {
    id: "ielts-book-set",
    title: "IELTS Study Book Set",
    shortDescription: "Cambridge practice books with speaking cue cards.",
    fullDescription: "A focused IELTS preparation bundle with reading, writing, listening practice books and speaking cue card notes.",
    category: "books-learning",
    dailyPrice: 120,
    securityDeposit: 600,
    location: "Khulna",
    condition: "good",
    availability: "available",
    brand: "Cambridge",
    model: "IELTS Bundle",
    minimumRentalDays: 7,
    images: ["https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80", "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80"],
    rating: 4.4,
    featured: false,
    owner: { name: "Imran Hasan", location: "Khalishpur, Khulna", phone: "+8801711000006", email: "imran@example.com" },
  },
  {
    id: "pressure-washer",
    title: "Portable Pressure Washer",
    shortDescription: "Compact washer for balconies, bikes, and patios.",
    fullDescription: "Portable pressure washer with hose and adjustable nozzle. Useful for cleaning bikes, tiles, small patios, and storefront areas.",
    category: "tools-equipment",
    dailyPrice: 500,
    securityDeposit: 2000,
    location: "Dhaka",
    condition: "fair",
    availability: "unavailable",
    brand: "Karcher",
    model: "K2 Compact",
    minimumRentalDays: 1,
    images: ["https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80", "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=900&q=80"],
    rating: 4.2,
    featured: false,
    owner: { name: "Arif Hossain", location: "Mirpur, Dhaka", phone: "+8801711000007", email: "arif@example.com" },
  },
  {
    id: "projector-hd",
    title: "HD Projector",
    shortDescription: "Bright projector for classes, movie nights, and meetings.",
    fullDescription: "HD projector with HDMI cable, remote, and carry case. Good for small classrooms, training sessions, and family movie nights.",
    category: "cameras-electronics",
    dailyPrice: 1000,
    securityDeposit: 5000,
    location: "Barishal",
    condition: "excellent",
    availability: "available",
    brand: "Epson",
    model: "EB-X41",
    minimumRentalDays: 1,
    images: ["https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80", "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80"],
    rating: 4.7,
    featured: true,
    owner: { name: "Maliha Islam", location: "Sadar Road, Barishal", phone: "+8801711000008", email: "maliha@example.com" },
  },
];

export function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(amount);
}

export function categoryName(id: ItemCategory) {
  return categories.find((category) => category.id === id)?.name ?? id;
}

export function getItem(id: string) {
  return rentalItems.find((item) => item.id === id);
}
