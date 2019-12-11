global.randomEvent = function(functionToExecute) {
    this.run = function() {
        var players = utils.server.players;
        for (var i = 0; i < players.length; i++) {
            if (!global.latestFollowers) {
                functionToExecute(players[i], "default_user");
            } else {
                functionToExecute(players[i], latestFollowers[i]);
            }
        }
    }
}
global.listOfRandomEvents;
global.getRandomEvents = function() {
    global.listOfRandomEvents = [
        new global.randomEvent(function(player, user) {
            player.tell("[Twitch Gods] Oh-No! " + user + " ordered a band of hitmen to sabotage the run!");
            var mobList = ["minecraft:spider", "minecraft:skeleton", "minecraft:zombie", "minecraft:enderman"];
            var world = player.world;
            var ent;
            for (var x = -1; x < 2; x++) {
                for (var z = -1; z < 2; z++) {
                    if (!(x == 0 && z == 0)) {
                        ent = world.createEntity(mobList[Math.floor(Math.random() * mobList.length)]);
                        ent.setPosition(player.x + x * 3, player.y, player.z + z * 3);
                        ent.customName = user + "'s Hitman";
                        ent.customNameAlwaysVisible = true;
                        ent.spawn();
                    }
                }
            }
        }),
        new global.randomEvent(function(player, user) {
            player.tell("[Twitch Gods] Thanks to, " + user + ", the blocks below you will now randomize!");
            var blockList = block.typeList;
            var world = player.world;
            for (var x = -1; x < 2; x++) {
                for (var z = -1; z < 2; z++) {
                    world.getBlock(player.x + x, player.y - 1, player.z + z).set(blockList[Math.floor(Math.random() * blockList.length)])
                }
            }
        }),
        new global.randomEvent(function(player, user) {
            player.tell("[Twitch Gods] " + user + " has granted you with random items!");
            var itemList = item.list;
            player.give(itemList[Math.floor(Math.random() * itemList.length)]);
        }),
        new global.randomEvent(function(player, user) {
            var potionList = ["absorption", "instant_damage", "nausea", "speed", "blindness", "instant_health", "night_vision", "strength", "fire_resistance", "invisibility", "poison", "unluck", "glowing", "jump_boost", "regeneration", "water_breathing", "haste", "levitation", "resistance", "weakness", "health_boost", "luck", "saturation", "wither", "hunger", "mining_fatigue", "slowness"];
            var potionEffect = potionList[Math.floor(Math.random() * potionList.length)];
            player.tell("[Twitch Gods] " + user + " has graced you with " + potionEffect + " for 30 seconds!");
            player.potionEffects.add(potionEffect, 600);
        }),
        new global.randomEvent(function(player, user) {
            var mobList = ["minecraft:horse", "minecraft:pig", "minecraft:cow", "minecraft:sheep", "minecraft:chicken"];
            var world = player.world;
            var pet = mobList[Math.floor(Math.random() * mobList.length)];
            player.tell("[Twitch Gods] Wow! " + user + " donated their pet " + pet.substring(10) + "!");
            var ent = world.createEntity(pet);
            ent.setPosition(player.x, player.y, player.z);
            ent.customName = user + "'s Pet " + pet.substring(10);
            ent.customNameAlwaysVisible = true;
            ent.spawn();
        }),
        new global.randomEvent(function(player, user) {
            player.tell("[Twitch Gods] You have angered " + user + " and for that you will be punished!");
            var world = player.world;
            player.world.spawnLightning(player.x + 9 * Math.random() - 4, player.y, player.z + 9 * Math.random() - 4, false);
        })
    ];
}