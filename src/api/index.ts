import { Whatsapp } from 'venom-bot';
import waUtils from './whatsapp';

// tslint:disable: no-var-requires
const express = require('express');
const Store = require('electron-store');

const store = new Store();

export const app = express();
let client: Whatsapp | undefined;

export const createServer = (electronApp: any) => {
  app.get('/', async (_req: any, res: any) => {
    client
      ?.getConnectionState()
      .then((status) => {
        res.json(electronApp.resToClient({ success: true, status }));
      })
      .catch((error) => {
        res.json(electronApp.resToClient({ success: false, error }));
      });
  });

  app.get('/start', (_req: any, res: any) => {
    if (!client) {
      waUtils
        .sessionCreate(store.get('token'))
        .then((newClient) => {
          client = newClient;
          res.json(electronApp.resToClient({ success: true }));
        })
        .catch((error) => {
          res.json(electronApp.resToClient({ success: false, error }));
        });
    } else {
      res.json(
        electronApp.resToClient({
          success: true,
          message: 'Client is exist',
        }),
      );
    }
  });

  app.get('/qr-code', (_req: any, res: any) => {
    client
      ?.waitForQrCodeScan(async (qrCode) => {
        res.json(electronApp.resToClient({ success: true, qrCode }));
      })
      .catch((error) => {
        res.json(electronApp.resToClient({ success: false, error }));
      });
  });

  app.get('/token', (_req: any, res: any) => {
    client
      ?.getSessionTokenBrowser()
      .then((token) => {
        store.set('token', token);
        res.json(
          electronApp.resToClient({ success: true, token: store.get('token') }),
        );
      })
      .catch((error) => {
        store.delete('token');
        res.json(electronApp.resToClient({ success: false, error }));
      });
  });

  app.get('/groups', (_req: any, res: any) => {
    client
      ?.getAllGroups()
      .then((groups) => {
        const data = groups.map(({ id, name, groupMetadata }) => {
          return {
            id,
            name,
            participants: groupMetadata.participants.length,
          };
        });
        res.json(electronApp.resToClient({ success: true, data }));
      })
      .catch((error) =>
        res.json(electronApp.resToClient({ success: false, error })),
      );
  });

  app.get('/group-members/:id', (req: any, res: any) => {
    client
      ?.getGroupMembers(req.params.id)
      .then((members) => {
        const data = members
          .filter(({ isMe }) => !isMe)
          .map(({ id, name }) => ({
            id,
            name,
          }));
        res.json(
          electronApp.resToClient({ success: true, count: data.length, data }),
        );
      })
      .catch((error) =>
        res.json(electronApp.resToClient({ success: false, error })),
      );
  });

  app.get('/contacts', (_req: any, res: any) => {
    client
      ?.getAllContacts()
      .then((contacts) => {
        const data = contacts
          .filter(({ id, isMe }) => !isMe && id.server === 'c.us')
          .map(({ id, name }) => {
            return {
              id,
              name,
            };
          });
        res.json(
          electronApp.resToClient({ success: true, count: data.length, data }),
        );
      })
      .catch((error) =>
        res.json(electronApp.resToClient({ success: false, error })),
      );
  });

  app.listen(3001);
};
