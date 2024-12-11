interface WellnessService {
  id: number;
  title: string;
  description: string;
  image: string;
  operatingHours: string;
  additionalInfo?: string[];
  hasBooking: boolean;
  logo?: string;
}

export const wellnessServices: WellnessService[] = [
  {
    id: 1,
    title: "Sakanti Spa",
    description:
      "Sakanti Spa offers an oasis of serenity on the Island of the Gods – the ultimate barefoot sanctuary for Spa and Beauty rituals on this mystical island.",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/02/Sakanti_Spa_Bed_21050x700.jpg",
    operatingHours: "9 a.m. to 9 p.m.",
    additionalInfo: [
      "Sakanti is an ancient sanskrit word meaning 'the beautiful sheen of a woman's child'",
    ],
    hasBooking: true,
    logo: "SakantiLogo",
  },
  {
    id: 2,
    title: "Fitness Center",
    description:
      "Stay fit during your vacation at our state-of-the-art fitness center, featuring modern equipment and stunning ocean views.",
    image:
      "https://plus.unsplash.com/premium_photo-1670505060574-b08479270d1b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    operatingHours: "6 a.m. to 10 p.m.",
    hasBooking: false,
  },
  {
    id: 3,
    title: "Yoga Class",
    description:
      "Find your inner peace with our daily yoga sessions led by experienced instructors. Perfect for beginners and advanced practitioners alike.",
    image:
      "https://images.unsplash.com/photo-1593810451137-5dc55105dace?q=80&w=2070&auto=format&fit=crop",
    operatingHours: "Daily at 7 a.m. and 4 p.m.",
    additionalInfo: ["Advance booking required"],
    hasBooking: true,
  },
];
