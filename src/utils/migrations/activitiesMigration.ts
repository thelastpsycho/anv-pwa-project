import { db } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";

const activitiesData = {
  monday: [
    { 
      title: 'Beginner Yoga',
      time: '7:00 AM',
      duration: 60,
      location: 'Yoga Studio',
      image: '/activities/yoga.jpg',
      dayOfWeek: 'monday',
      description: 'Start your day with a relaxing yoga session suitable for all levels'
    },
    {
      title: 'Bag Making Class',
      time: '9:00 AM',
      duration: 90,
      location: 'Activity Center',
      image: '/activities/craft.jpg',
      dayOfWeek: 'monday',
      description: 'Learn to create your own eco-friendly bag'
    },
    {
      title: 'Water Basketball',
      time: '11:00 AM',
      duration: 60,
      location: 'Main Pool',
      image: '/activities/pool.jpg',
      dayOfWeek: 'monday',
      description: 'Fun pool game suitable for all ages'
    },
    {
      title: 'Body Weight Training',
      time: '3:00 PM',
      duration: 45,
      location: 'Fitness Center',
      image: '/activities/fitness.jpg',
      dayOfWeek: 'monday',
      description: 'Effective workout using your own body weight'
    },
    {
      title: 'Beach Volleyball',
      time: '4:00 PM',
      duration: 60,
      location: 'Beach Area',
      image: '/activities/beach.jpg',
      dayOfWeek: 'monday',
      description: 'Enjoy a fun volleyball game by the beach'
    }
  ],
  tuesday: [
    {
      title: 'Cycling Tour',
      time: '7:00 AM',
      duration: 90,
      location: 'Hotel Entrance',
      image: '/activities/cycling.jpg',
      dayOfWeek: 'tuesday',
      description: 'Morning cycling tour around the area'
    },
    {
      title: 'Towel Art Class',
      time: '9:00 AM',
      duration: 60,
      location: 'Activity Center',
      image: '/activities/towel.jpg',
      dayOfWeek: 'tuesday',
      description: 'Learn to create beautiful towel animals'
    },
    {
      title: 'Water Aerobic',
      time: '11:00 AM',
      duration: 45,
      location: 'Main Pool',
      image: '/activities/aerobic.jpg',
      dayOfWeek: 'tuesday',
      description: 'Low-impact pool exercise for all fitness levels'
    },
    {
      title: 'Pilates',
      time: '3:00 PM',
      duration: 60,
      location: 'Yoga Studio',
      image: '/activities/pilates.jpg',
      dayOfWeek: 'tuesday',
      description: 'Core-strengthening and flexibility exercises'
    },
    {
      title: 'Frisbee Game',
      time: '4:00 PM',
      duration: 60,
      location: 'Beach Area',
      image: '/activities/frisbee.jpg',
      dayOfWeek: 'tuesday',
      description: 'Fun beach frisbee game for everyone'
    }
  ],
  wednesday: [
    {
      title: 'Stretching Class',
      time: '7:00 AM',
      duration: 45,
      location: 'Yoga Studio',
      image: '/activities/stretch.jpg',
      dayOfWeek: 'wednesday',
      description: 'Start your day with gentle stretching exercises'
    },
    {
      title: 'Hat Making Class',
      time: '9:00 AM',
      duration: 90,
      location: 'Activity Center',
      image: '/activities/hat.jpg',
      dayOfWeek: 'wednesday',
      description: 'Create your own stylish hat'
    },
    {
      title: 'Water Volleyball',
      time: '11:00 AM',
      duration: 60,
      location: 'Main Pool',
      image: '/activities/water-volley.jpg',
      dayOfWeek: 'wednesday',
      description: 'Fun volleyball game in the pool'
    },
    {
      title: 'Weight Training Class',
      time: '3:00 PM',
      duration: 45,
      location: 'Fitness Center',
      image: '/activities/weight.jpg',
      dayOfWeek: 'wednesday',
      description: 'Guided weight training session'
    },
    {
      title: 'Beach Volleyball',
      time: '4:00 PM',
      duration: 60,
      location: 'Beach Area',
      image: '/activities/beach.jpg',
      dayOfWeek: 'wednesday',
      description: 'Beach volleyball game for all skill levels'
    }
  ],
  thursday: [
    {
      title: 'Beginner Yoga',
      time: '7:00 AM',
      duration: 60,
      location: 'Yoga Studio',
      image: '/activities/yoga.jpg',
      dayOfWeek: 'thursday',
      description: 'Relaxing yoga session for beginners'
    },
    {
      title: 'Towel Art Class',
      time: '9:00 AM',
      duration: 60,
      location: 'Activity Center',
      image: '/activities/towel.jpg',
      dayOfWeek: 'thursday',
      description: 'Learn towel folding art'
    },
    {
      title: 'Water Aerobic',
      time: '11:00 AM',
      duration: 45,
      location: 'Main Pool',
      image: '/activities/aerobic.jpg',
      dayOfWeek: 'thursday',
      description: 'Pool aerobics session'
    },
    {
      title: 'Pilates',
      time: '3:00 PM',
      duration: 60,
      location: 'Yoga Studio',
      image: '/activities/pilates.jpg',
      dayOfWeek: 'thursday',
      description: 'Core strengthening pilates class'
    },
    {
      title: 'Fun Soccer',
      time: '4:00 PM',
      duration: 60,
      location: 'Beach Area',
      image: '/activities/soccer.jpg',
      dayOfWeek: 'thursday',
      description: 'Casual soccer game on the beach'
    }
  ],
  friday: [
    {
      title: 'Cycling Tour',
      time: '7:00 AM',
      duration: 90,
      location: 'Hotel Entrance',
      image: '/activities/cycling.jpg',
      dayOfWeek: 'friday',
      description: 'Guided cycling tour around the area'
    },
    {
      title: 'Bag Making Class',
      time: '9:00 AM',
      duration: 90,
      location: 'Activity Center',
      image: '/activities/craft.jpg',
      dayOfWeek: 'friday',
      description: 'Create your own eco-friendly bag'
    },
    {
      title: 'Water Basketball',
      time: '11:00 AM',
      duration: 60,
      location: 'Main Pool',
      image: '/activities/pool.jpg',
      dayOfWeek: 'friday',
      description: 'Basketball game in the pool'
    },
    {
      title: 'Body Weight Training',
      time: '3:00 PM',
      duration: 45,
      location: 'Fitness Center',
      image: '/activities/fitness.jpg',
      dayOfWeek: 'friday',
      description: 'No-equipment workout session'
    },
    {
      title: 'Beach Volleyball',
      time: '4:00 PM',
      duration: 60,
      location: 'Beach Area',
      image: '/activities/beach.jpg',
      dayOfWeek: 'friday',
      description: 'Volleyball game by the beach'
    }
  ],
  saturday: [
    {
      title: 'Stretching Class',
      time: '7:00 AM',
      duration: 45,
      location: 'Yoga Studio',
      image: '/activities/stretch.jpg',
      dayOfWeek: 'saturday',
      description: 'Morning stretching session'
    },
    {
      title: 'Towel Art Class',
      time: '9:00 AM',
      duration: 60,
      location: 'Activity Center',
      image: '/activities/towel.jpg',
      dayOfWeek: 'saturday',
      description: 'Learn decorative towel folding'
    },
    {
      title: 'Water Aerobic',
      time: '11:00 AM',
      duration: 45,
      location: 'Main Pool',
      image: '/activities/aerobic.jpg',
      dayOfWeek: 'saturday',
      description: 'Water-based fitness class'
    },
    {
      title: 'Pilates',
      time: '3:00 PM',
      duration: 60,
      location: 'Yoga Studio',
      image: '/activities/pilates.jpg',
      dayOfWeek: 'saturday',
      description: 'Core and flexibility training'
    },
    {
      title: 'Frisbee Game',
      time: '4:00 PM',
      duration: 60,
      location: 'Beach Area',
      image: '/activities/frisbee.jpg',
      dayOfWeek: 'saturday',
      description: 'Beach frisbee game'
    }
  ],
  sunday: [
    {
      title: 'Water Yoga',
      time: '7:00 AM',
      duration: 60,
      location: 'Main Pool',
      image: '/activities/water-yoga.jpg',
      dayOfWeek: 'sunday',
      description: 'Yoga practice in the pool'
    },
    {
      title: 'Hat Making Class',
      time: '9:00 AM',
      duration: 90,
      location: 'Activity Center',
      image: '/activities/hat.jpg',
      dayOfWeek: 'sunday',
      description: 'Create your own beach hat'
    },
    {
      title: 'Water Volleyball',
      time: '11:00 AM',
      duration: 60,
      location: 'Main Pool',
      image: '/activities/water-volley.jpg',
      dayOfWeek: 'sunday',
      description: 'Pool volleyball game'
    },
    {
      title: 'Weight Training Class',
      time: '3:00 PM',
      duration: 45,
      location: 'Fitness Center',
      image: '/activities/weight.jpg',
      dayOfWeek: 'sunday',
      description: 'Guided weight training'
    },
    {
      title: 'Fun Soccer',
      time: '4:00 PM',
      duration: 60,
      location: 'Beach Area',
      image: '/activities/soccer.jpg',
      dayOfWeek: 'sunday',
      description: 'Casual beach soccer game'
    }
  ]
};

export async function migrateActivities() {
  try {
    const activitiesRef = collection(db, "activities");
    
    // Flatten the activities data
    const flatActivities = Object.entries(activitiesData).flatMap(([day, activities]) =>
      activities.map(activity => ({
        ...activity,
        dayOfWeek: day,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );

    // Batch add all activities
    const promises = flatActivities.map(activity => addDoc(activitiesRef, activity));
    await Promise.all(promises);

    console.log("✅ Activities migration completed");
    return true;
  } catch (error) {
    console.error("❌ Activities migration failed:", error);
    throw error;
  }
} 