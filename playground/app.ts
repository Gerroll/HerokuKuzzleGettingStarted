import { Backend, KuzzleRequest } from 'kuzzle'

const app = new Backend('playground')

app.controller.register('greeting', {
  actions: {
    sayHello: {
      handler: async request => {
        return `Hello, ${request.input.args.name}`;
      }
    }
  }
});

app.pipe.register('server:afterNow', async (request: KuzzleRequest) => {
  request.result.now = (new Date()).toUTCString();

  return request;
});

app.start()
  .then(async () => {
    // Interact with Kuzzle API to create a new index if it does not already exist
    if (! await app.sdk.index.exists('nyc-open-data')) {
      await app.sdk.index.create('nyc-open-data');

      await app.sdk.document.create('nyc-open-data', 'yellow-taxi', {
        name: 'Aschen',
        age: 27
      });
      await app.sdk.query({
        controller: 'greeting',
        action: 'sayHello',
        name: 'Aschen'
      });
      
    }
  })
  .catch(console.error);