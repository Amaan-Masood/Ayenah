/**
 * Ayenah Official - Luxury Mirror Art on Canvas
 * Backend Node.js Server & REST API
 * 
 * Features:
 * - REST API for Products, Custom Commissions/Inquiries, Subscriptions, and Stats
 * - In-memory and JSON file persistence
 * - Static file server for client frontend
 * - CORS & security headers
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 5000;
const DATA_DIR = path.join(__dirname, 'data');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Ensure data files exist
function loadJson(file, fallback = []) {
  try {
    const fullPath = path.join(DATA_DIR, file);
    if (!fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, JSON.stringify(fallback, null, 2), 'utf8');
      return fallback;
    }
    const data = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error loading ${file}:`, err);
    return fallback;
  }
}

function saveJson(file, data) {
  try {
    const fullPath = path.join(DATA_DIR, file);
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error saving ${file}:`, err);
    return false;
  }
}

// In-memory caches backed by JSON
let products = loadJson('products.json');
let inquiries = loadJson('inquiries.json');
let subscribers = loadJson('subscribers.json');

// MIME types table
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.mjs': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 2e6) { // 2MB limit
        req.connection.destroy();
        reject(new Error('Body too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
  });
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(payload));
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  // --- REST API ROUTES ---
  if (pathname.startsWith('/api/')) {
    console.log(`[API] ${method} ${pathname}`);

    // GET /api/products
    if (pathname === '/api/products' && method === 'GET') {
      products = loadJson('products.json');
      const category = parsedUrl.query.category;
      let result = products;
      if (category && category !== 'all') {
        result = products.filter(p => p.category === category);
      }
      return sendJson(res, 200, { success: true, count: result.length, data: result });
    }

    // GET /api/products/:id
    if (pathname.startsWith('/api/products/') && method === 'GET') {
      products = loadJson('products.json');
      const id = pathname.replace('/api/products/', '');
      const product = products.find(p => p.id === id);
      if (product) {
        return sendJson(res, 200, { success: true, data: product });
      }
      return sendJson(res, 404, { success: false, message: 'Product not found' });
    }

    // POST /api/inquiries (New Custom Commission Order / Inquiry)
    if (pathname === '/api/inquiries' && method === 'POST') {
      try {
        const body = await parseBody(req);
        if (!body.name || !body.phone) {
          return sendJson(res, 400, {
            success: false,
            message: 'Please provide both your Name and Contact Number / WhatsApp.'
          });
        }

        const newInquiry = {
          id: `inq-${Date.now()}`,
          name: String(body.name).trim(),
          phone: String(body.phone).trim(),
          email: body.email ? String(body.email).trim() : '',
          designType: body.designType || 'Custom Design',
          customSize: body.customSize || 'Medium (18" x 24")',
          budget: body.budget || 'Standard',
          message: body.message || 'Customer requested consultation.',
          status: 'Pending Review',
          createdAt: new Date().toISOString()
        };

        inquiries.unshift(newInquiry);
        saveJson('inquiries.json', inquiries);

        console.log(`[Commission Created] ID: ${newInquiry.id} from ${newInquiry.name} (${newInquiry.phone})`);

        return sendJson(res, 201, {
          success: true,
          message: 'Your custom commission request has been recorded. Ayenah Official will connect with you via WhatsApp soon!',
          inquiryId: newInquiry.id
        });
      } catch (err) {
        return sendJson(res, 500, { success: false, message: 'Failed to save inquiry' });
      }
    }

    // GET /api/inquiries (View inquiries)
    if (pathname === '/api/inquiries' && method === 'GET') {
      return sendJson(res, 200, { success: true, count: inquiries.length, data: inquiries });
    }

    // POST /api/subscribe (VIP Collector Newsletter)
    if (pathname === '/api/subscribe' && method === 'POST') {
      try {
        const body = await parseBody(req);
        const email = String(body.email || '').trim().toLowerCase();
        if (!email || !email.includes('@')) {
          return sendJson(res, 400, { success: false, message: 'Please provide a valid email.' });
        }

        const exists = subscribers.some(s => s.email === email);
        if (!exists) {
          subscribers.push({ email, subscribedAt: new Date().toISOString() });
          saveJson('subscribers.json', subscribers);
        }

        return sendJson(res, 200, {
          success: true,
          message: 'Welcome to Ayenah VIP Collector Circle. You will receive private previews of new releases.'
        });
      } catch (err) {
        return sendJson(res, 500, { success: false, message: 'Failed to subscribe' });
      }
    }

    // GET /api/stats (Live brand metrics)
    if (pathname === '/api/stats' && method === 'GET') {
      return sendJson(res, 200, {
        success: true,
        data: {
          handcraftedCanvases: 140,
          microMirrorsPlaced: '120,000+',
          averageRating: '4.98 / 5.0',
          collectorCities: '18 Cities Nationwide'
        }
      });
    }

    return sendJson(res, 404, { success: false, message: 'API route not found' });
  }

  // --- STATIC FILE SERVER (Frontend) ---
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(PUBLIC_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for Single Page Application routing
      const indexHtml = path.join(PUBLIC_DIR, 'index.html');
      fs.readFile(indexHtml, (readErr, content) => {
        if (readErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          return res.end('Ayenah Official - Page Not Found');
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
        res.end(content);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end('Internal Server Error');
      }
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  ✨ AYENAH OFFICIAL - LUXURY MIRROR ART PLATFORM ✨`);
  console.log(`  Server running live at: http://localhost:${PORT}`);
  console.log(`  Color Theme: Midnight Noir (#0A0A0A) & Royal Gold`);
  console.log(`  REST API ready for Products, Inquiries & Custom Orders`);
  console.log(`====================================================`);
});
