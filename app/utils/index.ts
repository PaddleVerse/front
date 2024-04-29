
import os from 'os';


export const getDate = (dateString: any): string  => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export type user = {
  id: number;
  googleId: string;
  fortytwoId: number;
  nickname: string;
  name: string;
  password: string;
  picture: string;
  banner_picture: string;
  status: string;
  level: number;
  createdAt: Date;
  twoFa: boolean;
  twoFaSecret: string;
};

export const getTime = (datetime: any): string  => {
    const dateObj = new Date(datetime);
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes}`;
}

export const getShortDate = (date: Date | null) => {
  if (!date) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};


// Find the IPv4 address
export const ipAdress = os.hostname();

