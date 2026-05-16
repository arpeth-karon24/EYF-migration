'use client';

import Image from 'next/image';

interface GuidelinesListProps {
  title?: string;
  subtitle?: string;
  items: Array<{
    label: string;
    description: string;
    image?: string;
  }>;
  numbered?: boolean;
  /** zigzag: alternating image/text rows; stacked: single-column cards (best for text-only lists) */
  layout?: 'zigzag' | 'stacked';
  backgroundColor?: 'light' | 'dark' | 'transparent';
  className?: string;
}

export default function GuidelinesList({
  title,
  subtitle,
  items,
  numbered = true,
  layout = 'zigzag',
  backgroundColor = 'dark',
  className = '',
}: GuidelinesListProps) {
  const bgClass =
    backgroundColor === 'light'
      ? 'bg-white'
      : backgroundColor === 'transparent'
        ? 'bg-transparent'
        : 'bg-eyf-page';
  const isLightish = backgroundColor === 'light';
  const headingColor = isLightish ? 'text-[#2c2c2c]' : 'text-white';
  const textColor = isLightish ? 'text-[#64686d]' : 'text-gray-400';
  const labelColor = isLightish ? 'text-[#111]' : 'text-white';
  const sectionBorder =
    backgroundColor === 'transparent'
      ? ''
      : backgroundColor === 'light'
        ? 'border-t border-neutral-100'
        : 'border-t border-white/10';

  return (
    <section className={`${bgClass} py-12 md:py-20 ${sectionBorder} ${className}`}>
      <div className="container mx-auto max-w-container px-4">
        {title && (
          <div className="mb-16 text-center">
            <h2 className={`mb-4 font-poppins text-3xl font-bold md:text-4xl ${headingColor}`}>{title}</h2>
            <div className="mx-auto h-1 w-20 bg-eyf-gold" />
          </div>
        )}
        {subtitle && (
          <p className={`mx-auto mb-16 max-w-2xl text-center font-opensans text-lg ${textColor}`}>{subtitle}</p>
        )}

        {layout === 'stacked' ? (
          <ol className="mx-auto max-w-3xl list-none space-y-4 p-0">
            {items.map((item, index) => (
              <li
                key={index}
                className={`rounded-xl border p-6 transition-colors md:p-7 ${
                  isLightish
                    ? 'border-neutral-200 bg-neutral-50 hover:border-neutral-300'
                    : 'border-white/10 bg-[#1c1c1c]/80 hover:border-white/20'
                }`}
              >
                <div className="flex gap-4 md:gap-5">
                  {numbered && (
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-montserrat text-sm font-bold ${
                        isLightish ? 'bg-eyf-gold/15 text-[#111]' : 'bg-eyf-gold/20 text-eyf-gold'
                      }`}
                      aria-hidden
                    >
                      {index + 1}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className={`mb-2 font-montserrat text-lg font-bold leading-snug md:text-xl ${labelColor}`}>
                      {item.label}
                    </h3>
                    <p className={`font-opensans text-[15px] leading-relaxed ${textColor}`}>{item.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="mx-auto max-w-6xl space-y-20">
            {items.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10 md:gap-20`}
                >
                  {item.image && (
                    <div
                      className={`group relative aspect-[4/3] w-full overflow-hidden rounded-2xl md:w-1/2 ${
                        isLightish
                          ? 'border border-neutral-200 bg-neutral-50 shadow-lg'
                          : 'shadow-2xl'
                      }`}
                    >
                      <Image
                        src={item.image}
                        alt={item.label}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    </div>
                  )}

                  <div className="w-full md:w-1/2">
                    <div className="mb-6 flex gap-4">
                      {numbered && (
                        <span className="font-montserrat text-4xl font-black text-eyf-gold opacity-20">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      )}
                      <div>
                        <h3
                          className={`mb-4 font-montserrat text-2xl font-bold uppercase tracking-tight ${labelColor}`}
                        >
                          {item.label}
                        </h3>
                        <div className="mb-6 h-1 w-12 bg-eyf-gold" />
                      </div>
                    </div>
                    <p className={`font-opensans text-[16px] leading-[1.8] ${textColor}`}>{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
