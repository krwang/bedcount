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

	$("#btn-settings").click(function(event) {
		$.ajax({
			url: "/shelter",
			type: "GET",
			success: function(data) {
				if (data.success) {
					console.log(data.shelter);
					var shelter = data.shelter;
					var beds = data.shelter.beds;
					$("#bed-view").addClass("hidden");
					$("#settings-shelterName").val(shelter.shelterName);
					$("#settings-address").val(shelter.address);
					$("#settings-phone").val(shelter.phoneNumber);
					$("#settings-availableMale").val(beds.numberMale);
					$("#settings-availableFemale").val(beds.numberFemale);
					$("#settings-availableNeutral").val(beds.numberNeutral);
					$("#account-settings").removeClass("hidden");
				}
				else {
					alert(data.info);
				}
			}
		});
	});

	$("#btn-homepage").click(function() {
		window.location.href = "/bedcount/homepage";
	});

});