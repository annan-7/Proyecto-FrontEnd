"""Smoke test con la API pública real; requiere servidor en puerto 8003.
Ejecutar con el proxy y la CA del entorno correctamente configurados.
"""
import json, os
from urllib.request import urlopen
with urlopen('https://ecorutas-api.vercel.app/api/v1/routes?limit=100', timeout=20) as response:
 live = json.load(response)
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 opts={'executable_path':'/usr/bin/chromium','args':['--no-sandbox']}
 if os.environ.get('HTTPS_PROXY'):opts['proxy']={'server':os.environ['HTTPS_PROXY'],'bypass':'127.0.0.1,localhost'}
 b=p.chromium.launch(**opts)
 page=b.new_page();errors=[];bad=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('requestfailed',lambda r:bad.append((r.url,r.failure)))
 page.goto('http://127.0.0.1:8003/paginas/rutas.html',wait_until='domcontentloaded')
 page.wait_for_function("['success','error'].includes(document.querySelector('#routes-status').dataset.state)",timeout=25000)
 print('State:',page.locator('#routes-status').get_attribute('data-state'),flush=True)
 print('Message:',page.locator('#routes-status').inner_text(),flush=True)
 if page.locator('#routes-status').get_attribute('data-state')!='success':
  print('Failed requests:',bad,flush=True);raise SystemExit(1)
 assert page.locator('#routes-grid > li').count()==live['total']
 assert page.locator('.route-card__title').first.inner_text()==live['items'][0]['name']
 page.locator('#routes-grid img').first.scroll_into_view_if_needed()
 page.wait_for_function("document.querySelector('#routes-grid img').complete && document.querySelector('#routes-grid img').naturalWidth > 0")
 print('First image:',page.locator('#routes-grid img').first.get_attribute('src'),flush=True)
 page.locator('.filters__advanced-toggle').click()
 r=live['items'][0]
 page.locator('#filter-location').select_option(r['location'])
 page.locator('#filter-difficulty').select_option(r['difficulty'])
 page.locator('#search-input').fill(r['name'])
 assert page.locator('#routes-grid > li').count()>=1
 page.locator('[data-route-details]').first.click()
 page.wait_for_selector('#route-detail-status[data-state=success]',state='attached',timeout=20000)
 assert page.locator('[data-dialog-title]').inner_text()==r['name']
 assert page.locator('[data-dialog-description]').inner_text()==r['description']
 page.keyboard.press('Escape')
 page.locator('#search-input').fill('sin coincidencias abc123')
 assert page.locator('.results__empty').is_visible()
 page.locator('.results__empty-clear').click()
 assert page.locator('#routes-grid > li').count()==live['total']
 page.set_viewport_size({'width':390,'height':844})
 assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
 assert not errors,errors
 print('PASS LIVE: production catalog, image, combined filters, detail fetch, empty/reset, mobile; JS errors:',errors,flush=True)
 print('Failed requests:',bad,flush=True)
 b.close()
