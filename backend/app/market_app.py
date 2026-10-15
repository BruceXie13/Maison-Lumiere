"""Public read-only discovery and static hosting for the wallet-signed marketplace.

The old credit ledger is intentionally not mounted. Existing databases are untouched.
All current trading mutations are authorized and settled by the testnet contract.
"""
import os
import re
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, PlainTextResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

ROOT = Path(__file__).resolve().parent.parent
STATIC = ROOT / 'static'
ART = ROOT / 'art'
app = FastAPI(title='Maison Lumière discovery API', version='0.2.0', docs_url='/api/docs', openapi_url='/api/openapi.json')

@app.middleware('http')
async def security_headers(request, call_next):
    if request.url.path.startswith('/api/') and request.method not in ('GET', 'HEAD', 'OPTIONS'):
        response = JSONResponse({'detail': 'The legacy credit API is retired. Use wallet-signed testnet contract calls; see /skill.md.'}, status_code=410)
    else:
        response = await call_next(request)
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https: data:; connect-src 'self' https: wss:; frame-ancestors 'none'; base-uri 'self'; object-src 'none'"
    return response

@app.get('/api/health')
def health():
    return {'status':'ok', 'version':'0.2.0', 'trading':'wallet-signed testnet', 'legacy_writes':False}

@app.get('/api/market/config')
def market_config():
    address = os.getenv('MARKET_CONTRACT', '').strip()
    valid = bool(re.fullmatch(r'0x[0-9a-fA-F]{40}', address)) and address.lower() != '0x' + '0'*40
    return {'chainId':84532, 'rpcUrl':os.getenv('MARKET_PUBLIC_RPC_URL','https://sepolia.base.org'), 'explorer':'https://sepolia.basescan.org', 'contract':address if valid else '', 'configured':valid}

@app.get('/skill.md', response_class=PlainTextResponse)
@app.get('/api/skill', response_class=PlainTextResponse)
@app.get('/api/skill.md', response_class=PlainTextResponse)
def skill():
    for path in (STATIC/'skill.md', ROOT.parent/'public'/'skill.md', ROOT/'skills'/'maison-lumiere'/'SKILL.md'):
        if path.is_file():
            return PlainTextResponse(path.read_text(encoding='utf-8'), media_type='text/markdown')
    raise HTTPException(404, 'Agent guide unavailable')

if ART.is_dir():
    app.mount('/api/art', StaticFiles(directory=ART), name='art')

@app.get('/{path:path}')
def frontend(path: str):
    if path.startswith('api/'):
        raise HTTPException(404, 'Endpoint not available. See /api/docs and /skill.md.')
    file = (STATIC/path).resolve()
    if not file.is_relative_to(STATIC.resolve()):
        raise HTTPException(404)
    if file.is_file():
        return FileResponse(file)
    if path.startswith(('assets/','contracts/')) or '.' in Path(path).name:
        raise HTTPException(404, 'Asset not found')
    if (STATIC/'index.html').is_file():
        return FileResponse(STATIC/'index.html')
    raise HTTPException(503, 'Frontend not built. Run npm run dev for local development, or npm run build for deployment.')
