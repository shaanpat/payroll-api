$(document).on('turbolinks:load', function() {
	var selectedProvider;

	// CONSTANTS
	var providerPreferences = {
		"adp": { identity: "ADP Username" },
		"workday": { identity: "Work Email" },
		"gusto": { identity: "Work Email" },
		"paylocity": { identity: "Paylocity Username" },
		"paycom": { identity: "Paycom Username" },
		"paychex": { identity: "Work Email" },
		"sap": { identity: "Work Email" },
		"intuit": { identity: "Intuit Username" },
		"oracle": { identity: "Oracle Username" },
		"ultimate": { identity: "Work Email" },
		"ceridian": { identity: "Work Email" },
		"trinet": { identity: "Trinet Username" },
		"kronos": { identity: "Kronos Username" },
		"sure-payroll": { identity: "Work Email" },
		"namely": { identity: "Work Email" },
		"justworks": { identity: "Justworks Username" },
	};
	var allProviders = Object.keys(providerPreferences);

	function logEvent(eventName, eventCategory, eventLabel, eventValue) {
		gtag('event', eventName, {
		  'event_category': eventCategory,
		  'event_label': eventLabel,
		  'value': eventValue
		});
	}

	// LAUNCH
	function resetPages() {
		$('.security-page').show();
		$('.select-provider-page').hide();
		$('.signin-page').hide();
		$('.signin-other-page').hide();
		$('.confirmation-page').hide();
	}

	$('.block-button').click(function() {
		resetPages();
		logEvent('start', 'signup', 'header button');
	});

	$('.splash-button').click(function() {
		resetPages();
		logEvent('start', 'signup', 'main button');
	});

	// TRANSITIONS
	$('.continue-button').click(function() {
		$('.security-page').hide();
		$('.select-provider-page').show();
		logEvent('confirm-security', 'signup');
	});

	$('.payroll-provider').click(function(e) {
		e.preventDefault();
		// Lookup provider
		selectedProvider = $(this).data("payroll-provider");
		console.log('Selected provider: ' + selectedProvider);
		// Change username/email input placeholder based on provider
		var identity = providerPreferences[selectedProvider]["identity"]
		$('#payroll-email').attr('placeholder', identity);
		// Change image displayed
		$('.payroll-provider-selected-icon').hide();
		$('.' + selectedProvider).show();
		// Change style of page
		$('.share-credentials-button').removeClass(allProviders.join(' ')).addClass(selectedProvider);
		// Transition to next page
		$('.select-provider-page').hide();
		$('.signin-page').show();
		logEvent('select-provider', 'signup', selectedProvider);
	});

	$('.share-credentials-button').click(function(e) {
		e.preventDefault();

		logEvent('share-credentials', 'signup', 'attempt');

		// Lookup username & password
		var username = $('#payroll-email').val();
		var password = $('#payroll-password').val();
		// Verify a username & password were entered
		if (!username) {
			$('#payroll-email').addClass('input-error');
			return;
		} else if (!password) {
			$('#payroll-password').addClass('input-error');
			return;
		}

		// Submit data to servers
		$.ajax({ url: '/accounts',
		  type: 'POST',
		  beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
		  data: {account: {username: username, provider: selectedProvider}},
		  success: function(data, status, jqXHR) {
		  	if (data.errors) {
		  		if (data.errors.username) {
		  			$('#payroll-email').addClass('input-error');
		  		} else if (data.errors.password) {
		  			$('#payroll-password').addClass('input-error');
		  		}
		  	} else {
		  		$('.signin-page').hide();
		  		$('.confirmation-page').show();
		  		logEvent('share-credentials', 'signup', 'success');
		  	}
		  },
		  error: function(jqXHR, status, err) {
			// TODO: Display the error
			console.log(err);
		  }
		});
	});

	$('.share-other-credentials-button').click(function(e) {
		e.preventDefault();

		logEvent('share-other-credentials', 'signup', 'attempt');

		// Lookup username & password
		var provider = $('#other-payroll-provider').val();
		var username = $('#other-payroll-email').val();
		var password = $('#other-payroll-password').val();
		// Verify a username & password were entered
		if (!provider) {
			$('#other-payroll-provider').addClass('input-error');
			return;
		} else if (!username) {
			$('#other-payroll-email').addClass('input-error');
			return;
		} else if (!password) {
			$('#other-payroll-password').addClass('input-error');
			return;
		}

		// Submit data to servers
		$.ajax({ url: '/accounts',
		  type: 'POST',
		  beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
		  data: {account: {username: username, provider: provider}},
		  success: function(data, status, jqXHR) {
		  	if (data.errors) {
		  		if (data.errors.provider) {
		  			$('#other-payroll-provider').addClass('input-error');
		  		} else if (data.errors.username) {
		  			$('#other-payroll-email').addClass('input-error');
		  		} else if (data.errors.password) {
		  			$('#other-payroll-password').addClass('input-error');
		  		}
		  	} else {
		  		$('.signin-other-page').hide();
		  		$('.confirmation-page').show();
		  		logEvent('share-other-credentials', 'signup', 'success');
		  	}
		  },
		  error: function(jqXHR, status, err) {
			// TODO: Display the error
			console.log(err);
		  }
		});
	});

	// Remove error message once the user starts typing again
	$('.form-control').keypress(function(e) {
		$('#payroll-email').removeClass('input-error');
		$('#payroll-password').removeClass('input-error');
	});

	$('.back-to-security').click(function(e) {
		e.preventDefault();
		$('.select-provider-page').hide();
		$('.security-page').show();
	});

	$('.back-to-provider').click(function(e) {
		e.preventDefault();
		$('.signin-page').hide();
		$('.select-provider-page').show();
	});

	$('.back-to-provider-other').click(function(e) {
		e.preventDefault();
		$('.signin-other-page').hide();
		$('.select-provider-page').show();
	});

	$('.select-other-payroll-provider').click(function(e) {
		e.preventDefault();
		$('.select-provider-page').hide();
		$('.signin-other-page').show();
		logEvent('select-provider', 'signup', 'other');
	});
});