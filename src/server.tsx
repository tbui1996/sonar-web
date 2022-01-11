// eslint-disable-next-line import/no-extraneous-dependencies
import { createServer, Model, Response } from 'miragejs';

export function makeServer({ environment = 'test' } = {}) {
  const server = createServer({
    environment,

    models: {
      form: Model,
      file: Model,
      user: Model,
      organization: Model
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

      this.get('/users/user_list', (schema) => {
        const users = schema.all('user');
        return new Response(200, {}, { users: users.models });
      });

      this.get('/users/organizations', (schema) => {
        const organizations = schema.all('organization');
        return new Response(200, {}, organizations.models);
      });

      this.put('/users/update_user', () => ({
        status: true,
        msg: 'Updated user successfully.'
      }));

      this.put('/users/revoke_access', () => ({
        status: true,
        msg: 'Revoked user successfully.'
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

      this.post('/users/organizations', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        schema.create('organization', attrs);
        return new Response(200, {}, { ID: '1', name: attrs.name });
      });

      this.passthrough();
    }
  });

  return server;
}
