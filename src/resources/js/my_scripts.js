var dataStorage;

function getInfo() {

	let input = document.getElementById("002").value;

	//console.log("Input is: " + input);

	var url = `https://api.tvmaze.com/search/shows?q=${input}}`;
	$.ajax({url:url, dataType:"json"}).then(data => {
		//console.log(data);
		dataStorage = data;

		displayData();
	});
}

function printData(){
	//console.log(dataStorage);
}

function displayData() {
	if(dataStorage.length != 0){

		document.getElementById("commitBTN").disabled = false;

		document.getElementById("noQuery").innerHTML = "";
		let counter = 1;

		document.getElementById("slot1").innerHTML = "";
		document.getElementById("slot2").innerHTML = "";
		document.getElementById("slot3").innerHTML = "";
		document.getElementById("slot4").innerHTML = "";
		document.getElementById("slot5").innerHTML = "";

		dataStorage.forEach(show => {
			if (counter <= 5) {

				condenserString = "";

				//console.log(show.show.name);

				let finRating = show.show.rating.average != null ? show.show.rating.average : '--';

				let imgURL = "";

				if (show.show.image != null){
					imgURL = show.show.image.medium != null ? show.show.image.medium : '';
				}
				let showName = show.show.name != null ? show.show.name : '--';
				let summary = show.show.summary != null ? show.show.summary : '--';
				let showURL = show.show.url != null ? show.show.url : '';

				condenserString += `<div class="card" style="width: auto;">`
				
				if (imgURL == "") {
					condenserString += `<img class="card-img-top" src="https://static.tvmaze.com/images/no-img/no-img-portrait-text.png">`
				} else {
					condenserString += `<img class="card-img-top" src="${imgURL}">`
				}
				
				let showGenres = "--";

				if (show.show.genres.length != 0){

					showGenres = "";

					for (let i = 0; i < show.show.genres.length; i++){
						showGenres += show.show.genres[i] + ", ";
					}

					showGenres = showGenres.slice(0, -2);
				} else {
					showGenres == "--"
				}

				condenserString += `<div class="card-body"> <h5 class="card-title">${showName}</h5>`
				condenserString += `<div class="card-body"> <h5>Rating: ${finRating}</h5>`
				condenserString += `<p class="card-text"><b>Genres: </b> ${showGenres}</p>`
				condenserString += `<p class="card-text">${summary}</p>`

				if (showURL == "") {
					condenserString += `<a href="" class="btn btn-primary" aria-disabled="true">Unavailable</a> </div> </div>`
				} else {
					condenserString += `<a href="${showURL}" class="btn btn-primary">More Details</a> </div> </div>`
				}

				document.getElementById(`slot${counter}`).innerHTML = condenserString;

				console.log(counter);
				counter++;
			}
		});

	} else {

		document.getElementById("commitBTN").disabled = true;

		//console.log("NO RESULTS");

		document.getElementById("slot1").innerHTML = "";
		document.getElementById("slot2").innerHTML = "";
		document.getElementById("slot3").innerHTML = "";
		document.getElementById("slot4").innerHTML = "";
		document.getElementById("slot5").innerHTML = "";

		document.getElementById("noQuery").innerHTML = `<p style="margin: auto; color: #999999"><i class="fa fa-times" aria-hidden="true"></i> No results. -- Enter query to search.</p>`;
	}
}

function killTheReporter() {
	document.getElementById('nothingHere').innerHTML = "";
}

function commitToDB () {

	let commitCounter = 0;

	dataStorage.forEach(show => {
		if (commitCounter < 5){
			let finRating = show.show.rating.average != null ? show.show.rating.average : 'null';
			let imgURL = "";
			if (show.show.image != null){
				imgURL = show.show.image.medium != null ? show.show.image.medium : '';
			} else {
				imgURL = "https://static.tvmaze.com/images/no-img/no-img-portrait-text.png";
			}
			let showName = show.show.name != null ? show.show.name : '--';
			let summary = show.show.summary != null ? show.show.summary : '--';
			let showURL = show.show.url != null ? show.show.url : '';
			
			let showGenres = show.show.genres;

			
			console.log(showName);
			console.log(imgURL);
			console.log(finRating);
			console.log(showGenres);
			console.log(showURL);

			insertIntoDB(showName, imgURL, finRating, summary, showGenres, showURL);

			commitCounter++;
		}
	});
}

function insertIntoDB(currTitle, currImgURL, currRating, currSummary, currGenres, currLinkURL) {
	$.ajax({url:'/addToDB', type:"POST", data:{
        title: currTitle,
        imgURL: currImgURL,
		rating: currRating,
        summary: currSummary,
		genre: currGenres,
		linkURL: currLinkURL
    }}).then(data => {
        window.location.href = "/home";
    }).catch(error => {
        //console.log("ERROR: " + error);
    });
}
