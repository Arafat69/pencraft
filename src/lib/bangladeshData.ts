// Bangladesh Divisions and Districts Data
export const divisions = [
  { id: "dhaka", name: "ঢাকা", nameEn: "Dhaka" },
  { id: "chittagong", name: "চট্টগ্রাম", nameEn: "Chittagong" },
  { id: "rajshahi", name: "রাজশাহী", nameEn: "Rajshahi" },
  { id: "khulna", name: "খুলনা", nameEn: "Khulna" },
  { id: "barisal", name: "বরিশাল", nameEn: "Barisal" },
  { id: "sylhet", name: "সিলেট", nameEn: "Sylhet" },
  { id: "rangpur", name: "রংপুর", nameEn: "Rangpur" },
  { id: "mymensingh", name: "ময়মনসিংহ", nameEn: "Mymensingh" },
] as const;

export const districtsByDivision: Record<string, { id: string; name: string; nameEn: string }[]> = {
  dhaka: [
    { id: "dhaka", name: "ঢাকা", nameEn: "Dhaka" },
    { id: "faridpur", name: "ফরিদপুর", nameEn: "Faridpur" },
    { id: "gazipur", name: "গাজীপুর", nameEn: "Gazipur" },
    { id: "gopalganj", name: "গোপালগঞ্জ", nameEn: "Gopalganj" },
    { id: "kishoreganj", name: "কিশোরগঞ্জ", nameEn: "Kishoreganj" },
    { id: "madaripur", name: "মাদারীপুর", nameEn: "Madaripur" },
    { id: "manikganj", name: "মানিকগঞ্জ", nameEn: "Manikganj" },
    { id: "munshiganj", name: "মুন্সীগঞ্জ", nameEn: "Munshiganj" },
    { id: "narayanganj", name: "নারায়ণগঞ্জ", nameEn: "Narayanganj" },
    { id: "narsingdi", name: "নরসিংদী", nameEn: "Narsingdi" },
    { id: "rajbari", name: "রাজবাড়ী", nameEn: "Rajbari" },
    { id: "shariatpur", name: "শরীয়তপুর", nameEn: "Shariatpur" },
    { id: "tangail", name: "টাঙ্গাইল", nameEn: "Tangail" },
  ],
  chittagong: [
    { id: "chittagong", name: "চট্টগ্রাম", nameEn: "Chittagong" },
    { id: "bandarban", name: "বান্দরবান", nameEn: "Bandarban" },
    { id: "brahmanbaria", name: "ব্রাহ্মণবাড়িয়া", nameEn: "Brahmanbaria" },
    { id: "chandpur", name: "চাঁদপুর", nameEn: "Chandpur" },
    { id: "comilla", name: "কুমিল্লা", nameEn: "Comilla" },
    { id: "coxsbazar", name: "কক্সবাজার", nameEn: "Cox's Bazar" },
    { id: "feni", name: "ফেনী", nameEn: "Feni" },
    { id: "khagrachhari", name: "খাগড়াছড়ি", nameEn: "Khagrachhari" },
    { id: "lakshmipur", name: "লক্ষ্মীপুর", nameEn: "Lakshmipur" },
    { id: "noakhali", name: "নোয়াখালী", nameEn: "Noakhali" },
    { id: "rangamati", name: "রাঙ্গামাটি", nameEn: "Rangamati" },
  ],
  rajshahi: [
    { id: "rajshahi", name: "রাজশাহী", nameEn: "Rajshahi" },
    { id: "bogra", name: "বগুড়া", nameEn: "Bogra" },
    { id: "chapainawabganj", name: "চাঁপাইনবাবগঞ্জ", nameEn: "Chapainawabganj" },
    { id: "joypurhat", name: "জয়পুরহাট", nameEn: "Joypurhat" },
    { id: "naogaon", name: "নওগাঁ", nameEn: "Naogaon" },
    { id: "natore", name: "নাটোর", nameEn: "Natore" },
    { id: "nawabganj", name: "নবাবগঞ্জ", nameEn: "Nawabganj" },
    { id: "pabna", name: "পাবনা", nameEn: "Pabna" },
    { id: "sirajganj", name: "সিরাজগঞ্জ", nameEn: "Sirajganj" },
  ],
  khulna: [
    { id: "khulna", name: "খুলনা", nameEn: "Khulna" },
    { id: "bagerhat", name: "বাগেরহাট", nameEn: "Bagerhat" },
    { id: "chuadanga", name: "চুয়াডাঙ্গা", nameEn: "Chuadanga" },
    { id: "jessore", name: "যশোর", nameEn: "Jessore" },
    { id: "jhenaidah", name: "ঝিনাইদহ", nameEn: "Jhenaidah" },
    { id: "kushtia", name: "কুষ্টিয়া", nameEn: "Kushtia" },
    { id: "magura", name: "মাগুরা", nameEn: "Magura" },
    { id: "meherpur", name: "মেহেরপুর", nameEn: "Meherpur" },
    { id: "narail", name: "নড়াইল", nameEn: "Narail" },
    { id: "satkhira", name: "সাতক্ষীরা", nameEn: "Satkhira" },
  ],
  barisal: [
    { id: "barisal", name: "বরিশাল", nameEn: "Barisal" },
    { id: "barguna", name: "বরগুনা", nameEn: "Barguna" },
    { id: "bhola", name: "ভোলা", nameEn: "Bhola" },
    { id: "jhalokathi", name: "ঝালকাঠি", nameEn: "Jhalokathi" },
    { id: "patuakhali", name: "পটুয়াখালী", nameEn: "Patuakhali" },
    { id: "pirojpur", name: "পিরোজপুর", nameEn: "Pirojpur" },
  ],
  sylhet: [
    { id: "sylhet", name: "সিলেট", nameEn: "Sylhet" },
    { id: "habiganj", name: "হবিগঞ্জ", nameEn: "Habiganj" },
    { id: "moulvibazar", name: "মৌলভীবাজার", nameEn: "Moulvibazar" },
    { id: "sunamganj", name: "সুনামগঞ্জ", nameEn: "Sunamganj" },
  ],
  rangpur: [
    { id: "rangpur", name: "রংপুর", nameEn: "Rangpur" },
    { id: "dinajpur", name: "দিনাজপুর", nameEn: "Dinajpur" },
    { id: "gaibandha", name: "গাইবান্ধা", nameEn: "Gaibandha" },
    { id: "kurigram", name: "কুড়িগ্রাম", nameEn: "Kurigram" },
    { id: "lalmonirhat", name: "লালমনিরহাট", nameEn: "Lalmonirhat" },
    { id: "nilphamari", name: "নীলফামারী", nameEn: "Nilphamari" },
    { id: "panchagarh", name: "পঞ্চগড়", nameEn: "Panchagarh" },
    { id: "thakurgaon", name: "ঠাকুরগাঁও", nameEn: "Thakurgaon" },
  ],
  mymensingh: [
    { id: "mymensingh", name: "ময়মনসিংহ", nameEn: "Mymensingh" },
    { id: "jamalpur", name: "জামালপুর", nameEn: "Jamalpur" },
    { id: "netrokona", name: "নেত্রকোণা", nameEn: "Netrokona" },
    { id: "sherpur", name: "শেরপুর", nameEn: "Sherpur" },
  ],
};

