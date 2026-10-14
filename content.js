'use strict';
// Array order controls display order. Extend either list to add content.
window.FRUIT_CONTENT = {
  "worlds": [
    {"id":"sunny-market","name":"Sunny Market","tagline":"A peaceful morning. A market worth protecting.","poster":"assets/worlds/sunny-market.webp","video":"media/worlds/sunny-market.mp4","duration":"0:54","position":"50% 50%"},
    {"id":"moonlit-coast","name":"Moonlit Coast","tagline":"New friends. New trouble beneath the moon.","poster":"assets/worlds/moonlit-coast.webp","video":"media/worlds/moonlit-coast.mp4","duration":"0:30","position":"50% 50%"},
    {"id":"cloudcrest","name":"Cloudcrest","tagline":"Follow the wind. Stand together above the clouds.","poster":"assets/worlds/cloudcrest.webp","video":"media/worlds/cloudcrest.mp4","duration":"0:30","position":"50% 50%"}
  ],
  "stories": [
    {
      "id": "grape",
      "name": "Grape",
      "tagline": "Small fruit. Quite the wake-up call.",
      "poster": "assets/stories/grape-cover-480.webp",
      "video": "media/stream/grape-v2.mp4",
      "duration": "0:45",
      "position": "50% 50%"
    },
    {
      "id": "dew",
      "name": "Dew",
      "tagline": "A brighter day, one drop at a time.",
      "poster": "assets/stories/dew-cover-480.webp",
      "video": "media/stream/dew-v2.mp4",
      "duration": "0:44",
      "position": "50% 50%"
    },
    {
      "id": "peach",
      "name": "Peach",
      "tagline": "A little kindness goes a long way.",
      "poster": "assets/stories/peach-cover-480.webp",
      "video": "media/stream/peach-v2.mp4",
      "duration": "0:45",
      "position": "50% 50%"
    }
  ],
  "characters": [
    {
      "id": "grape",
      "name": "Grape",
      "role": "THE SHOOTER",
      "intro": "Small fruit. Big determination.",
      "description": "Grape fires down the lane to keep hungry visitors at a distance. A dependable friend when the stand needs defending.",
      "image": "assets/stories/grape-character.webp",
      "position": "50% 67%",
      "storyId": "grape",
      "color": "#ede2f1"
    },
    {
      "id": "dew",
      "name": "Dew",
      "role": "THE GATHERER",
      "intro": "Good things start with a little dew.",
      "description": "Dew gathers the Dewdrops that help you grow your squad. Give this little friend a safe spot and let the teamwork begin.",
      "image": "assets/stories/dew-character.webp",
      "position": "50% 78%",
      "storyId": "dew",
      "color": "#e6edcd"
    },
    {
      "id": "peach",
      "name": "Peach",
      "role": "THE HEALER",
      "intro": "A little kindness. A stronger squad.",
      "description": "Peach keeps nearby friends healthy, helping the squad hold on when hungry visitors get too close.",
      "image": "assets/stories/peach-character.webp",
      "position": "50% 76%",
      "storyId": "peach",
      "color": "#f8e2d5"
    }
  ]
};
