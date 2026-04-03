$(document).ready(function () {

    /* ── 1. NAVBAR: Add shadow when user scrolls down ── */
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 50) {
            $('.custom-navbar').addClass('scrolled');
        } else {
            $('.custom-navbar').removeClass('scrolled');
        }
    });

    /* ── 2. SMOOTH SCROLL: Animate scroll to section anchors ── */
    $('a[href^="#"]').on('click', function (e) {
        var target = $(this).attr('href');
        if (target.length > 1 && $(target).length) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: $(target).offset().top - 86
            }, 600);
        }
    });

    /* ── 3. MOBILE MENU: Close menu when a nav link is clicked ── */
    $('.nav-link:not(.dropdown-toggle), .dropdown-item').on('click', function () {
        if ($('.navbar-collapse').hasClass('show') && $(window).width() < 992) {
            setTimeout(function () {
                $('.navbar-toggler').trigger('click');
            }, 200);
        }
    });

    /* ── 4. SCROLL REVEAL: Cards fade up when they scroll into view */

    var $cards = $('.feature-card, .product-card, .app-card, .gallery-card, .testimonial-card, .sitemap-card');

    // Add scroll-reveal class to all cards so they start invisible and shifted down
    $cards.addClass('scroll-reveal');

    // Run the reveal check on scroll and also immediately on page load
    $(window).on('scroll', revealCards);
    revealCards();

    function revealCards() {
        // Bottom edge of the visible window
        var windowBottom = $(window).scrollTop() + $(window).height();

        $cards.each(function (i) {
            // Top edge of this card
            var cardTop = $(this).offset().top;

            // If the card has entered the visible area (with 50px buffer)
            if (windowBottom > cardTop + 50) {
                var $card = $(this);
                // Stagger the delay so cards appear one after another
                var delay = Math.min(i * 80, 500);
                setTimeout(function () {
                    $card.addClass('active');
                }, delay);
            }
        });
    }

    /* ── 5. FAQ ACCORDION: Open/close FAQ answers on click ── */
    $('.faq-question').on('click', function () {
        var $item = $(this).closest('.faq-item');
        var $answer = $item.find('.faq-answer');
        var isOpen = $item.hasClass('active');

        // Close all open items first
        $('.faq-item').removeClass('active');
        $('.faq-answer').css({ maxHeight: '', padding: '0 1.75rem' });
        $('.faq-question i').removeClass('fa-minus').addClass('fa-plus');

        // If the clicked item was closed, open it
        if (!isOpen) {
            $item.addClass('active');
            $answer.css({
                maxHeight: $answer[0].scrollHeight + 40 + 'px',
                padding: '1rem 1.75rem'
            });
            $item.find('.faq-question i').removeClass('fa-plus').addClass('fa-minus');
        }
    });

    /* ── 6. STAR RATING: Show label text when a star is selected ── */
    var starLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

    $('.star-rating input').on('change', function () {
        var value = parseInt($(this).val());
        $('.rating-text').text(starLabels[value] || '');
        $('.star-required-error').remove();
    });

    /* ── 7. INITIALIZE FORMS if they exist on the page ── */
    if ($('.contact-form').length) {
        initContactForm();
    }
    if ($('.main-feedback-form').length) {
        initFeedbackForm();
    }

});


/* ── On page load: scroll to hash if URL has one (e.g. gallery.html#pet-bottles) ── */
$(window).on('load', function () {
    if (window.location.hash) {
        var target = $(window.location.hash);
        if (target.length) {
            setTimeout(function () {
                $('html, body').animate({
                    scrollTop: target.offset().top - 86
                }, 700);
            }, 150);
        }
    }
});


/* CONTACT FORM */

