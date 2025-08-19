#!/bin/bash

echo "🎵 Starting database population via API..."

# Start development server in background if not running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "Starting development server..."
    npm run dev &
    SERVER_PID=$!
    echo "Waiting for server to start..."
    sleep 10
else 
    echo "Development server already running"
fi

# Music tracks data
echo "📀 Inserting music tracks..."
curl -X POST http://localhost:3000/api/admin/music \
  -H "Content-Type: application/json" \
  -d '[
    {
      "title": "Midnight Waves",
      "artist": "Lydskog",
      "genre": "ambient",
      "price": 299,
      "audio_url": "/audio/ambient-sample.mp3",
      "description": "En rolig ambient-komposisjon som tar deg med på en reise gjennom stille nattlige landskap. Perfect for meditasjon og avslapning.",
      "duration": "4:32",
      "bpm": 70,
      "key": "Dm",
      "tags": ["ambient", "meditation", "calm", "atmospheric"],
      "is_new": true,
      "is_uploaded": true,
      "status": "available"
    },
    {
      "title": "Urban Dreams",
      "artist": "Lydskog",
      "genre": "hip-hop",
      "price": 399,
      "audio_url": "/audio/hiphop-sample.mp3",
      "description": "Moderne hip-hop beat med kraftige drums og atmosfæriske synth-lag. Klar for vokal eller instrumentalt bruk.",
      "duration": "3:45",
      "bpm": 85,
      "key": "Gm",
      "tags": ["hip-hop", "urban", "beats", "modern"],
      "is_new": true,
      "is_uploaded": true,
      "status": "available"
    },
    {
      "title": "Coffee Shop Vibes",
      "artist": "Lydskog",
      "genre": "lo-fi",
      "price": 249,
      "audio_url": "/audio/lofi-sample.mp3",
      "description": "Chill lo-fi track med varme vinyl-lyder og myke melodier. Perfect som bakgrunnsmusikk for arbeid eller avslapping.",
      "duration": "3:12",
      "bpm": 65,
      "key": "C",
      "tags": ["lo-fi", "chill", "study", "vinyl"],
      "is_new": false,
      "is_uploaded": true,
      "status": "available"
    },
    {
      "title": "Forest Echoes",
      "artist": "Lydskog",
      "genre": "soundscape",
      "price": 349,
      "audio_url": "/audio/soundscape-sample.mp3",
      "description": "Naturlig lydlandskap med skoglyder, fuglekvitter og myke ambient-teksturer. Ideal for lyddesign og film.",
      "duration": "5:18",
      "bpm": null,
      "key": null,
      "tags": ["soundscape", "nature", "forest", "ambient"],
      "is_new": false,
      "is_uploaded": true,
      "status": "available"
    },
    {
      "title": "Neon Nights",
      "artist": "Lydskog",
      "genre": "ambient",
      "price": 329,
      "audio_url": "/audio/ambient-sample2.mp3",
      "description": "Synthwave-inspirert ambient med retrowave-elementer og atmospheriske pad-lyder.",
      "duration": "4:05",
      "bpm": 75,
      "key": "Am",
      "tags": ["ambient", "synthwave", "retro", "atmospheric"],
      "is_new": false,
      "is_uploaded": true,
      "status": "available"
    },
    {
      "title": "Street Flow",
      "artist": "Lydskog",
      "genre": "hip-hop",
      "price": 449,
      "audio_url": "/audio/hiphop-sample2.mp3",
      "description": "Groovy hip-hop instrumentals med funky basslinjer og crisp drums. Ready for rap vocals.",
      "duration": "3:28",
      "bpm": 90,
      "key": "Em",
      "tags": ["hip-hop", "funky", "groovy", "rap"],
      "is_new": true,
      "is_uploaded": true,
      "status": "available"
    }
  ]'

echo ""
echo "🎨 Inserting artwork items..."
curl -X POST http://localhost:3000/api/admin/artwork \
  -H "Content-Type: application/json" \
  -d '[
    {
      "title": "Abstract Dreams Album Cover",
      "category": "gallery",
      "price": 599,
      "image_url": "https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&h=800&fit=crop",
      "description": "Moderne abstrakt albumcover med flytende former og vibrant fargepalet. Perfect for elektronisk musikk.",
      "tags": ["abstract", "album-cover", "electronic", "colorful"],
      "is_new": true,
      "status": "available"
    },
    {
      "title": "Minimalist Logo Design",
      "category": "gallery",
      "price": 799,
      "image_url": "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=800&fit=crop",
      "description": "Clean og moderne logo-design med minimalistisk tilnærming. Skalerbart for alle plattformer.",
      "tags": ["logo", "minimalist", "modern", "branding"],
      "is_new": true,
      "status": "available"
    },
    {
      "title": "Vintage Poster Art",
      "category": "gallery",
      "price": 449,
      "image_url": "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=800&fit=crop",
      "description": "Retro-inspirert poster med vintage typografi og teksturer. Perfect for konsert-promotering.",
      "tags": ["poster", "vintage", "retro", "concert"],
      "is_new": false,
      "status": "available"
    },
    {
      "title": "Digital Art Portrait",
      "category": "gallery",
      "price": 699,
      "image_url": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop",
      "description": "Digitalt kunstverk med moderne portrett-stil og kreativ fargebruk.",
      "tags": ["digital-art", "portrait", "modern", "creative"],
      "is_new": false,
      "status": "available"
    },
    {
      "title": "Nature Album Cover",
      "category": "gallery",
      "price": 549,
      "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
      "description": "Naturinspirert albumcover med landskap og organiske elementer. Perfect for ambient/acoustic musikk.",
      "tags": ["album-cover", "nature", "landscape", "ambient"],
      "is_new": false,
      "status": "available"
    },
    {
      "title": "Urban Street Art Design",
      "category": "gallery",
      "price": 629,
      "image_url": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop",
      "description": "Grafitti-inspirert design med urban street art estetikk og bold farger.",
      "tags": ["street-art", "urban", "graffiti", "bold"],
      "is_new": true,
      "status": "available"
    }
  ]'

echo ""
echo "✅ Database population completed!"
echo "🌐 Visit http://localhost:3000 to see the populated content"

# Kill the server if we started it
if [ ! -z "$SERVER_PID" ]; then
    echo "Stopping development server..."
    kill $SERVER_PID
fi