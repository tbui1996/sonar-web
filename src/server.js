import { createServer, Model, Factory } from 'miragejs';

export function makeServer({ environment = 'test' } = {}) {
  let server = createServer({
    environment,

    models: {
      form: Model
    },

    factories: {
      form: Factory.extend({
        title: 'Test Form',
        description: 'This is a test form',
        creator: 'Milu Franz',
        created: new Date(),
        deletedAt: null,
        dateClosed: null
      })
    },

    seeds(server) {
      server.createList('form', 3);
    },

    routes() {
      this.urlPrefix = `https://api.${process.env.REACT_APP_BASE_API_DOMAIN}`;

      this.get('/forms', (schema) => {
        return schema.forms.all();
      });

      this.put('/forms/edit', () => {
        return {
          status: true,
          msg: 'Edited form successfully.'
        };
      });

      this.put('/forms/:id/delete', () => {
        return {
          status: true,
          msg: 'Deleted form successfully.'
        };
      });

      this.passthrough();
    }
  });

  return server;
}
