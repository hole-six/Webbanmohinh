!function () {
    let loadResources = function (path, extension) {
        let fileRef;
        if (extension === 'js') {
            fileRef = document.createElement('script');
            fileRef.setAttribute('type', 'text/javascript');
            fileRef.setAttribute('src', path);
        } else if (extension === 'css') {
            fileRef = document.createElement('link');
            fileRef.setAttribute('rel', 'stylesheet');
            fileRef.setAttribute('type', 'text/css');
            fileRef.setAttribute('href', path);
        }
        if (typeof fileRef != 'undefined')
            document.getElementsByTagName('head')[0].appendChild(fileRef);
    };

    let isClose = true;
    let domain = Bizweb.store;
    let $appRoot = $('#sapo-loyalty-rewards-init');
    let tokenPublic = $appRoot.attr('data-token-public');

    let initLoyaltyFrame = function () {
        let hmac = $appRoot.attr('data-hmac');
        let phone = $appRoot.attr('data-phone');
        let timestamp = $appRoot.attr('data-timestamp');

        let frameUrl = new URL('https://loyalty-web-floading.sapocorp.net');
        frameUrl.searchParams.set('token_public', tokenPublic);
        frameUrl.searchParams.set('alias', domain);
        frameUrl.searchParams.set('hmac', hmac);
        frameUrl.searchParams.set('phone', phone);
        frameUrl.searchParams.set('timestamp', timestamp);

        let loyaltyFrame = document.createElement('iframe');
        loyaltyFrame.setAttribute('id', 'iframe-loyalty');
        loyaltyFrame.setAttribute('style', 'border:none;z-index:99999;');
        loyaltyFrame.setAttribute('frameBorder', '0');
        loyaltyFrame.setAttribute('scrolling', 'no');
        loyaltyFrame.setAttribute('src', frameUrl.toString());

        return loyaltyFrame;
    };

    let initLoyalty = function () {
        let $rewardBase = $('.sapo-rewards-base');

        $rewardBase.append(initLoyaltyFrame());

        loadResources('https://loyalty.sapocorp.net/api/loyalty.css', 'css');

        $appRoot.append(
            '<div class="sapo-rewards-launcher sapo-rewards-device-all sapo-rewards-position-left" style="display: block;">' +
                '<button class="sapo-launcher-button" aria-label="Rewards">' +
                    '<img src="https://loyalty.sapocorp.net/api/gift.png" style="margin-top:-4px" alt="loyalty-gift"/>' +
                    '<span id="title-loyalty">Thành viên thân thiết</span>' +
                    '<span id="loyalty-close">' +
                        '<img src="https://loyalty.sapocorp.net/api/close.png" alt="close">' +
                    '</span>' +
                '</button>' +
            '</div>'
        );

        let $launchBtn = $('.sapo-launcher-button');

        let closeLoyalty = function () {
            if (domain === 'merry-meeple.mysapo.net') {
                $launchBtn.attr('style', 'width:auto;right:30px;left:auto;');
            } else if (domain === 'cuahangthankinhtoc.mysapo.net') {
                $launchBtn.attr('style', 'width:auto;bottom:86px;left:30px;');
            } else {
                $launchBtn.attr('style', 'width:auto;');
            }

            $launchBtn.removeClass('sapo-launcher-button-450');

            $('.sapo-launcher-button img').show();
            $('.sapo-launcher-button span').show();
            $('.sapo-launcher-button #loyalty-close').hide();
            $('.sapo-launcher-button #loyalty-close img').hide();

            $rewardBase.hide();
        };

        let toggleRewardsModal = function () {
            isClose = !isClose;
            if (!isClose) {
                if (domain === 'merry-meeple.mysapo.net') {
                    $launchBtn.attr('style', 'width:48px;right:30px;left:auto;');
                } else if (domain === 'cuahangthankinhtoc.mysapo.net') {
                    $launchBtn.attr('style', 'width:48px;bottom:86px;left:30px;');
                } else {
                    $launchBtn.attr('style', 'width:48px;');
                }

                $launchBtn.addClass('sapo-launcher-button-450');

                $('.sapo-launcher-button img').hide();
                $('.sapo-launcher-button span').hide();
                $('.sapo-launcher-button #loyalty-close').show();
                $('.sapo-launcher-button #loyalty-close img').show();

                $rewardBase.show();
            } else {
                closeLoyalty();
            }
        };

        $launchBtn.on('click', function () {
            toggleRewardsModal();
        });

        window.addEventListener('message', function (e) {
            const data = e.data;
            if (data === 'close_loyalty') {
                isClose = true;
                closeLoyalty();
            }
        });

        if (domain === 'merry-meeple.mysapo.net') {
            $rewardBase.attr('style', 'right:55px;left:auto;bottom:55px;');
            $launchBtn.attr('style', 'right:30px;left:auto;');
        } else if (domain === 'cuahangthankinhtoc.mysapo.net') {
            $rewardBase.attr('style', 'left:55px;bottom:107px;');
            $launchBtn.attr('style', 'bottom:86px;left:30px;');
        }
    };

    let settings = {
        'url': 'https://loyalty.sapocorp.net/api/settings/general',
        'method': 'GET',
        'headers': {
            'X-Loyalty-Token': tokenPublic,
            'X-Sapo-Alias': domain.replace('.mysapo.net', '')
        }
    };

    $.ajax(settings).done(function (response) {
        if (!!response && !!response.use_web && !!response.show_web_floating) {
            initLoyalty();
        }
    });
}();
