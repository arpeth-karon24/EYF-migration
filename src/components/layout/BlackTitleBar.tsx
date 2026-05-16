'use client';

type BlackTitleBarProps = {
  id?: string;
  children: React.ReactNode;
  className?: string;
};

export function BlackTitleBar({ id, children, className = "" }: BlackTitleBarProps) {
  return (
    <div
      id={id}
      className={`w-full scroll-mt-28 navlg:scroll-mt-40 bg-black py-4 text-center ${className}`}
    >
      <h2 className="text-xl font-poppins font-bold text-white tracking-widest md:text-2xl">
        {children}
      </h2>
    </div>
  );
}
