export default function formatPhoneNumber(phoneNumber) {
    if (phoneNumber) {
      phoneNumber = phoneNumber.toString();
      if (phoneNumber.length > 15) {
        return `${phoneNumber.substring(0, 10)}...`;
      }

      const localNumber = phoneNumber.replace(/^\+66/, '').replace(/\D/g, '');

      if (localNumber.length === 8) {
        return `0${localNumber.substring(0, 1)}-${localNumber.substring(1, 4)}-${localNumber.substring(4)}`;
      }
  
      if (localNumber.length === 9) {
        return `0${localNumber.substring(0, 2)}-${localNumber.substring(2, 5)}-${localNumber.substring(5)}`;
      }

      if (localNumber.length === 10) {
        return `${localNumber.substring(0, 3)}-${localNumber.substring(3, 6)}-${localNumber.substring(6)}`;
      }
    }
    return phoneNumber;
}