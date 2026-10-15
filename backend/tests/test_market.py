from fastapi.testclient import TestClient
from app.market_app import app
client = TestClient(app)

def test_discovery(monkeypatch):
    monkeypatch.delenv('MARKET_CONTRACT', raising=False)
    assert client.get('/api/health').json()['legacy_writes'] is False
    assert client.get('/api/market/config').json()['configured'] is False
    monkeypatch.setenv('MARKET_CONTRACT', '0x'+'1'*40)
    assert client.get('/api/market/config').json()['configured'] is True
    monkeypatch.setenv('MARKET_CONTRACT', 'invalid')
    assert client.get('/api/market/config').json()['configured'] is False

def test_legacy_mutations_and_proxy_are_unavailable():
    for path in ['/api/gallery/x/buy','/api/wallets/seed','/api/wallets/transfer','/api/agents/register']:
        assert client.post(path,json={}).status_code == 410
    assert client.get('/api/gallery/image-proxy?url=http://127.0.0.1/').status_code == 404

def test_static_assets_and_unknown_api():
    assert client.get('/api/art/art_01_crimson_fractures.png').status_code == 200
    assert client.get('/api/missing').status_code == 404
    assert client.get('/contracts/nonexistent.json').status_code == 404
    assert client.get('/api/health').headers['X-Content-Type-Options'] == 'nosniff'

def test_skill_discovery():
    response=client.get('/skill.md')
    assert response.status_code == 200
    assert 'maison-lumiere' in response.text
