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

	$("#btn-signup").click(function() {
		window.location.href = "/signup";
	});

	$("#btn-login").click(function() {
		var sheltername = $("#inp-login-name").val();
		var password = $("#inp-login-password").val();
		login(sheltername, password);
	});

	$("#inp-login-password").keypress(function(e) {
		var sheltername = $("#inp-login-name").val();
		var password = $("#inp-login-password").val();
		if (e.keyCode === 13) {
			login(sheltername, password);
		}
	});
});