var oAuthPassword="";
var client_id;
var user_id;
var hasAuthorized=false;
function validate(){
	var javaUrl = Java.type("java.net.URL");
	var httpConnect = Java.type("java.net.HttpURLConnection");
	var tempURL=new javaUrl("https://id.twitch.tv/oauth2/validate");
	var connection=tempURL.openConnection();
	var isRead=Java.type("java.io.InputStreamReader");
	connection.setRequestMethod("GET");
	connection.setRequestProperty("User-Agent", "Mozilla/5.0");
	connection.setRequestProperty("Authorization","OAuth "+oAuthPassword);
	var ioStream=new isRead(connection.getInputStream());
	log.info(connection.getResponseCode());
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
		var out=JSON.parse(output);
		client_id=out.client_id;
		user_id=out.user_id;
		hasAuthorized=true;
	}else{
		log.error("Failed to validate O-Auth Password");
	}
}