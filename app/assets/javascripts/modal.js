$(document).on('turbolinks:load', function() {
	var currentPage;
	var selectedProvider;

	// CONSTANTS
	var providerPreferences = {
		"adp": { identity: "User ID", displayName: "ADP" },
		"workday": { identity: "Email", displayName: "Workday" },
		"gusto": { identity: "Email", displayName: "Gusto" },
		"paylocity": { identity: "Username", displayName: "Paylocity" },
		"paycom": { identity: "Username", displayName: "Paycom" },
		"paychex": { identity: "Username", displayName: "Paychex" },
		"sap": { identity: "User", displayName: "SAP" },
		"intuit": { identity: "Email", displayName: "Intuit" },
		"oracle": { identity: "User ID", displayName: "Oracle" },
		"ultimate": { identity: "Email", displayName: "Ultimate" },
		"ceridian": { identity: "Username", displayName: "Ceridian" },
		"trinet": { identity: "Employee ID", displayName: "TriNet" },
		"kronos": { identity: "Username", displayName: "Kronos" },
		"sure-payroll": { identity: "Username", displayName: "Sure Payroll" },
		"namely": { identity: "Email", displayName: "Namely" },
		"justworks": { identity: "Username", displayName: "Justworks" },
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
		currentPage = 'security';
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
		currentPage = 'select-provider';
		logEvent('confirm-security', 'signup');
	});

	$('.payroll-provider').click(function(e) {
		e.preventDefault();
		// Lookup provider
		selectedProvider = $(this).data("payroll-provider");
		console.log('Selected provider: ' + selectedProvider);
		// Change username/email input placeholder based on provider
		var identity = providerPreferences[selectedProvider]["identity"];
		var displayName = providerPreferences[selectedProvider]["displayName"];
		$('#payroll-email').attr('placeholder', identity);
		$('.displayName').text(displayName);
		// Change image displayed
		$('.payroll-provider-selected-icon').hide();
		$('.' + selectedProvider).show();
		// Change style of page
		$('.share-credentials-button').removeClass(allProviders.join(' ')).addClass(selectedProvider);
		// Transition to next page
		$('.select-provider-page').hide();
		$('.signin-page').show();
		currentPage = 'signin';
		logEvent('select-provider', 'signup', selectedProvider);
	});

	$('.share-credentials-button').click(function(e) {
		e.preventDefault();
		shareCredentials();
	});

	function shareCredentials() {
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
		  data: {account: {username: username, provider: selectedProvider, password: password}},
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
		  		currentPage = 'confirmation';
		  		logEvent('share-credentials', 'signup', 'success');
		  	}
		  },
		  error: function(jqXHR, status, err) {
			// TODO: Display the error
			console.log(err);
		  }
		});
	}

	$('.share-other-credentials-button').click(function(e) {
		e.preventDefault();
		shareOtherCredentials();
	});	

	function shareOtherCredentials() {
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
		  		currentPage = 'confirmation';
		  		logEvent('share-other-credentials', 'signup', 'success');
		  	}
		  },
		  error: function(jqXHR, status, err) {
			// TODO: Display the error
			console.log(err);
		  }
		});
	}

	// Remove error message once the user starts typing again
	$('.form-control').keypress(function(e) {
		$('#payroll-email').removeClass('input-error');
		$('#payroll-password').removeClass('input-error');
	});

	$(document).on('keypress',function(e) {
	    if(e.which == 13) {
	    	if (currentPage == 'signin') {
	    		shareCredentials();
	    	} else if (currentPage == 'signin-other') {
	    		shareOtherCredentials();
	    	}
	    }
	});

	$('.back-to-security').click(function(e) {
		e.preventDefault();
		$('.select-provider-page').hide();
		$('.security-page').show();
		currentPage = 'security';
	});

	$('.back-to-provider').click(function(e) {
		e.preventDefault();
		$('.signin-page').hide();
		$('.select-provider-page').show();
		currentPage = 'select-provider';
	});

	$('.back-to-provider-other').click(function(e) {
		e.preventDefault();
		$('.signin-other-page').hide();
		$('.select-provider-page').show();
		currentPage = 'select-provider';
	});

	$('.select-other-payroll-provider').click(function(e) {
		e.preventDefault();
		$('.select-provider-page').hide();
		$('.signin-other-page').show();
		currentPage = 'signin-other';
		logEvent('select-provider', 'signup', 'other');
	});
});