import StagesAirplaneCollection from "./movePlane.js";
import ParticipantsCollection from "./Participants.js";
import TabsColletion from "./Tabs.js";
import GrandmasterFXCollection from "./grandmasterMove.js";
import ScrollCollection from "./scroll.js";
new TabsColletion();

new ParticipantsCollection();

new StagesAirplaneCollection();


new GrandmasterFXCollection();
new ScrollCollection();
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}