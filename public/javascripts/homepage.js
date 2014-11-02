$(document).ready(function() {
	var table = document.getElementById('bed-table').getElementsByTagName('tbody')[0];

	var insertBedToTable = function(bed) {
		var row = table.insertRow(-1);
		row.className += " bed-row";
		var bedName = row.insertCell(0);
		bedName.innerHTML = bed.name;
		var bedType = row.insertCell(1);
		bedType.innerHTML = bed.type;
		var occupant = row.insertCell(2);
		occupantLink = document.createElement('a');
		occupantLink.innerHTML = bed.occupant.name;
		occupantLink.setAttribute("href", "/bedcount/occupantprofile?name=" + bed.occupant.name);
		occupant.appendChild(occupantLink);
		var daysLeft = row.insertCell(3);
		daysLeft.innerHTML = bed.occupant.daysLeft;
		var notInTonight = row.insertCell(4);
		notInTonight.innerHTML = bed.occupant.notInDays;
	}

	var updateBed = function(bedName, occupantName, occupantAge, stayDuration, notInTonight) {
		console.log(bedName);
		$.ajax({
			url: "/shelter/beds/"+bedName,
			type: "PUT",
			data: {
				occupantName: occupantName,
				occupantAge: occupantAge,
				stayDuration: stayDuration,
				notInTonight: notInTonight
			},
			success: function(data) {
				console.log(data.unit);
			}
		})
	}

	var addbed = function(gender, name) {
		$.ajax({
			url: "/shelter/beds/"+name,
			type: "POST",
			data: {
				gender: gender
			},
			success: function(data) {
				if (data.success) {
					insertBedToTable(data.bed);
				} else {
					bootbox.alert(data.info);
				}
			}
		});
	}

	var getBeds = function() {
		$.ajax({
			url: "/shelter/beds",
			type: "GET",
			dataType: "json",
			success: function(data) {
				console.log(data);
				if (data.success) {
					for (var bed in data.beds.beds) {
						insertBedToTable(data.beds.beds[bed]);
					}
				}
			}
		});
	}();

	var promptSettings = function(shelter) {
		bootbox.dialog({
			title: "Edit Shelter Settings",
			message: '<form id="formAddUser" name="adduser" method="post" action="/shelter/features">' +
      				 'Shelter Address: <input id="address" type="text" name="address" value="' + shelter.address + '" autofocus></input><br>' +
      				 'Available Male Beds: <input id="maleBeds" type="number" name="numberMale" value="' + shelter.beds.numberMale + '" autocomplete="off" min="0"></input><br>' +
      				 'Available Female Beds: <input id="femaleBeds" type="number" name="numberFemale" value="' + shelter.beds.numberFemale + '" autocomplete="off" min="0"></input><br>' +
      				 'Available Gender Neutral Beds: <input id="neutralBeds" type="number" name="numberNeutral" value="' + shelter.beds.numberNeutral + '" autocomplete="off" min="0"></input><br>' +
					 '</form>',
			buttons: {
				success: {
					label: "Save",
					callback: function() {				
						sendFeatures($("#address").val(), $("#maleBeds").val(), $("#femaleBeds").val(), $("#neutralBeds").val());
					}
				}
			}
		});		
	}

	var sendFeatures = function(address, maleBeds, femaleBeds, neutralBeds) {
		$.ajax({
			url: "/shelter/features",
			type: "POST",
			data: {
				address: address,
				numberMale: maleBeds,
				numberFemale: femaleBeds,
				numberNeutral: neutralBeds
			},
			success: function(data) {
				if (data.success) {
					$("#numberMale").text("Male - " + $("#maleBeds").val());
					$("#numberFemale").text("Female - " + $("#femaleBeds").val());
					$("#numberNeutral").text("Neutral - " + $("#neutralBeds").val());		
				}
			}
		});
	}

	$(document).click(function(event) {
		$(".selected").children(".button").remove();
		$(".selected").toggleClass("selected");
		// document.getElementById("bed-table").style.width = "80%";
		// $("td").width = "20%";
	});

	$("table tbody").click(function(event) {
		if (event.target.tagName === "TD") {
			event.stopPropagation();
			$(".selected").children(".button").remove();
			$(".selected").toggleClass("selected");
			event.target.parentNode.className += " selected";
			// document.getElementById("bed-table").style.width = "88.5%";
			// $("td").width = "16.6666666666%";
			var updateButton = document.createElement("button");
			updateButton.innerHTML = "Update";
			updateButton.className += " button";
			updateButton.addEventListener('click', function(e) {
				e.stopPropagation();
				$.ajax({
					url: "/shelter/beds/"+name,
					type: "GET",
					success: function(data) {
						if (data.success) {
							for (var i = 0, cell; cell = e.target.parentNode.cells[i]; i++) {
								if (i == 2) {
									var currentValue = cell.children[0].innerHTML;
								}
								else {
									var currentValue = cell.innerHTML;
								}
								cell.innerHTML = '';
								var input = document.createElement("input");
								input.type = "text";
								input.value = currentValue;
								cell.appendChild(input);
							}
							$(".selected").children(".button").remove();
							var saveButton = document.createElement("button");
							saveButton.innerHTML = "Save";
							saveButton.className += " button";
							saveButton.addEventListener('click', function(ev) {
								ev.stopPropagation();
								var newData = [];
								for (var i = 0, cell; cell = event.target.parentNode.cells[i]; i++) {
									var inputValue = cell.children[0].value;
									newData.push(inputValue);
									cell.removeChild(cell.children[0]);
									if (i == 2) {
										occupantLink = document.createElement('a');
										occupantLink.innerHTML = inputValue;
										occupantLink.setAttribute("href", "/bedcount/occupantprofile?name=" + inputValue);
										cell.appendChild(occupantLink);
									}
									else {
										cell.innerHTML = inputValue;
									}
								}
								updateBed(newData[0], newData[2], 20, newData[3], newData[4]);
								$(".selected").children(".button").remove();
							});
							event.target.parentNode.appendChild(saveButton);
						}
					}
				});
			});
			event.target.parentNode.appendChild(updateButton);
		}
	});

	$("#btn-addbed").click(function() {
		bootbox.dialog({
			title: "Add a new bed.",
			message: 'Bed type: <input type="radio" id="gender_male" name="gender" value="male" checked>Male</input>' +
                	 '<input type="radio" id="gender_female" name="gender" value="female">Female</input>' +
                	 '<input type="radio" id="gender_neutral" name="gender" value="neutral">Gender Neutral</input><br>' +
      				 'Bed ID: <input type="text" id="bedId" name="id" autofocus></input><br>',
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

});