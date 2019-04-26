$(document).on('turbolinks:load', function() {
	var selectedProvider;

	// CONSTANTS
	var providerPreferences = {
		"adp": { identity: "Username" },
		"workday": { identity: "Email" },
		"gusto": { identity: "Email" },
		"paylocity": { identity: "Username" },
		"paycom": { identity: "Username" },
		"paychex": { identity: "Email" },
		"sap": { identity: "Email" },
		"intuit": { identity: "Username" },
		"oracle": { identity: "Username" },
		"ultimate": { identity: "Email" },
		"ceridian": { identity: "Email" },
		"square": { identity: "Username" },
	};
	var allProviders = Object.keys(providerPreferences);

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
	});

	$('.splash-button').click(function() {
		resetPages();
	});

	// TRANSITIONS
	$('.continue-button').click(function() {
		$('.security-page').hide();
		$('.select-provider-page').show();
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
	});

	$('.share-credentials-button').click(function(e) {
		e.preventDefault();

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
	});
});