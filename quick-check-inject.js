(function(_0x3e1a2f, _0x12c4b8) {
    const _0x2b8c31 = function(_0x5c8e31) {
        while (--_0x5c8e31) {
            _0x3e1a2f['push'](_0x3e1a2f['shift']());
        }
    };
    _0x2b8c31(++_0x12c4b8);
}(_0x5608, 0x1b4));

const _0x5608 = [
    'currentScript', 'getAttribute', 'data-api-key', 'data-email', 'data-action-id', 
    'data-email-element', 'data-web-url', 'botbuster-container', 'getElementById', 
    'createElement', 'id', 'body', 'appendChild', 'userAgent', 'tablet', 'ipad', 
    'playbook', 'silk', 'android', 'mobi', 'phone', 'iP', 'hone', 'od', 'BlackBerry', 
    'IEMobile', 'Kindle', 'Silk-Accelerated', 'hpw', 'web', 'OS', 'Opera', 'ini', 
    'desktop', 'botbuster-iframe', 'remove', 'onBotbusterSuccess', 
    'setTimeout', 'clearTimeout', 'https://dev.botbuster.io/invalidEmail', 'submit', 
    'actionId', 'apiKey', 'device_type', 'email', 'emailElement', 'loadedCaptchaUrl', 
    'session_id', 'message', 'origin', 'includes', 'parse', 'stringify', 'input', 
    'change', 'value', 'trim'
];

