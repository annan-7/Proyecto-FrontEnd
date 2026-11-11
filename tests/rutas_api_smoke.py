"""Ecorutas frontend integration: controlled HTTP responses, not live API evidence.
Start `python3 -m http.server 8003`; run `python3 tests/rutas_api_smoke.py`.
Fixture source: annan-7/ecorutas-api main/src/data/routes.json, retrieved 2026-11-11.
"""
import copy
import json
from pathlib import Path
from urllib.parse import urlsplit, parse_qs
from playwright.sync_api import sync_playwright

SEED = json.loads((Path(__file__).parent / 'fixtures/ecorutas-routes.json').read_text())
BASE = 'http://127.0.0.1:8003/paginas/rutas.html'
API = 'https://ecorutas-api.vercel.app'

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    page = browser.new_page()
    errors, requests = [], []
    page.on('pageerror', lambda error: errors.append(str(error)))
    state = {'catalog': SEED, 'list': 'ok', 'detail': 'ok', 'photos': 'ok'}

    def serve(route):
        request = route.request
        parts = urlsplit(request.url)
        query = parse_qs(parts.query)
        requests.append(request.url)
        assert request.method == 'GET'
        assert 'authorization' not in request.headers
        if parts.path == '/api/v1/routes':
            mode = state['list']
            if mode == 'http':
                route.fulfill(status=503)
            elif mode == 'invalid':
                route.fulfill(body='not json', content_type='application/json')
            elif mode == 'schema':
                route.fulfill(json={'items': {}, 'total': 1})
            elif mode == 'network':
                route.abort()
            else:
                items = state['catalog']
                skip = int(query.get('skip', [0])[0])
                limit = int(query['limit'][0])
                assert limit == 100
                route.fulfill(json={'items': items[skip:skip+limit], 'total': len(items), 'skip': skip, 'limit': limit})
        else:
            rid = parts.path.rsplit('/', 1)[-1]
            record = next((item for item in state['catalog'] if item['id'] == rid), None)
            if state['detail'] == '404' or record is None:
                route.fulfill(status=404, json={'detail': 'Not found'})
            elif state['detail'] == 'network':
                route.abort()
            else:
                record = copy.deepcopy(record)
                record['latitude'] = 0
                record['longitude'] = 0
                route.fulfill(json=record)

    page.route('https://**/*', lambda route: route.abort())
    page.route(API + '/**', serve)
    page.route('https://upload.wikimedia.org/**', lambda route: route.fulfill(body='<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250"></svg>', content_type='image/svg+xml') if state['photos'] == 'ok' else route.abort())
    page.goto(BASE)
    page.wait_for_selector('#routes-status[data-state=success]')
    assert page.locator('#routes-grid > li').count() == len(SEED)
    assert len(requests) == 1, requests
    assert not page.locator('.destinations-api').count()
    first = page.locator('#routes-grid > li').first
    assert first.locator('.route-card__title').inner_text() == SEED[0]['name']
    assert first.locator('[data-card-description]').inner_text() == SEED[0]['description']
    assert first.get_attribute('data-difficulty') == SEED[0]['difficulty']
    assert first.locator('.route-card__badge').text_content() == 'Fácil'
    assert first.locator('[data-card-credit]').is_visible()
    assert 'Pedro Szekely' in first.locator('[data-card-credit]').inner_text()
    assert first.locator('[data-card-credit] a').first.get_attribute('href').startswith('https://creativecommons.org/')
    assert 'puede no mostrar' in first.locator('[data-card-credit]').inner_text()
    state['photos'] = 'fail'
    first.locator('img').evaluate("(img) => img.src = 'https://upload.wikimedia.org/intentionally-missing-image.jpg'")
    # Broken remote photos use the local SVG and stop attributing the fallback to remote authors.
    first.locator('img').scroll_into_view_if_needed()
    page.wait_for_function("document.querySelector('#routes-grid img').src.endsWith('ruta-sin-foto.svg')")
    assert first.locator('[data-card-credit]').is_hidden()
    # All combined filters use the complete catalog.
    page.locator('.filters__advanced-toggle').click()
    page.locator('#filter-location').select_option('Magallanes')
    page.locator('#filter-difficulty').select_option('moderada')
    page.locator('#search-input').fill('torres')
    expected = [r for r in SEED if r['location'] == 'Magallanes' and r['difficulty'] == 'moderada' and 'torres' in r['name'].lower()]
    assert page.locator('#routes-grid > li').count() == len(expected)
    page.locator('#search-input').fill('no existe esta ruta')
    assert page.locator('.results__empty').is_visible()
    page.locator('.results__empty-clear').click()
    assert page.locator('#routes-grid > li').count() == len(SEED)
    assert len(requests) == 1, 'Filtering should not fetch again'
    page.locator('#search-input').fill('conguillio')
    assert page.locator('#routes-grid > li').count() > 0
    page.locator('.filters__advanced .filters__clear').click()
    # The existing modal requests the selected UUID, never its array position.
    detail_button = page.locator('[data-route-details]').first
    detail_button.focus()
    page.keyboard.press('Enter')
    page.wait_for_selector('#route-detail-status[data-state=success]', state='attached')
    assert page.locator('.route-dialog').evaluate('(d) => d.open')
    assert page.locator('[data-dialog-title]').inner_text() == SEED[0]['name']
    assert '/api/v1/routes/' + SEED[0]['id'] in requests[-1]
    assert 'mlat=0' in page.locator('[data-dialog-extra] a').get_attribute('href')
    assert SEED[0]['interesting_fact'] in page.locator('[data-dialog-extra]').inner_text()
    page.keyboard.press('Escape')
    assert not page.locator('.route-dialog').evaluate('(d) => d.open')
    state['detail'] = '404'
    detail_button.click()
    page.wait_for_selector('#route-detail-status[data-state=error]')
    assert '404' in page.locator('#route-detail-status').inner_text()
    assert page.locator('#route-detail-retry').is_hidden()
    page.locator('[data-dialog-close]').click()
    state['detail'] = 'network'
    detail_button.click()
    page.wait_for_selector('#route-detail-status[data-state=error]')
    assert page.locator('#route-detail-retry').is_visible()
    state['detail'] = 'ok'
    page.locator('#route-detail-retry').click()
    page.wait_for_selector('#route-detail-status[data-state=success]', state='attached')
    page.locator('[data-dialog-close]').click()
    # Invalid IDs do not issue an API request.
    count_before = len(requests)
    detail_button.evaluate('(button) => button.dataset.routeId = "invalid"')
    detail_button.click()
    assert 'no es válido' in page.locator('#route-detail-status').inner_text()
    assert len(requests) == count_before
    page.locator('[data-dialog-close]').click()
    # Empty catalog is different from network/schema failures.
    state['catalog'] = []
    page.reload()
    page.wait_for_selector('#routes-status[data-state=success]')
    assert page.locator('.results__empty').is_visible()
    assert page.locator('#results-number').inner_text() == '0'
    for failure in ['http', 'invalid', 'schema', 'network']:
        state['list'] = failure
        page.reload()
        page.wait_for_selector('#routes-status[data-state=error]')
        assert page.locator('#routes-retry').is_visible()
        assert page.locator('#routes-grid > li').count() == 0
        state['list'] = 'ok'
        state['catalog'] = SEED
        page.locator('#routes-retry').click()
        page.wait_for_selector('#routes-status[data-state=success]')
        assert page.locator('#routes-grid > li').count() == len(SEED)
    # Future larger catalogs: fetch all pages before local filtering; no silent truncation.
    large = copy.deepcopy(SEED)
    while len(large) < 105:
        item = copy.deepcopy(SEED[0])
        item['id'] = f'00000000-0000-0000-0000-{len(large):012d}'
        large.append(item)
    state['catalog'] = large
    requests.clear()
    page.reload()
    page.wait_for_selector('#routes-status[data-state=success]')
    assert page.locator('#routes-grid > li').count() == len(large)
    assert len(requests) == 2 and 'skip=100' in requests[-1]
    # Text from the API is never interpreted as markup.
    state['catalog'] = copy.deepcopy(SEED[:1])
    state['catalog'][0]['name'] = '<img src=x onerror=alert(1)>'
    page.reload()
    page.wait_for_selector('#routes-status[data-state=success]')
    assert page.locator('.route-card__title img').count() == 0
    page.set_viewport_size({'width': 390, 'height': 844})
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    assert not errors, errors
    browser.close()
    print('PASS: fields, local combined filters/reset, modal UUID/404/retry/zero coordinates, image fallback, catalog errors/retry, pagination, safe text, mobile and keyboard')
