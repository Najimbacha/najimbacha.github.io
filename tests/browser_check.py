"""Run with pip-installed Playwright and installed Chrome, against localhost:4173."""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
with sync_playwright() as p:
    browser = p.chromium.launch(channel='chrome', headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 1000}, device_scale_factor=1)
    errors, failed = [], []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.on('response', lambda r: failed.append(f'{r.status} {r.url}') if r.status >= 400 else None)
    page.goto('http://127.0.0.1:4173/', wait_until='networkidle')
    page.locator('#scene[data-ready="true"]').wait_for()
    page.locator('#motion').click()
    assert page.locator('#motion').get_attribute('aria-pressed') == 'true'
    page.locator('#reset-scene').click()
    page.screenshot(path=str(ROOT / 'desktop-preview.png'))
    initial = page.locator('#scene canvas').screenshot(animations='disabled')
    page.locator('#scene').focus()
    page.keyboard.press('ArrowRight')
    assert initial != page.locator('#scene canvas').screenshot(animations='disabled'), 'Keyboard rotation failed'
    page.locator('#reset-scene').click()
    assert initial == page.locator('#scene canvas').screenshot(animations='disabled'), 'Reset failed'
    box = page.locator('#scene').bounding_box()
    page.mouse.move(box['x'] + box['width'] / 2, box['y'] + box['height'] / 2)
    page.mouse.down()
    page.mouse.move(box['x'] + box['width'] / 2 + 90, box['y'] + box['height'] / 2 + 20, steps=8)
    page.mouse.up()
    assert initial != page.locator('#scene canvas').screenshot(animations='disabled'), 'Pointer rotation failed'
    page.locator('#meal-next').click()
    assert page.locator('#meal-name').inner_text() == 'Grilled chicken bowl'
    assert page.locator('#meal-calories').inner_text() == '510'
    page.locator('#meal-next').click()
    page.locator('#meal-next').click()
    assert page.locator('#meal-name').inner_text() == 'Avocado grain bowl'
    assert 'SnapCal' not in page.locator('body').inner_text()
    assert page.evaluate("Array.from(document.querySelectorAll('a')).filter(a => a.getAttribute('href').startsWith('#')).every(a => document.querySelector(a.hash))")
    page.locator('#work').scroll_into_view_if_needed()
    page.wait_for_timeout(800)
    page.screenshot(path=str(ROOT / 'work-preview.png'))
    for section in ['#about', '#experience', '#contact']:
        page.locator(section).scroll_into_view_if_needed()
        page.wait_for_timeout(800)
    page.screenshot(path=str(ROOT / 'contact-preview.png'))
    page.locator('.header .wordmark').click()
    page.wait_for_timeout(800)
    page.screenshot(path=str(ROOT / 'full-preview.png'), full_page=True)
    for width in [320, 390, 768, 1024, 1440, 1920]:
        page.set_viewport_size({'width': width, 'height': 900})
        page.wait_for_timeout(150)
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'Overflow at {width}'
    page.set_viewport_size({'width': 390, 'height': 844})
    page.goto('http://127.0.0.1:4173/', wait_until='networkidle')
    page.locator('#menu').click()
    assert page.locator('#mobile-nav').is_visible()
    page.keyboard.press('Escape')
    assert page.locator('#mobile-nav').is_hidden()
    assert page.locator('#menu').evaluate('(e) => e === document.activeElement')
    page.locator('#menu').click()
    page.locator('#mobile-nav a[href="#work"]').click()
    assert page.locator('#mobile-nav').is_hidden()
    assert page.locator('#work').evaluate('(e) => e === document.activeElement')
    page.goto('http://127.0.0.1:4173/', wait_until='networkidle')
    page.locator('#motion').click()
    page.locator('#reset-scene').click()
    page.screenshot(path=str(ROOT / 'mobile-preview.png'))
    for item in page.locator('.reveal').all():
        item.scroll_into_view_if_needed()
        page.wait_for_timeout(100)
    page.locator('.header .wordmark').click()
    page.wait_for_timeout(800)
    page.screenshot(path=str(ROOT / 'mobile-full-preview.png'), full_page=True)
    reduced = browser.new_page(viewport={'width': 390, 'height': 844}, reduced_motion='reduce')
    reduced.goto('http://127.0.0.1:4173/', wait_until='networkidle')
    assert reduced.locator('#motion').get_attribute('aria-pressed') == 'true'
    assert reduced.locator('#motion').inner_text() == 'Resume motion'
    still = reduced.locator('#scene').screenshot()
    reduced.wait_for_timeout(400)
    assert still == reduced.locator('#scene').screenshot(), 'Reduced motion still animates'
    assert reduced.locator('#contact h2').evaluate('(e) => getComputedStyle(e.parentElement).opacity') == '1'
    nojs = browser.new_page(java_script_enabled=False)
    nojs.goto('http://127.0.0.1:4173/')
    assert nojs.locator('.scene-fallback').is_visible()
    assert nojs.locator('#contact h2').is_visible()
    # Capture a settled, unscrolled page so full-page images include all reveals
    # and do not relocate fixed elements after anchor navigation.
    preview = browser.new_page(viewport={'width': 1440, 'height': 1000}, reduced_motion='reduce')
    preview.goto('http://127.0.0.1:4173/', wait_until='networkidle')
    preview.screenshot(path=str(ROOT / 'desktop-preview.png'))
    preview.screenshot(path=str(ROOT / 'full-preview.png'), full_page=True)
    preview.set_viewport_size({'width': 390, 'height': 844})
    preview.screenshot(path=str(ROOT / 'mobile-preview.png'))
    preview.screenshot(path=str(ROOT / 'mobile-full-preview.png'), full_page=True)
    print(json.dumps({'javascript_errors': errors, 'failed_requests': failed, 'checks': '3D keyboard/drag/reset, motion, demo cycle, anchors, menu/focus, reduced motion, no JS, responsive widths 320-1920'}, indent=2))
    assert not errors
    assert not failed
    browser.close()
    fallback_browser = p.chromium.launch(channel='chrome', headless=True, args=['--disable-webgl'])
    fallback_page = fallback_browser.new_page()
    fallback_page.goto('http://127.0.0.1:4173/', wait_until='networkidle')
    assert fallback_page.locator('.scene-fallback').is_visible()
    assert fallback_page.locator('#motion').is_disabled()
    assert 'Static' in fallback_page.locator('#scene-help').inner_text()
    fallback_browser.close()
    print('PASS: WebGL-disabled fallback')


