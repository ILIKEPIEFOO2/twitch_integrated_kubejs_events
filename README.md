# twitch_integrated_kubjs_events
This is a KubeJS script for integration with your twitch livestream.

Requires KubeJS to function. KubeJS is made by the lovely LatvianModder. Source: https://github.com/KubeJS-Mods/KubeJS

What does it do?
When the server starts, a player with opped permissions does "/streaming" or "/streamstart" to start the script.
Provided a valid oauth key was given, every 60 seconds your top total followers will update. If you gain followers,
the script will run a random event for every player on the server.

How do I set it up?
Download all 3 .js files and place them in your server's KubeJS folder. Then open the OAuth.js file and where you see, 
var oAuthPassword="";
You need to put your oauth token inside the ""s. If you are unaware of how to get that then refer to this:
https://dev.twitch.tv/docs/authentication/#getting-tokens
(Don't include oauth in the ""s, only the number/letter combination after it).

Once that is done, make sure to reload all kubejs scripts on the server.
All that is left is to run the /streamstart command.

If you would like to test if you have set it up correctly then do:
/follow 1
It will pick 1 random event and run it.

If you would like to test if your latest followers are accurate then do:
/followers

If you would like to add another event, then good luck. If you follow the format and know what your doing you should get
it. Otherwise I don't know how to explain it to you :/ . Player is a PlayerJS object and user is the latest follower name as a string.