function initContactForm() {
    var $form = $('.contact-form');

    // Validate each field when user leaves it (blur event)
    $form.find('#contactName').on('blur', function () { validateName($(this)); });
    $form.find('#contactEmail').on('blur', function () { validateEmail($(this)); });
    $form.find('#contactPhone').on('blur', function () { validatePhone($(this)); });
    $form.find('#contactType').on('change', function () { validateSelect($(this), 'Please select an inquiry type.'); });
    $form.find('#contactMessage').on('blur', function () { validateMessage($(this)); });

    // Re-validate while user is typing if field already has an error
    $form.find('input, select, textarea').on('input change', function () {
        var $el = $(this);
        if ($el.hasClass('error')) {
            var id = $el.attr('id');
            if (id === 'contactName')    validateName($el);
            if (id === 'contactEmail')   validateEmail($el);
            if (id === 'contactPhone')   validatePhone($el);
            if (id === 'contactType')    validateSelect($el, 'Please select an inquiry type.');
            if (id === 'contactMessage') validateMessage($el);
        } else {
            if ($el.val().trim()) markValid($el);
        }
    });

    // Add character counter to message textarea
    addCharCounter($form.find('#contactMessage'), 2000);

    // Handle form submission
    $form.on('submit', function (e) {
        e.preventDefault();
        var allValid = runContactValidations($form);
        if (allValid) {
            submitContactForm($form);
        } else {
            // Scroll to first error
            var $firstError = $form.find('.form-group.has-error').first();
            if ($firstError.length) {
                $('html, body').animate({ scrollTop: $firstError.offset().top - 130 }, 400);
            }
        }
    });
}

function runContactValidations($form) {
    var a = validateName($form.find('#contactName'));
    var b = validateEmail($form.find('#contactEmail'));
    var c = validatePhone($form.find('#contactPhone'));
    var d = validateSelect($form.find('#contactType'), 'Please select an inquiry type.');
    var e = validateMessage($form.find('#contactMessage'));
    return a && b && c && d && e;
}


/* FEEDBACK FORM */

function initFeedbackForm() {
    var $form = $('.main-feedback-form');

    // Validate each field on blur
    $form.find('#fbName').on('blur', function () { validateName($(this)); });
    $form.find('#fbEmail').on('blur', function () { validateEmail($(this)); });
    $form.find('#fbPhone').on('blur', function () { validatePhone($(this)); });
    $form.find('#fbProduct').on('change', function () { validateSelect($(this), 'Please select a product or service.'); });
    $form.find('#fbFeedback').on('blur', function () { validateOptionalTextarea($(this), 10, 2000); });
    $form.find('#fbSuggestions').on('blur', function () { validateOptionalTextarea($(this), 0, 1000); });

    // Re-validate on input if field has error
    $form.find('input:not([type="radio"]):not([type="checkbox"]), select, textarea').on('input change', function () {
        var $el = $(this);
        if ($el.hasClass('error')) {
            var id = $el.attr('id');
            if (id === 'fbName')        validateName($el);
            if (id === 'fbEmail')       validateEmail($el);
            if (id === 'fbPhone')       validatePhone($el);
            if (id === 'fbProduct')     validateSelect($el, 'Please select a product or service.');
            if (id === 'fbFeedback')    validateOptionalTextarea($el, 10, 2000);
            if (id === 'fbSuggestions') validateOptionalTextarea($el, 0, 1000);
        } else {
            if ($el.val().trim()) markValid($el);
        }
    });

    // Add character counters
    addCharCounter($form.find('#fbFeedback'), 2000);
    addCharCounter($form.find('#fbSuggestions'), 1000);

    // Handle form submission
    $form.on('submit', function (e) {
        e.preventDefault();
        var allValid = runFeedbackValidations($form);
        if (allValid) {
            submitFeedbackForm($form);
        } else {
            var $firstError = $form.find('.form-group.has-error').first();
            if ($firstError.length) {
                $('html, body').animate({ scrollTop: $firstError.offset().top - 130 }, 400);
            }
        }
    });
}

function runFeedbackValidations($form) {
    var a = validateName($form.find('#fbName'));
    var b = validateEmail($form.find('#fbEmail'));
    var c = validatePhone($form.find('#fbPhone'));
    var d = validateSelect($form.find('#fbProduct'), 'Please select a product or service.');
    var e = validateStarRating($form);
    var f = validateOptionalTextarea($form.find('#fbFeedback'), 10, 2000);
    var g = validateOptionalTextarea($form.find('#fbSuggestions'), 0, 1000);
    return a && b && c && d && e && f && g;
}


