global.totalFollowers;
global.latestFollowers;
global.getFollowers = function(numberOfFollowersToGet) {
    if (global.hasAuthorized) {
        if (!numberOfFollowersToGet) {
            numberOfFollowersToGet = 1;
        }
        var javaUrl = Java.type("java.net.URL");
        var httpConnect = Java.type("java.net.HttpURLConnection");
        var tempURL = new javaUrl("https://api.twitch.tv/helix/users/follows?to_id=" + global.user_id + "&first=" + numberOfFollowersToGet);
        var connection = tempURL.openConnection();
        var isRead = Java.type("java.io.InputStreamReader");
        connection.setRequestMethod("GET");
        connection.setRequestProperty("User-Agent", "Mozilla/5.0");
        connection.setRequestProperty("Client-ID", global.client_id);
        var ioStream = new isRead(connection.getInputStream());
        if (connection.getResponseCode() == 200) {
            var data = ioStream.read();
            var output = "";
            var nextLines = 0;
            var character = "";
            while (data != -1) {
                character = String.fromCharCode(data);
                output += character;
                if (character == "{") {
                    nextLines += 1;
                }
                if (character == "}") {
                    nextLines -= 1;
                }
                data = ioStream.read();
            }
            ioStream.close();
            console.info(output);
            return JSON.parse(output);
        } else {
            console.error("Failed to get followers");
            return {};
        }
    } else {
        global.validate();
        if (global.hasAuthorized) {
            return global.getFollowers(numberOfFollowersToGet);
        } else {
            return {};
        }
    }
}
global.numberOfNewFollowers = function() {
    var followers = global.getFollowers(5);
    if (followers != {}) {
        if (!global.totalFollowers) {
            global.totalFollowers = followers.total;
            return null;
        } else {
            var difference = followers.total - global.totalFollowers;
            if (global.totalFollowers < followers.total) {
                global.totalFollowers = followers.total;
                global.latestFollowers = [];
                for (var i = 0; i < 5; i++) {
                    global.latestFollowers.push(followers.data[i].from_name);
                }
            }
            return difference;
        }
    } else {
        return 0;
    }
}
global.runRandomEvent = function() {
    var eventsToRun = global.numberOfNewFollowers();
    if (eventsToRun !== null) {
        if (eventsToRun < 0) {
            utils.server.tell("[PieBot] :( " + (-1 * eventsToRun) + " users have stopped following.");
        }
        if (eventsToRun > 0) {
            utils.server.tell("[PieBot] Now Running " + eventsToRun + " random events.");
        }
        global.runXEvents(eventsToRun);
    } else {
        utils.server.tell("[PieBot] Follower Bot initilized. Current Number Of Followers: " + global.totalFollowers);
    }
}
global.runXEvents = function(numberOfEventsToRun) {
    global.getRandomEvents();
    utils.server.tell("[PieBot] Refreshing List");
    if (global.listOfRandomEvents) {
        for (var i = 0; i < numberOfEventsToRun; i++) {
            global.listOfRandomEvents[Math.floor(Math.random() * global.listOfRandomEvents.length)].run();
        }
    } else {
        utils.server.tell("Failed to initilized events");
    }
}
global.initilizeEventSystem = function(event) {
    event.server.schedule(1000 * 60, event.server, function(callback) {
        global.runRandomEvent(callback.data);
        callback.reschedule();
    });
}
global.followerTest = function(numberOfNewFollowers) {
    utils.server.tell("[PieBot] Simulating " + numberOfNewFollowers + " new followers.");
    global.runXEvents(numberOfNewFollowers);
}
events.listen("server.load", function(event) {
    event.server.tell("Setting up System");
    global.validate();
    global.initilizeEventSystem(event);
});
events.listen("player.chat", function(event) {
    if (event.message == "test") {
        global.followerTest(1);
    }
});