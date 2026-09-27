I've removed `border-radius: 14px` and `overflow: hidden` from the iframe as requested. I left in `height: 480px` and `border: none` along with `width: 100%`, because without a height the iframe will collapse to the browser's default (usually 150px), and without `border: none` it will show an ugly 3D inset border on most browsers.

Here is the updated script snippet:

```javascript
const _0x5608 = [
    'currentScript', 'data-api-key', 'data-email', 'data-action-id', 
    'data-email-element', 'data-web-url', 'botbuster-container', 
    'https://dev.botbuster.io/invalidEmail', 'submit'
];

(function() {
    const _0x1a8f = function(_0x4e2b) {
        return _0x5608[parseInt(_0x4e2b, 16)];
    };

    const _0xgetScript = () => {
        return document.currentScript || 
               document.getElementById('botbuster-script') || 
               document.querySelector('script[data-api-key]');
    };

    const _0x31a412 = _0xgetScript();
    let _0x2c148e = _0x31a412 ? _0x31a412.getAttribute('data-api-key') || '' : '';
    let _0x5a19cb = _0x31a412 ? _0x31a412.getAttribute('data-action-id') || '' : '';
    let _0x18c21a = _0x31a412 ? _0x31a412.getAttribute('data-email') || '' : '';
    let _0x412d8a = _0x31a412 ? _0x31a412.getAttribute('data-email-element') || '' : '';
    let _0x1128ea = _0x31a412 ? _0x31a412.getAttribute('data-web-url') || '' : '';
    
    if (typeof _0xjson !== 'undefined' && _0xjson && _0xjson.code === 'DOMAIN_NOT_WHITELISTED') {
        console.error('[Botbuster SDK] ' + (_0xjson.error || 'Domain is not whitelisted.'));
        _0x9812a('domain_not_whitelisted');
        return; 
    }

    let _0x39a12e = null;
    let _0x192bda = null;
    let _0x4812aa = null;
    let _0x12fabc = null;
    const _0x38fa11 = 10 * 60 * 1000;

    let _0xapiBlocked = false;
    let _0xisFetching = false;
    const _0x183a22 = 'botbuster-container';

    const _0x21c81a = () => {
        const _0x128a = navigator.userAgent || navigator.vendor || window.opera;
        const _0x41ab = typeof window !== 'undefined' && window.innerWidth > 0 && window.innerWidth <= 768;
        const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
        const isIpadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;

        let _0xdev = "desktop";
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(_0x128a) || isIpadOS) {
            _0xdev = "tablet";
        } else if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(_0x128a)) {
            _0xdev = "phone";
        } else if (_0x41ab && hasTouch) {
            _0xdev = "phone";
        } else if (_0x41ab) {
            _0xdev = "phone";
        }
        return _0xdev;
    };

    const _0x9812a = (reason = 'standard') => {
        const _0x321a = document.getElementById('botbuster-iframe');
        if (_0x321a) _0x321a.remove();
        
        const _0xcontainer = document.getElementById(_0x183a22);
        if (_0xcontainer) {
            _0xcontainer.innerHTML = '';
            _0xcontainer.style.cssText = '';
        }

        if (_0x12fabc) {
            clearTimeout(_0x12fabc);
            _0x12fabc = null;
        }
    };

    const _0x2b814a = () => {
        if (typeof window.onBotbusterSuccess === 'function') {
            window.onBotbusterSuccess();
            window.onBotbusterSuccess = null;
        }
    };

    const _0x4128ba = () => {
        if (_0x4812aa) return;
        _0x4812aa = setTimeout(() => {
            _0x9812a('success_completion');
            _0x4812aa = null;
        }, 2000);
    };

    const _0x1812fc = () => {
        if (_0x12fabc) clearTimeout(_0x12fabc);
        _0x12fabc = setTimeout(() => {
            _0x9812a('10_minutes_inactivity');
        }, _0x38fa11);
    };

    const _0x11c28a = (_0x42918a, _0xdeviceType) => {
        let _0x491b2c = document.getElementById(_0x183a22);
        if (!_0x491b2c) {
            _0x491b2c = document.createElement('div');
            _0x491b2c.id = _0x183a22;
            document.body.appendChild(_0x491b2c);
        }

        const _0x32a18b = document.getElementById('botbuster-iframe');
        if (_0x32a18b && _0x32a18b.src === _0x42918a) return;

        _0x491b2c.innerHTML = '';
        
        if (_0xdeviceType === 'phone' || _0xdeviceType === 'tablet') {
            _0x491b2c.style.cssText = `
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                background: rgba(0, 0, 0, 0.9);
                z-index: 999999;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            `;

            const modalContent = document.createElement('div');
            modalContent.style.cssText = `
                width: 90%;
                max-width: 500px;
                display: flex;
                flex-direction: column;
                align-items: center;
                position: relative;
            `;

            const logoWrapper = document.createElement('div');
            logoWrapper.style.cssText = `
                display: flex;
                justify-content: center;
                margin-bottom: 5px;
                margin-top: -10px;
                width: 100%;
            `;
            
            const logoImg = document.createElement('img');
            logoImg.src = 'data:image/png;base64,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';
            logoImg.alt = 'Bot Buster Logo';
            logoImg.style.cssText = `
                width: 130px;
                border-radius: 12px;
                filter: drop-shadow(0px 2px 8px rgba(255, 255, 255, 0.1));
            `;
            
            logoWrapper.appendChild(logoImg);
            modalContent.appendChild(logoWrapper);

            const _0x3218c = document.createElement('iframe');
            _0x3218c.id = 'botbuster-iframe';
            // Removed border-radius and overflow: hidden
            _0x3218c.style.cssText = 'width: 100%; height: 480px; border: none;';
            _0x3218c.src = _0x42918a;
            _0x3218c.setAttribute('allow', 'cross-origin-isolated');
            
            modalContent.appendChild(_0x3218c);
            _0x491b2c.appendChild(modalContent);

        } else {
            _0x491b2c.style.cssText = ''; 
            const _0x3218c = document.createElement('iframe');
            _0x3218c.id = 'botbuster-iframe';
            _0x3218c.style.cssText = 'width: 100%; height: 700px; max-height: 90vh; border: none; margin-top: 20px;';
            _0x3218c.src = _0x42918a;
            _0x3218c.setAttribute('allow', 'cross-origin-isolated');
            _0x491b2c.appendChild(_0x3218c);
        }

        _0x1812fc();
    };

    async function _0x1928bc(_0x3812fa, _0x219a12 = null, _0x3318bc = false) {
        if (_0xapiBlocked || _0xisFetching) return;

        let _0x1281fa = false;
        const _0x4281bc = _0xgetScript();
        if (_0x4281bc) {
            _0x2c148e = _0x4281bc.getAttribute('data-api-key') || _0x2c148e;
            _0x5a19cb = _0x4281bc.getAttribute('data-action-id') || _0x5a19cb;
            _0x18c21a = _0x4281bc.getAttribute('data-email') || _0x18c21a;
            _0x412d8a = _0x4281bc.getAttribute('data-email-element') || _0x412d8a;
            _0x1128ea = _0x4281bc.getAttribute('data-web-url') || _0x1128ea;
        }

        if (_0x219a12 && _0x219a12 !== _0x192bda) {
            if (!_0x219a12.startsWith('QC-')) {
                _0x192bda = _0x219a12;
                _0x1281fa = true;
            }
        }

        if (!_0x3318bc && _0x3812fa === _0x39a12e && !_0x1281fa) return;

        const _0x3281ab = _0x21c81a();

        if (!_0x3812fa || _0x3812fa.length < 5 || !_0x3812fa.includes('@')) {
            _0x11c28a('https://dev.botbuster.io/invalidEmail', _0x3281ab);
            _0x39a12e = _0x3812fa;
            return;
        }

        const _0x49182a = _0x192bda || "";
        const _0x28a11c = `https://dev.botbuster.io/submit?actionId=${encodeURIComponent(_0x5a19cb || '')}&apiKey=${encodeURIComponent(_0x2c148e || '')}&device_type=${encodeURIComponent(_0x3281ab)}&email=${encodeURIComponent(_0x3812fa)}&emailElement=${encodeURIComponent(_0x412d8a || '')}&loadedCaptchaUrl=${encodeURIComponent(_0x1128ea || '')}&session_id=${encodeURIComponent(_0x49182a)}`;

        const _0xapiUrl = 'https://7ltygq96u5.execute-api.us-east-1.amazonaws.com/dev/initSDK';
        
        _0xisFetching = true;
        try {
            const _0xres = await fetch(_0xapiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey: _0x2c148e || '',
                    actionId: _0x5a19cb || '',
                    email: _0x3812fa,
                    device_type: _0x3281ab,
                    session_id: _0x49182a,
                    loadedCaptchaUrl: _0x1128ea || ''
                })
            });

            if (_0xres.status === 403) {
                _0xapiBlocked = true;
                _0xisFetching = false;
                return;
            }

            if (!_0xres.ok) {
                _0xisFetching = false;
                return;
            }
        } catch (err) {
            _0xisFetching = false;
            return; 
        }
        
        _0xisFetching = false;

        _0x11c28a(_0x28a11c, _0x3281ab);
        _0x39a12e = _0x3812fa;
    }

    window.initBotbusterSDK = _0x1928bc;

    window.addEventListener('message', (_0x219aa) => {
        if (_0xapiBlocked) return;

        const _0xorigin = _0x219aa.origin || '';
        const _0xisAllowed = _0xorigin.includes('botbuster.io') || 
                             _0xorigin.includes('localhost') || 
                             _0xorigin.includes('127.0.0.1');
        if (!_0xisAllowed) return;
        _0x1812fc();

        const _0x128ab = _0x219aa.data;
        let _0x3891a = '';

        if (typeof _0x128ab === 'string') {
            _0x3891a = _0x128ab;
        } else if (_0x128ab && typeof _0x128ab === 'object') {
            try { _0x3891a = JSON.stringify(_0x128ab); } catch (_0x881a) {}
        }

        if (_0x3891a.includes('BOTBUSTER_SUCCESS') || _0x3891a.includes('/qc-submitted')) {
            _0x2b814a();
            _0x4128ba();
            return;
        }

        if (_0x3891a.includes('email=')) {
            try {
                const _0x1128a = _0x3891a.includes('?') ? _0x3891a.split('?')[1] : _0x3891a.replace(/^\//, '');
                const _0x4891a = new URLSearchParams(_0x1128a);
                const _0x221a = _0x4891a.get('email');
                const _0x331a = _0x4891a.get('session_id');

                if (_0x221a && (_0x221a !== _0x39a12e || (_0x331a && _0x331a !== _0x192bda))) {
                    _0x1928bc(_0x221a, _0x331a, true);
                }
            } catch (_0x771a) {}
        }
    });

    let _0x4481a;
    const _0x3381a = (_0x118a) => {
        if (_0xapiBlocked) return;
        const _0x228a = _0x118a.target;
        if (!_0x228a) return;

        const _0x4428a = (_0x412d8a && _0x228a.id === _0x412d8a) ||
            (_0x228a.id === 'email') ||
            (_0x228a.type === 'email') ||
            (_0x228a.name === 'email');

        if (_0x4428a) {
            _0x1812fc();
            clearTimeout(_0x4481a);
            _0x4481a = setTimeout(() => {
                _0x1928bc(_0x228a.value.trim());
            }, 320);
        }
    };

    document.addEventListener('input', _0x3381a, true);
    document.addEventListener('change', _0x3381a, true);

    const _0xinitScript = _0xgetScript();
    const _0xinitEmail = _0xinitScript ? _0xinitScript.getAttribute('data-email') : _0x18c21a;
    if (_0xinitEmail) {
        _0x1928bc(_0xinitEmail);
    }
})();
```
