import { Metadata } from 'next';
import GenreGrid from '../../components/GenreGrid';
import Container from '../../components/Container';

export const metadata: Metadata = {
  title: 'Musikk Produksjon - Lydskogen',
  description: 'Utforsk våre fire hovedgenrer: Ambient, Hip-Hop, Lo-Fi og Soundscape. Hver sjanger har sin unike stemning og karakter.',
};

export default function ProduksjonPage() {
  return (
    <main className="min-h-screen">
      <Container>
        <div className="pt-24 pb-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Musikk <span className="text-accent-green">Produksjon</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Utforsk våre fire hovedgenrer, hver med sin unike stemning og karakter. 
              Velg den sjangeren som passer best til ditt prosjekt.
            </p>
          </div>

          {/* Genre Grid */}
          <GenreGrid />
        </div>
      </Container>
    </main>
  );
} 