// Payment method configurations
export const paymentMethods = [
  {
    id: "bkash",
    name: "বিকাশ",
    nameEn: "bKash",
    description: "বিকাশ মোবাইল পেমেন্ট",
    number: "01810496751",
    color: "#E2136E", // bKash pink
    bgClass: "bg-[#E2136E]",
    textClass: "text-[#E2136E]",
    borderClass: "border-[#E2136E]",
    bgLightClass: "bg-[#E2136E]/10",
  },
  {
    id: "nagad",
    name: "নগদ",
    nameEn: "Nagad",
    description: "নগদ মোবাইল ব্যাংকিং",
    number: "01810496751",
    color: "#F6921E", // Nagad orange/yellow
    bgClass: "bg-[#F6921E]",
    textClass: "text-[#F6921E]",
    borderClass: "border-[#F6921E]",
    bgLightClass: "bg-[#F6921E]/10",
  },
  {
    id: "rocket",
    name: "রকেট",
    nameEn: "Rocket",
    description: "ডাচ-বাংলা রকেট",
    number: "01810496751",
    color: "#8E24AA", // Rocket purple
    bgClass: "bg-[#8E24AA]",
    textClass: "text-[#8E24AA]",
    borderClass: "border-[#8E24AA]",
    bgLightClass: "bg-[#8E24AA]/10",
  },
] as const;

export type Division = typeof divisions[number];
export type District = { id: string; name: string; nameEn: string };
export type PaymentMethod = typeof paymentMethods[number];
