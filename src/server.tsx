// eslint-disable-next-line import/no-extraneous-dependencies
import { createServer, Factory, Model, Response } from 'miragejs';

export function makeServer({ environment = 'test' } = {}) {
  const server = createServer({
    environment,

    models: {
      form: Model,
      file: Model,
      user: Model,
      organization: Model,
      flag: Model
    },

    factories: {
      flag: Factory.extend({
        name: (i) => `FlagName ${i}`,
        key: (i) => `FlagKey${i}`,
        id: (i) => i,
        updatedAt: '2022-01-18T16:25Z',
        createdAt: '2022-01-18T16:25Z',
        updatedBy: 'test-user-id',
        createdBy: 'test-user-id',
        isEnabled: true
      })
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

      this.get(
        '/flags',
        (schema) =>
          new Response(
            200,
            {},
            {
              result: schema.all('flag').models
            }
          )
      );

      this.patch('/flags/:id', async (schema, request) => {
        const flag = schema.find('flag', request.params.id);
        if (flag) {
          flag.update(JSON.parse(request.requestBody));
          return new Response(200, {}, {});
        }
        return new Response(404);
      });

      this.get(
        '/flags/evaluate',
        (schema) =>
          new Response(
            200,
            {},
            {
              result: {
                ...schema
                  .all('flag')
                  .models.map((flag) => ({ [flag.key]: flag.isEnabled }))
              }
            }
          )
      );

      this.delete('flags/:id', async (schema, request) => {
        const flag = schema.find('flag', request.params.id);
        if (flag) {
          flag.destroy();
          return new Response(200, {}, {});
        }
        return new Response(404);
      });
      this.passthrough();
    }
  });

  return server;
}
