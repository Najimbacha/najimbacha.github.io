"""Simulate a returning visitor with cached assets from the previous design."""
import subprocess
from playwright.sync_api import sync_playwright

OLD_RELEASE = '72b8aaf'
with sync_playwright() as p:
    browser = p.chromium.launch(channel='chrome', headless=True)
    page = browser.new_page(viewport={'width': 390, 'height': 844}, reduced_motion='reduce')
    stale_requests = []
    for filename in ['style.css', 'app.js', 'scene.js']:
        old_content = subprocess.check_output(['git', 'show', f'{OLD_RELEASE}:{filename}']).decode('utf-8')
        def serve_stale(route, body=old_content, name=filename):
            stale_requests.append(name)
            route.fulfill(status=200, content_type='text/css' if name.endswith('.css') else 'text/javascript', body=body)
        # Exact unversioned URLs represent cache entries on returning devices.
        page.route(f'http://127.0.0.1:4173/{filename}', serve_stale)
        page.route(f'http://127.0.0.1:4173/{filename}?v=dd82b40', serve_stale)
    page.goto('http://127.0.0.1:4173/', wait_until='networkidle')
    assert not stale_requests, f'Reused old asset URLs: {stale_requests}'
    assert page.locator('body').evaluate('(e) => getComputedStyle(e).backgroundColor') == 'rgb(9, 11, 14)'
    page.locator('#scene[data-ready="true"]').wait_for()
    assert page.locator('#motion').is_enabled()
    page.locator('#meal-next').click()
    assert page.locator('#meal-name').inner_text() == 'Grilled chicken bowl'
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    browser.close()
    print('PASS: cached old CSS and scripts bypassed; new theme, 3D, and interactions load together')
