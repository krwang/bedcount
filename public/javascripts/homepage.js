$(document).ready(function() {
	var table = document.getElementById('bed-table');

	var insertBedToTable = function(bed) {
		var row = table.insertRow(0);
		var bedName = row.insertCell(0);
		bedName.innerHTML = bed.name;
		var bedType = row.insertCell(1);
		bedType.innerHTML = "(" + bed.type + ")";
		var colon = row.insertCell(2);
		colon.innerHTML = ":";
		var occupant = row.insertCell(3);
		occupantLink = document.createElement('a');
		occupantLink.innerHTML = bed.occupant.name;
		occupantLink.setAttribute("href", "/bedcount/occupantprofile?name=bed.occupant.name");
		occupant.appendChild(occupantLink);

		var updateButtonCell = row.insertCell(4);
		var updateButton = document.createElement("button");
		updateButton.innerHTML = "Update";
		updateButton.addEventListener('click', function(event) {
			var rowIndex = document.elementFromPoint(event.x, event.y).parentNode.parentNode.rowIndex;
			console.log(rowIndex);
			console.log(table.rows[0]);
			var name = table.rows[rowIndex].cells[0].innerText;
			$.ajax({
				url: "/shelter/bed",
				type: "GET",
				data: {
					name: name
				},
				success: function(data) {
					console.log(data);
					console.log(data.unit.occupant.name);
					if (data.success) {
						bootbox.dialog({
							title: "Update bed",
							message: '<form id="updateBedForm" name="addBed" method="POST" action="/shelter/updatebed">' +
			      					 'Bed Name: <input type="text" id="bedName" name="name" value=' + name + '></input><br>' +
			      					 'Occupant Name: <input type="text" id="occupantName" name="occupantName" value="' + data.unit.occupant.name + '" autofocus></input><br>' +
			      					 'Occupant Age: <input type="number" id="occupantAge" name="occupantAge" min="0" value=' + data.unit.occupant.age + '></input><br>' +
			      					 'Duration of Stay: <input type="number" id="stayDuration" name="stayDuration" min="0" max="14" value=' + data.unit.occupant.daysLeft + '></input><br>' +
			      					 'Not In Tonight: <input type="checkbox" id="notInTonight" name="notInTonight"></input><br>' +
								     '</form>',
							buttons: {
								// cancel: {
								// 	label: "Cancel",
								// },
								success: {
									label: "Save",
									callback: function() {
										console.log("UPDATED");
										console.log($("#bedName").val());
										updateBed($("#bedName").val(), $("#occupantName").val(), $("#occupantAge").val(), $("#stayDuration").val(), $("#notInTonight").val(), rowIndex);
									}
								}
							}
						});
					}
				}
			});
		});
		updateButtonCell.appendChild(updateButton);
	}

	var updateBed = function(bedName, occupantName, occupantAge, stayDuration, notInTonight, rowIndex) {
		$.ajax({
			url: "/shelter/bed",
			type: "PUT",
			data: {
				name: bedName,
				occupantName: occupantName,
				occupantAge: occupantAge,
				stayDuration: stayDuration,
				notInTonight: notInTonight
			},
			success: function(data) {
				if (data.success) {
					var occupantLink = table.rows[rowIndex].cells[3].children[0];
					occupantLink.innerHTML = data.unit.occupant.name;
					occupantLink.setAttribute("href", "/bedcount/occupantprofile?name=data.bed.occupant.name");
				}
				else {
					bootbox.alert(data.info);
				}
			}
		})
	}

	var addbed = function(gender, id) {
		$.ajax({
			url: "/shelter/bed",
			type: "POST",
			data: {
				id: id,
				gender: gender
			},
			success: function(data) {
				if (data.success) {
					insertBedToTable(data.bed);
					// window.location.href = data.url;
				}
				else {
					bootbox.alert(data.info);
				}
			}
		});
	}

	var getBeds = function() {
		$.ajax({
			url: "/shelter/get_beds",
			type: "POST",
			dataType: "json",
			success: function(data) {
				if (data.success) {
					for (var bed in data.beds.beds) {
						insertBedToTable(data.beds.beds[bed]);
					}
				}
			}
		});
	}();

	$("#addbed").click(function() {
		bootbox.dialog({
			title: "Add a new bed.",
			message: '<form id="addBedForm" name="addBed" method="post" action="/shelter/bed">' +
      				 'Bed type: <input type="radio" id="gender_male" name="gender" value="male" checked>Male</input>' +
                	 '<input type="radio" id="gender_female" name="gender" value="female">Female</input>' +
                	 '<input type="radio" id="gender_neutral" name="gender" value="neutral">Gender Neutral</input><br>' +
      				 'Bed ID: <input type="text" id="bedId" name="id" autofocus></input><br>' +
    				 '</form>',
    		buttons: {
    			success: {
    				label: "Save",
    				callback: function() {
    					var checked = $("#gender_male").val();
    					if ($("#gender_female").is(":checked")) {
    						checked = $("#gender_female").val();
    					}
    					if ($("#gender_neutral").is(":checked")) {
    						checked = $("#gender_neutral").val();
    					}
    					var id = $("#bedId").val();
    					addbed(checked, id);
    				}
    			}
    		}
		});
	});

	$("#logout").click(function() {
		console.log("Logging out");
		$.ajax({
			url: "/logout",
			type: "POST",
			success: function(data) {
				if (data.success) {
					window.location.href = data.url;
				}
				else {
					$("#error-message").text("Something went wrong");
				}
			}
		});
	});

});