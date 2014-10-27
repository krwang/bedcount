$(document).ready(function() {

	var login = function(sheltername, password) {
		$.ajax({
			url: "/login",
			type: "POST",
			data: {
				sheltername: sheltername,
				password: password
			},
			dataType: "json",
			success: function(data) {
				if (data.success) {
					window.location.href = data.url;
				}
				else {
					$("#error-message").text('Invalid login');
				}
			}
		});
	}

	$("#login").click(function() {
		var sheltername = $("#sheltername").val();
		var password = $("#password").val();
		login(sheltername, password);
	});

	$("#password").keypress(function(e) {
		var sheltername = $("#sheltername").val();
		var password = $("#password").val();
		if (e.keyCode === 13) {
			login(sheltername, password);
		}
	});
});