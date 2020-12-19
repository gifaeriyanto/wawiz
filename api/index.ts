import { Whatsapp } from 'venom-bot';
import waUtils from './whatsapp';

// tslint:disable: no-var-requires
const express = require('express');
const Store = require('electron-store');
const cors = require('cors');
const bodyParser = require('body-parser');

const store = new Store();

export const app = express();
let client: Whatsapp | undefined;

app.use(
  cors({
    origin: '*',
    optionsSuccessStatus: 200,
  }),
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
        if (token.WASecretBundle) {
          store.set('token', token);
        }
        res.json(
          electronApp.resToClient({ success: true, token: store.get('token') }),
        );
      })
      .catch((error) => {
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
            success: true,
            count: data.length,
            data: dataPerPage,
            totalData,
            totalPage,
            hasMore: req.params.page < totalPage,
          }),
        );
      })
      .catch((error) =>
        res.json(electronApp.resToClient({ success: false, error })),
      );
  });

  app.get('/reset', async (_req: any, res: any) => {
    client = undefined;
    res.json(
      electronApp.resToClient({
        success: true,
        message: 'Client removed',
      }),
    );
  });

  app.post('/send-message', async (req: any, res: any) => {
    const { id, message, filepath } = req.body;
    const chatId = id + '@c.us';

    client
      ?.sendText(chatId, message)
      .then(async () => {
        console.log('Successfully sent message to', chatId);
        if (filepath) {
          client?.sendImage(chatId, filepath);
        }
        res.json(
          electronApp.resToClient({
            success: true,
            message: `Successfully sent message to ${chatId}`,
            data: req.body,
          }),
        );
      })
      .catch(() => {
        res.json(
          electronApp.resToClient({
            success: false,
            message: `Error sending to ${chatId}`,
            data: req.body,
          }),
        );
      });
  });

  app.listen(3001);
};
