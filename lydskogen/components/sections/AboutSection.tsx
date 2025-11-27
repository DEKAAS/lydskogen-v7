'use client';

import React from 'react';
import Image from 'next/image';

export default function AboutSection() {
  return (
    <section
      className="py-16"
      id="om"
      style={{
        backgroundColor: '#050605'
      }}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1">
            <div className="relative w-full h-[400px] lg:h-[500px] rounded-lg overflow-hidden" style={{
              background: 'var(--section-bg-2)',
              border: '1px solid var(--border-color)'
            }}>
              {/* 
                For å legge til bilde:
                1. Legg bildet ditt i: /public/images/about.jpg
                2. Eller endre src under til ditt bilde-navn (f.eks. /images/ditt-bilde.jpg)
              */}
              <Image
                src="/about.jpg"
                alt="Om Lydskog"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{color: 'var(--text-color)'}}>
              Hvem er Lydskog
            </h2>
            <div className="text-lg space-y-4" style={{color: 'var(--text-color)', opacity: 0.9}}>
              <p>
                Lydskog er et kreativt studio som tilbyr profesjonelle lyd- og designtjenester for artister og skapere. 
                Med fokus på kvalitet og personlig tilnærming hjelper vi deg med å løfte dine prosjekter til et nytt nivå.
              </p>
              <p>
                Enten du trenger miksing av musikk, visuell identitet eller en komplett artistside, 
                er målet å skape en helhetlig og profesjonell opplevelse som reflekterer din unike stil og visjon.
              </p>
              <p>
                Bak Lydskog står en dedikert skaper med lidenskap for både lyd og visuelt design, 
                og med erfaring fra ulike kreative prosjekter.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

