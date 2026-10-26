import type { SodaCanProps } from "@/components/SodaCan";

export type Flavor = NonNullable<SodaCanProps["flavor"]>;

export interface HeroContent {
  heading: string;
  subheading: string;
  body: string;
  buttonText: string;
  buttonLink: string;
  /** Mobile-only image. Drop a file at this path in `public/` to enable it. */
  cansImage: string;
  secondHeading: string;
  secondBody: string;
}

export interface SkyDiveContent {
  flavor: Flavor;
  sentence: string;
}

export interface AlternatingTextItem {
  heading: string;
  body: string;
}

export interface AlternatingTextContent {
  textGroup: AlternatingTextItem[];
}

export interface CarouselContent {
  heading: string;
  priceCopy: string;
}
