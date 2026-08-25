import Image from 'next/image';

export default function OrganicDivider() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-36 w-full overflow-hidden bg-[#f4efe4] sm:h-44 md:h-56"
    >
      <div className="relative mx-auto h-full max-w-6xl">
        <Image
          src="/images/organic/01_forest.png"
          alt=""
          width={686}
          height={1217}
          className="absolute -bottom-14 -left-10 h-48 w-auto select-none opacity-90 sm:-left-4 sm:h-60 md:-bottom-20 md:h-80"
        />
        <Image
          src="/images/organic/03_bush.png"
          alt=""
          width={850}
          height={612}
          className="absolute -bottom-8 left-1/2 h-28 w-auto -translate-x-1/2 select-none opacity-80 sm:h-36 md:-bottom-12 md:h-48"
        />
        <Image
          src="/images/organic/02_forest.png"
          alt=""
          width={596}
          height={992}
          className="absolute -bottom-12 -right-8 h-48 w-auto select-none opacity-90 sm:right-0 sm:h-60 md:-bottom-16 md:h-80"
        />
      </div>
    </div>
  );
}