/*  VALIDATION FUNCTIONS */

function validateName($el) {
    var val = $el.val().trim();
    if (!val) return showError($el, 'Please enter your full name.');
    if (val.length < 2) return showError($el, 'Name must be at least 2 characters.');
    if (!/^[A-Za-z\s'.'-]+$/.test(val)) return showError($el, 'Name should only contain letters and spaces.');
    markValid($el);
    return true;
}

function validateEmail($el) {
    var val = $el.val().trim();
    if (!val) return showError($el, 'Please enter your email address.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return showError($el, 'Please enter a valid email address.');
    markValid($el);
    return true;
}

function validatePhone($el) {
    var val = $el.val().trim();
    if (!val) { markValid($el); return true; } // phone is optional
    var digits = val.replace(/[\s\-\+\(\)]/g, '');
    if (!/^\d+$/.test(digits) || digits.length < 7 || digits.length > 15) {
        return showError($el, 'Enter a valid phone number (7-15 digits). E.g. +1 234 567 8900');
    }
    markValid($el);
    return true;
}

function validateSelect($el, msg) {
    if (!$el.val()) return showError($el, msg || 'Please make a selection.');
    markValid($el);
    return true;
}

function validateMessage($el) {
    var val = $el.val().trim();
    if (!val) return showError($el, 'Please describe your requirements.');
    if (val.length < 15) return showError($el, 'Please write at least 15 characters (currently ' + val.length + ').');
    if (val.length > 2000) return showError($el, 'Message cannot exceed 2000 characters.');
    markValid($el);
    return true;
}

function validateOptionalTextarea($el, minLen, maxLen) {
    if (!$el.length) return true;
    var val = $el.val().trim();
    if (!val) { clearError($el); return true; } // optional field, empty is fine
    if (minLen > 0 && val.length < minLen) {
        return showError($el, 'Please write at least ' + minLen + ' characters (currently ' + val.length + ').');
    }
    if (val.length > maxLen) {
        return showError($el, 'Cannot exceed ' + maxLen + ' characters (currently ' + val.length + ').');
    }
    markValid($el);
    return true;
}

function validateStarRating($form) {
    var rating = $form.find('input[name="rating"]:checked').val();
    $form.find('.star-required-error').remove();
    if (!rating) {
        $form.find('.star-rating').after('<span class="star-required-error">Please select an overall star rating before submitting.</span>');
        return false;
    }
    return true;
}


/*  FIELD STATE HELPERS */

// Show red error message under a field
function showError($el, message) {
    var $group = $el.closest('.form-group');
    $el.removeClass('valid').addClass('error');
    $group.addClass('has-error');
    var $errMsg = $group.find('.error-msg');
    if (!$errMsg.length) {
        $errMsg = $('<span class="error-msg">');
        $el.after($errMsg);
    }
    $errMsg.text(message).show();
    return false;
}

// Remove error state from a field
function clearError($el) {
    var $group = $el.closest('.form-group');
    $el.removeClass('error valid');
    $group.removeClass('has-error');
    $group.find('.error-msg').hide();
}

// Show green valid state on a field
function markValid($el) {
    var $group = $el.closest('.form-group');
    $el.removeClass('error').addClass('valid');
    $group.removeClass('has-error');
    $group.find('.error-msg').hide();
}

/*   CHARACTER COUNTER */

function addCharCounter($el, maxLen) {
    if (!$el.length) return;
    var $counter = $('<span class="char-counter">').text('0 / ' + maxLen);
    $el.after($counter);

    $el.on('input', function () {
        var len = $(this).val().length;
        $counter.text(len + ' / ' + maxLen);
        $counter.removeClass('warn limit');
        if (len > maxLen * 0.9) $counter.addClass('warn');
        if (len >= maxLen) $counter.addClass('limit');
    });
}


/*  FORM SUBMISSION */

function submitContactForm($form) {
    var $btn = $form.find('.btn-submit');
    var originalText = $btn.html();

    // Disable button and show loading spinner
    $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i>Sending...');

    // Simulate server delay (1.5 seconds)
    setTimeout(function () {
        $btn.html('<i class="fas fa-check-circle me-2"></i>Message Sent!');
        $btn.css('background', 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)');

        // Show success message
        var successHtml = '<div class="alert alert-success mt-3">' +
            '<i class="fas fa-check-circle me-2" style="color:#10b981;"></i>' +
            '<strong>Thank you!</strong> We will get back to you within 24 hours.' +
            '</div>';
        $form.append(successHtml);

        // Reset form after 4.5 seconds
        setTimeout(function () {
            $form[0].reset();
            $form.find('input, select, textarea').removeClass('valid error');
            $form.find('.form-group').removeClass('has-error');
            $form.find('.error-msg').hide();
            $form.find('.char-counter').text('0 / 2000');
            $btn.prop('disabled', false).html(originalText).css('background', '');
            $form.find('.alert').fadeOut(400, function () { $(this).remove(); });
        }, 4500);

    }, 1500);
}

function submitFeedbackForm($form) {
    var $btn = $form.find('.btn-submit-feedback');
    var originalText = $btn.html();

    $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i>Submitting...');

    setTimeout(function () {
        $btn.html('<i class="fas fa-heart me-2"></i>Thank You!');
        $btn.css('background', 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)');

        var successHtml = '<div class="alert alert-success mt-4 text-center">' +
            '<i class="fas fa-check-circle fs-4 mb-2 d-block" style="color:#10b981;"></i>' +
            '<h5>Feedback Received!</h5>' +
            '<p class="mb-0">Thank you for helping us improve. We appreciate your time!</p>' +
            '</div>';
        $form.append(successHtml);

        setTimeout(function () {
            $form[0].reset();
            $('.rating-text').text('');
            $('.star-required-error').remove();
            $form.find('input, select, textarea').removeClass('valid error');
            $form.find('.form-group').removeClass('has-error');
            $form.find('.error-msg').hide();
            $form.find('.char-counter').text('0 / 2000');
            $btn.prop('disabled', false).html(originalText).css('background', '');
            $form.find('.alert').fadeOut(400, function () { $(this).remove(); });
        }, 5000);

    }, 1500);
}


/*  BROCHURE DOWNLOAD */
function downloadBrochure() {
    // Create a temporary link and click it to download the PDF
    var $link = $('<a>').attr({
        href: 'PETBot_Company_Brochure.pdf',
        download: 'PETBot_Company_Brochure.pdf'
    });
    $('body').append($link);
    $link[0].click();
    $link.remove();
    showToast('Download Starting...', 'success');
}


/*   TOAST NOTIFICATION */

function showToast(message, type) {
    var bgColor = (type === 'warning') ? '#f59e0b' : '#10b981';
    var iconClass = (type === 'warning') ? 'fa-exclamation-circle' : 'fa-check-circle';

    var $toast = $('<div class="toast-msg">').html(
        '<i class="fas ' + iconClass + ' me-2"></i>' + message
    ).css('background', bgColor);

    $('body').append($toast);

    // Remove toast after 4.5 seconds
    setTimeout(function () {
        $toast.fadeOut(400, function () {
            $(this).remove();
        });
    }, 4500);
}


/*  GALLERY LIGHTBOX */

function showImage(element) {
    var $el = $(element);
    var imgSrc = $el.find('img').attr('src');
    var imgAlt = $el.find('img').attr('alt');
    var caption = $el.find('.gallery-overlay').html();

    var $modal = $('#lightboxModal');
    if (!$modal.length || !imgSrc) return;

    // Put the clicked image into the modal
    $modal.find('#lightbox-img, .modal-body img').attr({ src: imgSrc, alt: imgAlt });
    if (caption) {
        $modal.find('#lightbox-caption').html(caption);
    }
}