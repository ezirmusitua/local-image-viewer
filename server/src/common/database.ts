// https://github.com/techfort/LokiJS/wiki/LokiJS-persistence-and-adapters
import * as Lokijs from 'lokijs';

const DATABASE_URI = 'database.json';

const Collections = ['gallery', 'session'];

export const database = new Lokijs(DATABASE_URI, {
  autoload: true,
  autoloadCallback: databaseInitialize,
  autosave: true,
  autosaveInterval: 5 * 1000
});

function runProgramLogic() {
  Collections.forEach(c => {
    const count = database.getCollection(c).count();
    console.info('number of entries in database : ' + count);
  });
}

function databaseInitialize() {
  Collections.forEach(c => {
    const items = database.getCollection(c);
    if (items === null) {
      database.addCollection(c);
    }
  });
  // kick off any program logic or start listening to external events
  runProgramLogic();
}