(function() {
    const _0x1a8f = function(_0x4e2b, _0x22c1) {
        _0x4e2b = _0x4e2b - 0x0;
        let _0x38b1 = _0x5608[_0x4e2b];
        return _0x38b1;
    };

    const _0x31a412 = document[_0x1a8f('0x0')]();
    let _0x2c148e = _0x31a412 ? _0x31a412[_0x1a8f('0x1')](_0x1a8f('0x2')) : '';
    let _0x18c21a = _0x31a412 ? _0x31a412[_0x1a8f('0x1')](_0x1a8f('0x3')) : '';
    let _0x412d8a = _0x31a412 ? _0x31a412[_0x1a8f('0x1')](_0x1a8f('0x4')) : '';
    let _0x1128ea = _0x31a412 ? _0x31a412[_0x1a8f('0x1')](_0x1a8f('0x5')) : '';
    let _0x4912cb = _0x31a412 ? _0x31a412[_0x1a8f('0x1')](_0x1a8f('0x6')) : '';

    let _0x39a12e = null;
    let _0x281fa4 = 'QC-12345';
    let _0x192bda = null;

    let _0x4812aa = null;
    let _0x12fabc = null;
    const _0x38fa11 = 0x9a7ec0;

    const _0x183a22 = _0x1a8f('0x7');
    let _0x491b2c = document[_0x1a8f('0x8')](_0x183a22);
    if (!_0x491b2c) {
        _0x491b2c = document[_0x1a8f('0x9')]('div');
        _0x491b2c[_0x1a8f('0xa')] = _0x183a22;
        document[_0x1a8f('0xb')][_0x1a8f('0xc')](_0x491b2c);
    }

    const _0x21c81a = () => {
        const _0x128a = navigator[_0x1a8f('0xd')];
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i[_0x1a8f('0x2b')](_0x128a)) return _0x1a8f('0xe');
        if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/[_0x1a8f('0x2b')](_0x128a)) return _0x1a8f('0xf');
        return _0x1a8f('0x10');
    };

    const _0x9812a = (_0x211a = 'standard') => {
        const _0x321a = document[_0x1a8f('0x8')](_0x1a8f('0x11'));
        if (_0x321a) {
            _0x321a[_0x1a8f('0x12')]();
        }
        if (_0x12fabc) {
            clearTimeout(_0x12fabc);
            _0x12fabc = null;
        }
    };

    const _0x2b814a = () => {
        if (typeof window[_0x1a8f('0x13')] === 'function') {
            window[_0x1a8f('0x13')]();
            window[_0x1a8f('0x13')] = null;
        }
    };

    const _0x4128ba = () => {
        if (_0x4812aa) return;
        _0x4812aa = setTimeout(() => {
            _0x9812a('success_completion');
            _0x4812aa = null;
        }, 0x7d0);
    };

    const _0x1812fc = () => {
        if (_0x12fabc) clearTimeout(_0x12fabc);
        _0x12fabc = setTimeout(() => {
            _0x9812a('10_minutes_inactivity');
        }, _0x38fa11);
    };

    const _0x11c28a = (_0x42918a) => {
        const _0x32a18b = document[_0x1a8f('0x8')](_0x1a8f('0x11'));
        if (_0x32a18b && _0x32a18b.src === _0x42918a) return;

        _0x491b2c.innerHTML = '';
        const _0x3218c = document[_0x1a8f('0x9')]('iframe');
        _0x3218c.id = _0x1a8f('0x11');
        _0x3218c.style.cssText = 'width: 100%; height: 700px; border: none; margin-top: 20px;';
        _0x3218c.src = _0x42918a;

        _0x3218c.addEventListener('load', () => {
            let _0x221a8 = null;
            try {
                _0x221a8 = _0x3218c.contentWindow.location.href;
            } catch (_0x991a) {
                _0x221a8 = _0x3218c.src;
            }

            if (_0x221a8 && (_0x221a8[_0x1a8f('0x2c')]('/qc-submitted') || _0x221a8[_0x1a8f('0x2c')]('BOTBUSTER_SUCCESS'))) {
                _0x2b814a();
                _0x4128ba();
            }
        });

        _0x491b2c[_0x1a8f('0xc')](_0x3218c);
        _0x1812fc();
    };

    async function _0x1928bc(_0x3812fa, _0x219a12 = null, _0x3318bc = false) {
        let _0x1281fa = false;
        const _0x4281bc = document[_0x1a8f('0x8')]('botbuster-script');
        if (_0x4281bc) {
            _0x2c148e = _0x4281bc[_0x1a8f('0x1')](_0x1a8f('0x2')) || _0x2c148e;
            _0x18c21a = _0x4281bc[_0x1a8f('0x1')](_0x1a8f('0x4')) || _0x18c21a;
            _0x412d8a = _0x4281bc[_0x1a8f('0x1')](_0x1a8f('0x5')) || _0x412d8a;
            _0x1128ea = _0x4281bc[_0x1a8f('0x1')](_0x1a8f('0x6')) || _0x1128ea;
        }

        if (_0x219a12 && _0x219a12 !== _0x192bda) {
            if (!_0x219a12.startsWith('QC-')) {
                _0x192bda = _0x219a12;
                _0x1281fa = true;
            }
        }

        if (!_0x3318bc && _0x3812fa === _0x39a12e && !_0x1281fa) return;

        if (!_0x3812fa || _0x3812fa.length < 0x5 || !_0x3812fa.includes('@')) {
            _0x11c28a('https://dev.botbuster.io/invalidEmail');
            _0x39a12e = _0x3812fa;
            return;
        }

        const _0x3281ab = _0x21c81a();
        const _0x49182a = _0x192bda || "";

        const _0x28a11c = `https://dev.botbuster.io/submit?actionId=${encodeURIComponent(_0x18c21a || '')}&apiKey=${encodeURIComponent(_0x2c148e || '')}&device_type=${encodeURIComponent(_0x3281ab)}&email=${encodeURIComponent(_0x3812fa)}&emailElement=${encodeURIComponent(_0x412d8a || '')}&loadedCaptchaUrl=${encodeURIComponent(_0x1128ea || '')}&session_id=${encodeURIComponent(_0x49182a)}`;

        _0x11c28a(_0x28a11c);
        _0x39a12e = _0x3812fa;
    }

    window.initBotbusterSDK = _0x1928bc;

    window.addEventListener('message', (_0x219aa) => {
        if (!_0x219aa[_0x1a8f('0x2a')].includes('botbuster.io')) return;
        _0x1812fc();

        const _0x128ab = _0x219aa.data;
        let _0x3891a = '';

        if (typeof _0x128ab === 'string') {
            _0x3891a = _0x128ab;
        } else if (_0x128ab && typeof _0x128ab === 'object') {
            try {
                _0x3891a = JSON[_0x1a8f('0x2e')](_0x128ab);
            } catch (_0x881a) {}
        }

        if (_0x3891a[_0x1a8f('0x2c')]('BOTBUSTER_SUCCESS') || _0x3891a[_0x1a8f('0x2c')]('/qc-submitted')) {
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
                _0x1928bc(_0x228a[_0x1a8f('0x31')][_0x1a8f('0x32')]());
            }, 0x320);
        }
    };

    document.addEventListener('input', _0x3381a, true);
    document.addEventListener('change', _0x3381a, true);

    if (_0x18c21a) {
        _0x1928bc(_0x18c21a);
    }
})();
