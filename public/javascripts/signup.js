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
		data["sheltername"] = $("#sheltername").val();
		data["password"] = $("#password").val();
		data["phone"] = $("#phonenumber").val();
		data["email"] = $("#emailaddress").val();
		data["address"] = "";
		signup(data); 
	});

	$("#inp-signup-phone").keypress(function(e) {
		var data = {}
		data["sheltername"] = $("#sheltername").val();
		data["password"] = $("#password").val();
		data["phone"] = $("#phonenumber").val();
		data["email"] = $("#emailaddres").val();
		data["address"] = "";
		if (e.keyCode === 13) {
			signup(data); 
		}
	});

});