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
        return; // Terminate execution — skip iframe injection
    }

    let _0x39a12e = null;
    let _0x192bda = null;

    let _0x4812aa = null;
    let _0x12fabc = null;
    const _0x38fa11 = 10 * 60 * 1000;

    // Flags to prevent duplicate executions and completely block the SDK on 403
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

        console.log('%c[Botbuster SDK - Device Detection]', 'background: #0284c7; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;', {
            detected: _0xdev,
            windowInnerWidth: window.innerWidth,
            screenWidth: window.screen ? window.screen.width : null,
            isWidthUnder768: _0x41ab,
            hasTouch: hasTouch,
            userAgent: _0x128a
        });
        return _0xdev;
    };

    const _0x9812a = (reason = 'standard') => {
        const _0x321a = document.getElementById('botbuster-iframe');
        if (_0x321a) {
            _0x321a.remove();
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

    const _0x11c28a = (_0x42918a) => {
        let _0x491b2c = document.getElementById(_0x183a22);
        if (!_0x491b2c) {
            _0x491b2c = document.createElement('div');
            _0x491b2c.id = _0x183a22;
            document.body.appendChild(_0x491b2c);
        }

        const _0x32a18b = document.getElementById('botbuster-iframe');
        if (_0x32a18b && _0x32a18b.src === _0x42918a) return;

        _0x491b2c.innerHTML = '';
        const _0x3218c = document.createElement('iframe');
        _0x3218c.id = 'botbuster-iframe';
        _0x3218c.style.cssText = 'width: 100%; height: 700px; max-height: 90vh; border: none; margin-top: 20px;';
        _0x3218c.src = _0x42918a;
        _0x3218c.setAttribute('allow', 'cross-origin-isolated');

        _0x491b2c.appendChild(_0x3218c);
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

        if (!_0x3812fa || _0x3812fa.length < 5 || !_0x3812fa.includes('@')) {
            _0x11c28a('https://dev.botbuster.io/invalidEmail');
            _0x39a12e = _0x3812fa;
            return;
        }

        // 1. Construct target submit URL for the iframe
        const _0x3281ab = _0x21c81a();
        const _0x49182a = _0x192bda || "";
        const _0x28a11c = `https://dev.botbuster.io/submit?actionId=${encodeURIComponent(_0x5a19cb || '')}&apiKey=${encodeURIComponent(_0x2c148e || '')}&device_type=${encodeURIComponent(_0x3281ab)}&email=${encodeURIComponent(_0x3812fa)}&emailElement=${encodeURIComponent(_0x412d8a || '')}&loadedCaptchaUrl=${encodeURIComponent(_0x1128ea || '')}&session_id=${encodeURIComponent(_0x49182a)}`;

        // 2. Perform verification request FIRST against the actual AWS API endpoint
        const _0xapiUrl = 'https://5znp405k6i.execute-api.eu-north-1.amazonaws.com/dev/initSDK';
        
        _0xisFetching = true;
        try {
            const _0xres = await fetch(_0xapiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    apiKey: _0x2c148e || '',
                    actionId: _0x5a19cb || '',
                    email: _0x3812fa,
                    device_type: _0x3281ab,
                    session_id: _0x49182a
                })
            });

            // Handle 403 Forbidden - do absolutely nothing, block future requests
            if (_0xres.status === 403) {
                _0xapiBlocked = true;
                _0xisFetching = false;
                return; // Silently terminate without injecting iframe
            }

            // Halt if the validation API returns any other failure status
            if (!_0xres.ok) {
                _0xisFetching = false;
                return;
            }
        } catch (err) {
            // Silently stop if the network request fails
            _0xisFetching = false;
            return; 
        }
        
        _0xisFetching = false;

        // 3. Runs only when the API check succeeds
        console.log('%c[Botbuster SDK - Injecting Iframe]', 'background: #059669; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;', {
            deviceType: _0x3281ab,
            url: _0x28a11c
        });

        _0x11c28a(_0x28a11c);
        _0x39a12e = _0x3812fa;
    }

    window.initBotbusterSDK = _0x1928bc;

    window.addEventListener('message', (_0x219aa) => {
        // If API previously returned 403, do nothing
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
            try {
                _0x3891a = JSON.stringify(_0x128ab);
            } catch (_0x881a) {}
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
        // If API previously returned 403, do nothing
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
