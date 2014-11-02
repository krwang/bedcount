$(document).ready(function() {

	$("#btn-logout").click(function() {
		$.ajax({
			url: "/logout",
			type: "POST",
			success: function(data) {
				if (data.success) {
					window.location.href = data.url;
				} else {
					$("#error-message").text(data.info);
				}
			}
		})
	});

	$("#btn-settings").click(function() {
		$.ajax({
			url: "/shelter",
			type: "GET",
			success: function(data) {
				if (data.success) {
					promptSettings(data.shelter);
				} else {
					$("#error-message").text(data.info);
				}
			}
		});
	});

	$("#btn-homepage").click(function() {
		window.location.href = "/bedcount/homepage";
	});

});