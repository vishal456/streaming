var	client = require('socket.io').listen(8080).sockets;
var Twitter = require('twitter');
var fs = require('fs');

 
var clientTwitter = new Twitter({
	  consumer_key: 'kxuBx0pXIWqwQ5qmkXKO8zvGA',
	  consumer_secret: '418XSfVyfNQ5KMFrmK0hbnLDTRGHJ4vVYY1NIY0RfrAdalnDcD',
	  access_token_key: '179368243-EDxYirAv6XOdQIuepI7OJP63mcLHygQaVc6bg0xi',
	  access_token_secret: 't0aqfv1HAR5Skudcwbu4r3oGjhCP5gSVnTO2O4cfiuhjc'
});
var currentStrean = null;

	
client.on('connection',function(socket){
		console.log("someone has connected");
		var count = 0;
		setInterval(function(){socket.emit('graph',count); count = 0;}, 10000);

		var tweets = function(data){
			clientTwitter.stream('statuses/filter', {track: data}, function(stream) {
			currentStrean = stream;
	 		stream.on('data', function(tweet) {
	 			count++;
	 			socket.emit('output', {screen_name : tweet.user.screen_name,tweet_text : tweet.text});
	  		});
	 
	  		stream.on('error', function(error) {
    			console.log(error);
  			});
			});
		};

		socket.on('clear', function(data) {
			if(currentStrean !== null)
						currentStrean.destroy();
		});
			//wait for input
		socket.on('input', function(data) {
			console.log("someone has logged in");
			var	whitespacePattern = /^\s*$/;


			if(whitespacePattern.test(data)){
				console.log("invalid input");
				sendStatus('Name is required');
			}
			else{

					//emit all new messages
					console.log(data);
					if(currentStrean !== null)
						currentStrean.destroy();
					tweets(data);

			}

			
		});
	});