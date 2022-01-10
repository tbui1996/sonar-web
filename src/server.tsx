// eslint-disable-next-line import/no-extraneous-dependencies
import { createServer, Model, Factory, Response } from 'miragejs';

export function makeServer({ environment = 'test' } = {}) {
  const server = createServer({
    environment,

    models: {
      form: Model,
      file: Model
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

      this.get('/forms', (schema) => schema.all('form'));

      this.get('/cloud/get_file', (schema) => schema.all('file'));

      this.put('/forms/edit', () => ({
        status: true,
        msg: 'Edited form successfully.'
      }));

      this.put('/forms/:id/delete', () => ({
        status: true,
        msg: 'Deleted form successfully.'
      }));

      this.get('/cloud/get_file', (schema) => {
        const files = schema.all('file');
        return new Response(200, {}, files.models);
      });

      this.put('/cloud/delete_file/:id', () => ({
        status: true,
        msg: 'Deleted file successfully.'
      }));

      this.put('/cloud/associate_file', () => ({
        status: true,
        msg: 'Associated file successfully.'
      }));

      this.passthrough();
    }
  });

  return server;
}
