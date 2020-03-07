/*Configuration*/
var api = 'helix'; //New Twitch API. V5 is depreciated.
var client_id = 'xo5ahtyvlvs6j24ni40717bvs4e5ck'; //
var user = '38185373';  //user ID //
var timeToCheckLive = '30000'; //every 30s //TODO : timer 30s peut etre changer
var timeToResetNotifs = '10800000'; //every 3 hours //TODO : timer 3h peut etre changer
/**************************************************/

let stateNotif = "waitNotif";
let notif;


checkStream(user, client_id, api, false);
 
var check = setInterval(function(){ //background task to get the status of the livestream
	checkStream(user, client_id, api, true);
}, timeToCheckLive );

var resetNotif = setInterval(function(){ //reset notifications every 10h
	stateNotif = "waitNotif";
}, timeToResetNotifs );


function checkStream(user, client_id, api, notification){

	$.ajax({
		type: "GET",
		beforeSend: function(request) {
		  request.setRequestHeader("Client-Id", client_id);
		},
		url: "https://api.twitch.tv/"+api+"/streams?user_id="+user,
		processData: false,
		success: function(response) {
			var data = response.data[0]; 
			if(typeof data == "undefined"){
				//Fuze is not streaming
				stateNotif = "waitNotif";
				$('.msgOffline').show();
				$('#thirdWordStatusLink').html("[HORS LIGNE]");	// TODO : possibiliter de changer [HORS LIGNE]
				$('#thirdWordStatusLink').css('color', 'red');
				$('.viewerBox').hide(); 
				$('.titleBox').hide(); 
				$('.gameBox').hide();
				chrome.browserAction.setIcon({path: "img/icon-off-64.png"}); // TODO : changer Icone Stream OFF
				
			}else{
				//is streaming
				var gameId = data["game_id"];
				var liveTitle = data["title"];
				var liveViewersCount = data["viewer_count"];

				//Get Game with ID
				$.ajax({
					type: "GET",
					beforeSend: function(request) {
					  request.setRequestHeader("Client-Id", client_id);
					},
					url: "https://api.twitch.tv/"+api+"/games?id="+gameId,
					processData: false,
					success: function(response) {
						var liveGame = response.data[0]['name'];
						$('#gamePlaying').html(liveGame);	
					}
					});

				if(stateNotif !== "notifSent"){
					stateNotif = "ready2sendNotif";	
				}

				$('#msgOffline').hide();
				$('#thirdWordStatusLink').html("[EN LIVE]"); // TODO : possibiliter de changer [EN LIVE]
				$('#thirdWordStatusLink').css('color', 'green');
				$('#viewerCount').html(improveViewersDisplay(liveViewersCount));
				$('#liveTitle').html(liveTitle);
				$('.msgOffline').hide();
				$('.gameBox').css('visibility', 'visible');
				chrome.browserAction.setIcon({path: "img/icon-on-64.png"}); // TODO : changer Icone Stream ON
			}	
				
				if(stateNotif === "ready2sendNotif" && notification===true){
					cleanNotif(notif);
					notif = sendNotif();
					stateNotif = "notifSent";
				}

					if(typeof notif != "undefined"){
						notif.onclick = function(event) {
							  event.preventDefault(); 
							  window.open('http://twitch.tv/Azamir', '_blank'); // TODO : url twitch a modifier
							  cleanNotif(notif);
						}
					}
		}
	  });
}

function cleanNotif(notif){
	if(typeof notif != "undefined"){
		notif.close();
	}
}

function sendNotif(){
	return new Notification('Stream JoJ',	{ // TODO: zone a modifier pour la notification Stream ON
					icon : 'img/logo_300.png',
					title : 'Welcome in the family',
					body : 'stream up les copains !'
	});
}

function improveViewersDisplay(viewers_count){
		return viewers_count.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
}

$(async function() {
	$('body').on('click', 'a', function () {
		chrome.tabs.create({url: $(this).attr('href')});
	});
	for (let [key, value] of Object.entries(config.social)) {
		if (value) $('.social').append(`<a href="${value}"><img alt="${key}" src="img/assets/${key}.png"></a>`);
}

});