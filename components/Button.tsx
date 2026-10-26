import Link from "next/link";
import clsx from "clsx";

type Props = {
  // The link is now a simple string, like "/about" or "https://example.com"
  buttonLink: string; 
  buttonText: string | null;
  className?: string;
};

export default function Button({ buttonLink, buttonText, className }: Props) {
  return (
    <Link
      href={buttonLink}
      className={clsx(
        "rounded-xl bg-orange-600 px-5 py-4 text-center text-xl font-bold uppercase tracking-wide text-white transition-colors duration-150 hover:bg-orange-700 md:text-2xl",
        className,
      )}
    >
      {buttonText}
    </Link>
  );
}