'use client';

import Link from 'next/link';

interface CTASectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  buttonText: string;
  buttonLink: string;
  buttonExternal?: boolean;
  backgroundColor?: 'dark' | 'accent';
}

export default function CTASection({
  title,
  subtitle,
  description,
  buttonText,
  buttonLink,
  buttonExternal = false,
  backgroundColor = 'dark',
}: CTASectionProps) {
  const bgClass = backgroundColor === 'accent' ? 'bg-eyf-accentBlue' : 'bg-eyf-page';

  return (
    <section className={`${bgClass} py-16 md:py-24`}>
      <div className="container max-w-container mx-auto px-4 text-center">
        {subtitle && (
          <p className="text-eyf-gold text-sm md:text-base mb-4 font-poppins font-semibold uppercase tracking-wide">
            {subtitle}
          </p>
        )}

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-poppins font-bold text-white mb-4">
          {title}
        </h2>

        {description && (
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto font-opensans">
            {description}
          </p>
        )}

        <div className="flex justify-center">
          {buttonExternal ? (
            <a
              href={buttonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-white text-eyf-page font-montserrat font-semibold rounded-full hover:bg-gray-100 transition-colors duration-300"
            >
              {buttonText}
            </a>
          ) : (
            <Link
              href={buttonLink}
              className="px-8 py-3 bg-white text-eyf-page font-montserrat font-semibold rounded-full hover:bg-gray-100 transition-colors duration-300"
            >
              {buttonText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
