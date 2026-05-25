'use client';

import Image from 'next/image';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image?: string;
  bio?: string;
}

interface TeamGridProps {
  title?: string;
  members: TeamMember[];
  backgroundColor?: 'light' | 'dark';
  className?: string;
  /** When true, name/role only show on hover. When false (default for board),
   *  name+role are always visible below the photo. */
  showRoleOnHover?: boolean;
  /** Message to display when `members` is empty.
   *  Pass an empty string to hide the section entirely instead. */
  emptyStateMessage?: string;
}

/**
 * Responsive grid of team member portraits.
 *
 * Responsiveness:
 * - On small phones (<640px), 2 columns with smaller avatars (128px)
 * - On tablets (640-1024px), 3 columns with medium avatars (176px)
 * - On desktop (≥1024px), flex-centered layout with full-size avatars (224px)
 *
 * The name/role label is rendered BELOW the photo (always visible) by default,
 * not in a hover overlay. Reason — hover doesn't exist on touch devices, so
 * mobile users would never see the names. Hover overlay can still be enabled
 * via `showRoleOnHover={true}` for the legacy hover style.
 *
 * Empty state:
 * - When `members` is empty AND `emptyStateMessage` is set, renders a
 *   simple "coming soon" card instead of a barren section.
 * - When `members` is empty AND `emptyStateMessage` is empty string,
 *   renders nothing (use this to fully hide an unfinished section).
 */
export default function TeamGrid({
  title,
  members,
  backgroundColor = 'dark',
  className = '',
  showRoleOnHover = false,
  emptyStateMessage = 'Members coming soon.',
}: TeamGridProps) {
  // Fully hide the section if no members and the caller explicitly cleared the message
  if (members.length === 0 && emptyStateMessage === '') {
    return null;
  }

  const avatarShell =
    backgroundColor === 'light'
      ? 'border border-neutral-200 shadow-lg'
      : 'border-4 border-white/5 shadow-2xl';

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <div className="w-full bg-black py-4 mb-10 text-center">
          <h2 className="text-xl md:text-2xl font-poppins font-bold text-white tracking-widest">
            {title}
          </h2>
        </div>
      )}

      <div className="container max-w-container mx-auto px-4 pb-16">
        {members.length === 0 ? (
          /* ── Empty state — clean placeholder instead of dummy data ────── */
          <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-12 text-center backdrop-blur-md">
            <p className="font-poppins text-sm font-bold uppercase tracking-widest text-eyf-gold">
              {emptyStateMessage}
            </p>
            <p className="mt-3 font-opensans text-sm leading-relaxed text-white/60">
              Our advisory team is currently being formed. Check back soon
              for updates, or get in touch if you&apos;d like to contribute.
            </p>
          </div>
        ) : (
          /* ── Member grid — responsive: 2 cols mobile → 3 cols tablet → flex desktop ── */
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:gap-x-10 md:gap-y-14 lg:flex lg:flex-wrap lg:justify-center lg:gap-x-16 lg:gap-y-16">
            {members.map((member) => (
              <div key={member.id} className="group relative flex flex-col items-center">
                {/* Avatar — responsive sizes */}
                <div
                  className={`relative h-32 w-32 cursor-default overflow-hidden rounded-full transition-all duration-500 group-hover:border-eyf-gold sm:h-40 sm:w-40 md:h-44 md:w-44 lg:h-56 lg:w-56 ${avatarShell}`}
                >
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 128px, (max-width: 1024px) 176px, 224px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#2c2c2c] to-[#1c1c1c]">
                      <span className="font-poppins text-4xl font-black text-eyf-gold/30 md:text-5xl">
                        {member.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </span>
                    </div>
                  )}

                  {/* Hover overlay — only when explicitly enabled */}
                  {showRoleOnHover && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 p-4 text-center opacity-0 backdrop-blur-[2px] transition-all duration-500 group-hover:opacity-100">
                      <h3 className="font-montserrat text-base font-bold uppercase tracking-wider text-white md:text-lg">
                        {member.name}
                      </h3>
                      <div className="mx-auto my-2 h-0.5 w-8 bg-eyf-gold md:my-3 md:w-10" />
                      <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.2em] text-eyf-gold md:text-[10px]">
                        {member.role}
                      </p>
                    </div>
                  )}
                </div>

                {/* Always-visible name + role below the photo — works on touch devices too */}
                {!showRoleOnHover && (
                  <div className="mt-5 text-center">
                    <h3 className="font-montserrat text-sm font-bold uppercase tracking-wider text-white md:text-base">
                      {member.name}
                    </h3>
                    <div className="mx-auto my-2 h-0.5 w-8 bg-eyf-gold" />
                    <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.2em] text-eyf-gold md:text-[11px]">
                      {member.role}
                    </p>
                    {member.bio && (
                      <p className="mt-3 max-w-xs font-opensans text-xs leading-relaxed text-white/60">
                        {member.bio}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
