// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
jQuery(document).ready(function($){
	var provider;

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
		provider = $(this).data("payroll-provider");
		console.log('Selected provider: ' + provider);
		$('.page2').hide();
		$('.page3').show();
	});

	$('.share-credentials-button').click(function(e) {
		e.preventDefault();
		//$('#payroll-email').addClass('input-error');
		var username = $('#payroll-email').val();
		var password = $('#payroll-password').val();
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
	// $('.form-control').keypress(function(e) {
	//    $('#payroll-email').removeClass('input-error');
	// });
});