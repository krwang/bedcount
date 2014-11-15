$(document).ready(function() {

	var signup = function(data) {
		$.ajax({
			url: "/signup",
			type: "POST",
			data: {
				sheltername: data.sheltername,
				password: data.password,
				phone: data.phone,
				email: data.email
			},
			dataType: "json",
			success: function(data) {
				console.log(data);
				if (data.success) {
					window.location.href = data.url;
				}
				else {
					$("#error-message").text(data.info);
				}
			}
		});
	}

	$("#btn-login").click(function() {
		window.location.href = "/login";
	});

	$("#btn-signup").click(function() {
		var data = {};
		data["sheltername"] = $("#inp-signup-sheltername").val();
		data["password"] = $("#inp-signup-password").val();
		data["phone"] = $("#inp-signup-phone").val();
		data["email"] = $("#inp-signup-email").val();
		data["address"] = "";
		console.log(data);
		signup(data); 
	});

	$("#inp-signup-phone").keypress(function(e) {
		var data = {}
		data["sheltername"] = $("#inp-signup-sheltername").val();
		data["password"] = $("#inp-signup-password").val();
		data["phone"] = $("#inp-signup-phone").val();
		data["email"] = $("#inp-signup-email").val();
		data["address"] = "";
		if (e.keyCode === 13) {
			signup(data); 
		}
	});

});