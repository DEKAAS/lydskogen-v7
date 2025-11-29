import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { headers } from 'next/headers';

// Known bot user-agent patterns to filter out
const BOT_PATTERNS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
  /headless/i,
  /phantom/i,
  /selenium/i,
  /puppeteer/i,
  /lighthouse/i,
  /pagespeed/i,
  /googlebot/i,
  /bingbot/i,
  /yandex/i,
  /baidu/i,
  /duckduckbot/i,
  /slurp/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
  /whatsapp/i,
  /telegrambot/i,
  /discordbot/i,
  /applebot/i,
  /semrush/i,
  /ahrefs/i,
  /mj12bot/i,
  /dotbot/i,
  /petalbot/i,
  /bytespider/i,
  /gptbot/i,
  /claudebot/i,
  /anthropic/i,
  /vercel/i,
  /preview/i,
  /monitoring/i,
  /uptime/i,
  /pingdom/i,
  /statuspage/i,
];

// Known Vercel/cloud provider IP ranges (partial match)
const CLOUD_IP_PREFIXES = [
  '13.56.',    // AWS US West
  '13.57.',    // AWS US West
  '54.176.',   // AWS US West
  '54.193.',   // AWS US West
  '143.110.',  // DigitalOcean
  '147.182.',  // DigitalOcean
  '64.227.',   // DigitalOcean
  '167.99.',   // DigitalOcean
  '76.76.',    // Vercel
  '64.225.',   // DigitalOcean
];

function isBot(userAgent: string): boolean {
  if (!userAgent || userAgent === 'unknown') return true;
  return BOT_PATTERNS.some(pattern => pattern.test(userAgent));
}

function isCloudProvider(ip: string): boolean {
  if (!ip || ip === 'unknown') return false;
  return CLOUD_IP_PREFIXES.some(prefix => ip.startsWith(prefix));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { path, pageUrl, referrer, sessionId, deviceType } = body;
    
    const pagePath = path || pageUrl;
    
    const headersList = await headers();
    
    const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';
    const country = headersList.get('x-vercel-ip-country') || 'Unknown';
    const city = headersList.get('x-vercel-ip-city') || 'Unknown';
    
    // Filter out bots and cloud providers
    const isBotVisit = isBot(userAgent);
    const isCloudVisit = isCloudProvider(ip);
    
    // Determine device type if not provided
    let detectedDevice = deviceType;
    if (!detectedDevice && userAgent) {
      detectedDevice = /Mobi|Android/i.test(userAgent) ? 'mobile' : 'desktop';
    }

    const { error } = await supabaseAdmin
      .from('site_visits')
      .insert({
        page_path: pagePath,
        referrer,
        session_id: sessionId,
        ip_address: ip,
        user_agent: userAgent,
        country,
        city,
        device_type: detectedDevice,
        is_bot: isBotVisit || isCloudVisit // Mark as bot for filtering
      });

    if (error) {
      console.error('Error tracking visit:', error);
      return NextResponse.json({ error: 'Track failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Server error tracking:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
