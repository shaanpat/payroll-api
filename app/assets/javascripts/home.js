// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
jQuery(document).ready(function($){
	var provider;

	var providerPreferences = {
		"adp": {
			identity: "Username"
		},
		"workday": {
			identity: "Email"
		},
		"gusto": {
			identity: "Email"
		},
		"paylocity": {
			identity: "Username"
		},
		"paycom": {
			identity: "Username"
		},
		"paychex": {
			identity: "Email"
		},
		"sap": {
			identity: "Email"
		},
		"intuit": {
			identity: "Username"
		},
		"oracle": {
			identity: "Username"
		},
		"ultimate": {
			identity: "Email"
		},
		"ceridian": {
			identity: "Email"
		},
		"square": {
			identity: "Username"
		},
	};
	var allProviders = Object.keys(providerPreferences);

	console.log('Ready');
	$('.page2').hide();
	$('.page3').hide();
	$('.page4').hide();

	$('.continue-button').click(function() {
		$('.page1').hide();
		$('.page2').show();
	});

	$('.payroll-provider').click(function(e) {
		e.preventDefault();
		// Lookup provider
		provider = $(this).data("payroll-provider");
		console.log('Selected provider: ' + provider);
		// Change username/email input placeholder based on provider
		var identity = providerPreferences[provider]["identity"]
		$('#payroll-email').attr('placeholder', identity);
		// Change image displayed
		$('.payroll-provider-selected-icon').hide();
		$('.' + provider).show();
		// Change style of page
		$('.share-credentials-button').removeClass(allProviders.join(' ')).addClass(provider);
		// Transition to next page
		$('.page2').hide();
		$('.page3').show();
	});

	$('.share-credentials-button').click(function(e) {
		e.preventDefault();

		var username = $('#payroll-email').val();
		var password = $('#payroll-password').val();
		if (!username) {
			$('#payroll-email').addClass('input-error');
			return;
		} else if (!password) {
			$('#payroll-password').addClass('input-error');
			return;
		}

		// Show loading
		$.ajax({ url: '/accounts',
		  type: 'POST',
		  beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
		  data: {account: {username: username, provider: provider}},
		  success: function(data, status, jqXHR) {
		    console.log(data);
		    // TODO:
		    // Stop loading
		    $('.page3').hide();
			$('.page4').show();
		  },
		  error: function(jqXHR, status, err) {
			// TODO:
			// Stop loading
			// Display the error
			console.log(err);
		  }
		});
	});

	$('.back-1').click(function(e) {
		e.preventDefault();
		$('.page2').hide();
		$('.page1').show();
	})

	$('.back-2').click(function(e) {
		e.preventDefault();
		$('.page3').hide();
		$('.page2').show();
	})

	// https://codepen.io/vineethtr/pen/LAEyw/
	$('.form-control').keypress(function(e) {
		$('#payroll-email').removeClass('input-error');
		$('#payroll-password').removeClass('input-error');
	});
});