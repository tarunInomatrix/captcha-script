async function _0x1928bc(_0x3812fa, _0x219a12 = null, _0x3318bc = false) {
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

        const _0x3281ab = _0x21c81a();
        const _0x49182a = _0x192bda || "";

        const _0x28a11c = `https://dev.botbuster.io/submit?actionId=${encodeURIComponent(_0x5a19cb || '')}&apiKey=${encodeURIComponent(_0x2c148e || '')}&device_type=${encodeURIComponent(_0x3281ab)}&email=${encodeURIComponent(_0x3812fa)}&emailElement=${encodeURIComponent(_0x412d8a || '')}&loadedCaptchaUrl=${encodeURIComponent(_0x1128ea || '')}&session_id=${encodeURIComponent(_0x49182a)}`;

        try {
            // Pre-flight check before injecting the iframe
            const _0xcheckRes = await fetch(_0x28a11c);
            const _0xcontentType = _0xcheckRes.headers.get('content-type') || '';

            // If the endpoint returns JSON (error or validation response)
            if (_0xcontentType.includes('application/json')) {
                const _0xcheckData = await _0xcheckRes.json();

                if (_0xcheckData && _0xcheckData.code === 'DOMAIN_NOT_WHITELISTED') {
                    console.error('[Botbuster SDK] ' + (_0xcheckData.error || 'Domain is not whitelisted. Aborting iframe injection.'));
                    _0x9812a('domain_not_whitelisted');
                    return; // Stop here, do NOT inject iframe
                }

                if (!_0xcheckRes.ok) {
                    console.error('[Botbuster SDK] Request failed:', _0xcheckData);
                    return;
                }
            } else if (!_0xcheckRes.ok) {
                console.error('[Botbuster SDK] Failed to validate URL before injection, status:', _0xcheckRes.status);
                return;
            }
        } catch (err) {
            console.warn('[Botbuster SDK] Validation check failed.', err);
            return;
        }

        console.log('%c[Botbuster SDK - Injecting Iframe]', 'background: #059669; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;', {
            deviceType: _0x3281ab,
            url: _0x28a11c
        });

        _0x11c28a(_0x28a11c);
        _0x39a12e = _0x3812fa;
    }
