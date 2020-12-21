import { Whatsapp } from 'venom-bot';
import { StoreKey } from './store';
import waUtils from './whatsapp';

// tslint:disable: no-var-requires
const express = require('express');
const Store = require('electron-store');
const cors = require('cors');
const bodyParser = require('body-parser');
const timeout = require('connect-timeout');

const store = new Store();

export const app = express();
let client: Whatsapp | undefined;
let token = store.get(StoreKey.token).WASecretBundle
  ? store.get(StoreKey.token)
  : undefined;

app.use(
  cors({
    origin: '*',
    optionsSuccessStatus: 200,
  }),
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const haltOnTimedout = (req: any, _res: any, next: any) => {
  if (!req.timedout) next();
};

export const createServer = (electronApp: any) => {
  app.get(
    '/connection-state',
    timeout('2s'),
    haltOnTimedout,
    (_req: any, res: any) => {
      client
        ?.getConnectionState()
        .then((connectionState) => {
          res.json(electronApp.resToClient({ connectionState }));
        })
        .catch((error) => {
          res.status(400).json(electronApp.resToClient({ error }));
        });
    },
  );

  app.get('/start', (_req: any, res: any) => {
    if (!client) {
      waUtils
        .sessionCreate(token)
        .then((newClient) => {
          client = newClient;
          res.json(electronApp.resToClient({ message: 'Starting...' }));
        })
        .catch((error) => {
          res.status(400).json(electronApp.resToClient({ error }));
        });
    } else {
      res.json(
        electronApp.resToClient({
          message: 'Client is exist',
        }),
      );
    }
  });

  app.get('/qr-code', timeout('2s'), haltOnTimedout, (_req: any, res: any) => {
    client
      ?.waitForQrCodeScan((qrCode) => {
        if (qrCode) {
          res.json(electronApp.resToClient({ qrCode }));
        }
      })
      .catch((error) => {
        res.status(400).json(electronApp.resToClient({ error }));
      });
  });

  app.get('/token', timeout('2s'), haltOnTimedout, (_req: any, res: any) => {
    client
      ?.getSessionTokenBrowser()
      .then((newToken) => {
        if (token.WASecretBundle) {
          store.set(StoreKey.token, newToken);
          token = newToken as any;
        }
        res.json(
          electronApp.resToClient({
            token: newToken,
          }),
        );
      })
      .catch((error) => {
        res.status(400).json(electronApp.resToClient({ error }));
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
        res.json(electronApp.resToClient({ groups: data }));
      })
      .catch((error) => {
        res.status(400).json(electronApp.resToClient({ error }));
      });
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
          electronApp.resToClient({ count: data.length, members: data }),
        );
      })
      .catch((error) => {
        res.status(400).json(electronApp.resToClient({ error }));
      });
  });

  app.get('/contacts/:page/:query?', (req: any, res: any) => {
    const { page, query } = req.params;
    const queryRegex = new RegExp(query, 'gi');

    const pageSize = 50;
    client
      ?.getAllContacts()
      .then((contacts) => {
        const data = contacts
          .filter(({ name }) => (query ? name?.match(queryRegex) : true))
          .filter(({ id, isMe }) => !isMe && id.server === 'c.us')
          .map(({ id, name }) => {
            return {
              id,
              name,
            };
          });
        const dataPerPage = data.slice((page - 1) * pageSize, page * pageSize);

        const totalData = query ? data.length : contacts.length;
        const totalPage = Math.ceil(totalData / pageSize);

        res.json(
          electronApp.resToClient({
            count: data.length,
            contacts: dataPerPage,
            totalData,
            totalPage,
            hasMore: req.params.page < totalPage,
          }),
        );
      })
      .catch((error) => {
        res.status(400).json(electronApp.resToClient({ error }));
      });
  });

  app.get('/reset', (_req: any, res: any) => {
    client = undefined;
    res.json(
      electronApp.resToClient({
        message: 'Client removed',
      }),
    );
  });

  app.post('/send-message', (req: any, res: any) => {
    const { id, message, filepath } = req.body;
    const chatId = id + '@c.us';

    client
      ?.sendText(chatId, message)
      .then(() => {
        console.log('Successfully sent message to', chatId);
        if (filepath) {
          client?.sendImage(chatId, filepath);
        }
        res.json(electronApp.resToClient(req.body));
      })
      .catch(() => {
        res.json(
          electronApp.status(400).resToClient({
            message: `Error sending to ${chatId}`,
            data: req.body,
          }),
        );
      });
  });

  app.get('/use-here', (_req: any, res: any) => {
    client
      ?.useHere()
      .then(() => {
        res.json(
          electronApp.resToClient({
            success: true,
          }),
        );
      })
      .catch((error) => {
        res.status(400).json(electronApp.resToClient({ error }));
      });
  });

  app.listen(3001);
};
