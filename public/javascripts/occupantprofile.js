$(document).ready(function() {
	var person;


	var initPage = function(occupantName) {
		$.ajax({
			url: "/shelter/occupant/"+occupantName,
			type: "GET",
			success: function(data) {
				if (data.success) {
					loadData(data.occupant);
				}
				else {
					console.log("Error");
				}
			}
		})
	}

	initPage(document.getElementById("name").innerHTML);

	var loadData = function(occupant) {
		person = occupant;
		$("#name").text(occupant.name);
		$("#age").text(occupant.age + " years old");
		if (occupant.daysLeft > 0) {
			$("#location").text("current Location: " + occupant.currentLoc.shelterName + " (" + occupant.daysLeft + " days left)");
		}
		for (var comment in occupant.comments) {
			addCommentToList(occupant.comments[comment]);
		}
	}

	var addCommentToList = function(comment) {
		var listItem = document.createElement('li');
		listItem.innerHTML = comment;
		$("#commentList").append(listItem);		
	}

	var sendComment = function(comment, person) {
		$.ajax({
			url: "/shelter/comment",
			type: "POST",
			data: {
				occupant: person.name,
				comment: comment
			},
			success: function(data) {
				if (data.success) {
					addCommentToList(comment);
				}
				else {
					console.log(data.info);
				}
			}
		});
	}

	$("#commentButton").click(function() {
		sendComment($("#comment").val(), person);
	});

	$("#comment").keypress(function(e) {
		if (e.keyCode === 13) {
			sendComment($("#comment").val(), person);
		}
	});

});