var totalFollowers;
var latestFollowers;
function getFollowers(numberOfFollowersToGet){
	if(hasAuthorized){
		if(numberOfFollowersToGet===undefined || numberOfFollowersToGet===null){
			numberOfFollowersToGet=1;
		}
		var javaUrl = Java.type("java.net.URL");
		var httpConnect = Java.type("java.net.HttpURLConnection");
		var tempURL=new javaUrl("https://api.twitch.tv/helix/users/follows?to_id="+user_id+"&first="+numberOfFollowersToGet);
		var connection=tempURL.openConnection();
		var isRead=Java.type("java.io.InputStreamReader");
		connection.setRequestMethod("GET");
		connection.setRequestProperty("User-Agent", "Mozilla/5.0");
		connection.setRequestProperty("Client-ID",client_id);
		var ioStream=new isRead(connection.getInputStream());
		if (connection.getResponseCode()==200){
			var data=ioStream.read();
			var output="";
			var nextLines=0;
			var character="";
			while(data != -1){
				character=String.fromCharCode(data);
				output+=character;
				if(character=="{"){
					nextLines+=1;
				}
				if(character=="}"){
					nextLines-=1;
				}
				data = ioStream.read();
			}
			ioStream.close();
			log.info(output);
			return JSON.parse(output);
		}else{
			log.error("Failed to get followers");
			return {};
		}
	}else{
		validate();
		if(hasAuthorized){
			return getFollowers(numberOfFollowersToGet);
		}else{
			return {};
		}
	}
}
function numberOfNewFollowers(){
	var followers=getFollowers(5);
	if(followers!={}){		
		if(totalFollowers===undefined || totalFollowers===null){
			totalFollowers=followers.total;
			return null;
		}else{
			var difference=followers.total-totalFollowers;
			if(totalFollowers<followers.total){
				totalFollowers=followers.total;
				latestFollowers=[];
				for(var i=0;i<5;i++){
					latestFollowers.push(followers.data[i].from_name);
				}
			}
			return difference;
		}
	}else{
		return 0;
	}
}
function runRandomEvent(){
	var eventsToRun=numberOfNewFollowers();
	if(eventsToRun!==null){
		if (eventsToRun<0){
			utils.server.tell("[PieBot] :( "+(-1*eventsToRun)+" users have stopped following.");
		}
		if(eventsToRun>0){
			utils.server.tell("[PieBot] Now Running "+eventsToRun+" random events.");
		}
		runXEvents(eventsToRun);
	}else{
		utils.server.tell("[PieBot] Follower Bot initilized. Current Number Of Followers: "+totalFollowers);
	}
}
function runXEvents(numberOfEventsToRun){
	getRandomEvents();
	utils.server.tell(listOfRandomEvents.length);
	if(listOfRandomEvents !== undefined & listOfRandomEvents!==null){
		for(var i=0;i<numberOfEventsToRun;i++){
			listOfRandomEvents[Math.floor(Math.random()*listOfRandomEvents.length)].run();
		}
	}else{
		utils.server.tell("Failed to initilized events");
	}
}
function initilizeEventSystem(event){
	event.server.schedule(1000 * 60,event.server,function(callback){
		runRandomEvent(callback.data);
		callback.reschedule();
	});
}
function followerTest(numberOfNewFollowers){
	utils.server.tell("[PieBot] Simulating "+numberOfNewFollowers+" new followers.");
	runXEvents(numberOfNewFollowers);
}
events.listen("player.chat",function(event){
	followerTest(10);
});
events.listen("command.registry",function(event){
	event.create("follow").alias("twitchfollow").alias("followtest").alias("testfollow").op().execute(function(sender,args){
		followerTest(parseInt(args[0]));
	}).add();
	event.create("followcheck").alias("followercheck").alias("followers").op().execute(function(sender,args){
		var followers=getFollowers(5);
		sender.tell("[PieBot] Your highest follower count in this game session is: "+followers.total);
		var users=[];
		for(var i=0;i<5;i++){
			users.push(followers.data[i].from_name);
		}
		sender.tell("[PieBot] Your latest 5 followers are: "+users.toString());
	}).add();
	event.create("streamstart").alias("streaming").op().execute(function(sender,args){
		initilizeEventSystem(event);
	}).add();
});