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
  showRoleOnHover?: boolean;
}

export default function TeamGrid({ 
  title, 
  members, 
  backgroundColor = 'dark',
  className = '',
  showRoleOnHover = true,
}: TeamGridProps) {
  const avatarShell =
    backgroundColor === "light"
      ? "border border-neutral-200 shadow-lg"
      : "border-4 border-white/5 shadow-2xl";

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
        <div className="flex flex-wrap justify-center gap-12 md:gap-20">
          {members.map((member) => (
            <div key={member.id} className="group relative">
              <div
                className={`relative h-48 w-48 cursor-pointer overflow-hidden rounded-full transition-all duration-500 group-hover:border-eyf-gold md:h-64 md:w-64 ${avatarShell}`}
              >
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2c2c2c] to-[#1c1c1c]">
                    <span className="text-5xl font-poppins font-black text-eyf-gold/30">
                      {member.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-6 text-center">
                  <h3 className="font-montserrat font-bold text-white text-lg uppercase tracking-wider">
                    {member.name}
                  </h3>
                  {showRoleOnHover && (
                    <>
                      <div className="w-10 h-0.5 bg-eyf-gold mx-auto my-3" />
                      <p className="text-eyf-gold text-[10px] font-poppins font-bold uppercase tracking-[0.2em]">
                        {member.role}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
