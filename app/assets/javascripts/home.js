// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
jQuery(document).ready(function($){
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
		$('.page2').hide();
		$('.page3').show();
	});

	$('.share-credentials-button').click(function(e) {
		e.preventDefault();
		// TODO:
		// 1. Add AJAX call to save information (provider, credentials)
		// 2. Show loading icon and freeze actions until we get a response
		$('.page3').hide();
		$('.page4').show();
	});
});