import { Oswald, Rajdhani, Roboto } from "next/font/google";
import { Inter } from "next/font/google";
import { Rubik } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});
const oswald = Oswald({ subsets: ["latin"], weight: ["400", "500"] });

export { rajdhani, rubik, inter, roboto, oswald };
