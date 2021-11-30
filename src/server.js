// eslint-disable-next-line import/no-extraneous-dependencies
import { createServer, Model, Factory } from 'miragejs';
export function makeServer({ environment = 'test' } = {}) {
  const server = createServer({
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
      server.create('note', { id: 1, text: 'hello world!' });
    },

    routes() {
      this.urlPrefix = `https://api.${process.env.REACT_APP_BASE_API_DOMAIN}`;

      this.get('/forms', (schema) => schema.forms.all());

      this.put('/forms/edit', () => ({
        status: true,
        msg: 'Edited form successfully.'
      }));

      this.put('/forms/:id/delete', () => ({
        status: true,
        msg: 'Deleted form successfully.'
      }));

      this.passthrough();
    }
  });

  return server;
}
