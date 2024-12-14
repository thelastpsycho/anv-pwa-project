export const sendWhatsAppMessage = (reservation: {
  venueName: string;
  date: string;
  time: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  specialRequests?: string;
}) => {
  const message = `*New Table Reservation*

📍 *${reservation.venueName}*
📅 Date: ${reservation.date}
🕒 Time: ${reservation.time}
👥 Guests: ${reservation.guests}

*Guest Details*
👤 Name: ${reservation.name}
📧 Email: ${reservation.email}
📱 Phone: ${reservation.phone}
${reservation.specialRequests ? `\n💬 Special Requests:\n${reservation.specialRequests}` : ""}

_This reservation was made through The Anvaya Mobile App_`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappNumber = "62811389938"; // The Anvaya's WhatsApp number
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const cleanNumber = whatsappNumber.replace(/\D/g, "");

  const whatsappUrl = isMobile
    ? `whatsapp://send?phone=${cleanNumber}&text=${encodedMessage}`
    : `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodedMessage}`;

  return new Promise((resolve, reject) => {
    try {
      const link = document.createElement("a");
      link.href = whatsappUrl;

      link.onerror = () => {
        reject(new Error("Failed to connect to WhatsApp"));
      };

      if (isMobile) {
        const timeout = setTimeout(() => {
          window.location.href = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodedMessage}`;
        }, 2000);

        window.addEventListener(
          "blur",
          () => {
            clearTimeout(timeout);
            resolve(true);
          },
          { once: true }
        );
      }

      link.click();
      resolve(true);
    } catch (error) {
      console.error("WhatsApp error:", error);
      reject(new Error("Failed to open WhatsApp"));
    }
  });
};
