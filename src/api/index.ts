import { Whatsapp } from 'venom-bot';
import waUtils from './whatsapp';
const express = require('express');
const Store = require('electron-store');

const store = new Store();

export const app = express();
let client: Whatsapp;

const venomInit = async (_req: any, _res: any, next: any) => {
  if (!client) {
    client = await waUtils.sessionCreate(store.get('token'));
  }
  next();
};

app.use(venomInit);

app.get('/', async (_req: any, res: any) => {
  res.json({ success: true });
});

app.get('/qr-code', async (_req: any, res: any) => {
  client.waitForQrCodeScan((qrCode) => {
    res.json({ qrCode });
  });
});

app.get('/get-token', async (_req: any, res: any) => {
  const token = await client.getSessionTokenBrowser();
  store.set('token', token);
  res.json({ success: true, token: store.get('token') });
});

app.get('/get-groups', async (_req: any, res: any) => {
  const groups = await client.getAllGroups();
  const data = groups.map(({ id, name, groupMetadata }) => {
    return {
      id,
      name,
      participants: groupMetadata.participants.length,
    };
  });
  res.json({ data });
});

app.get('/get-group-members/:id', async (req: any, res: any) => {
  waUtils
    .getGroupMembers(client, req.params.id)
    .then((data) => res.json({ count: data.length, data }))
    .catch(() => res.json({ error: 'Invalid group id' }));
});

app.get('/get-contacts', async (_req: any, res: any) => {
  const data = (await client.getAllContacts())
    .filter(({ id, isMe }) => !isMe && id.server === 'c.us')
    .map(({ id, name }) => {
      return {
        id,
        name,
      };
    });
  res.json({ count: data.length, data });
});

const server = app.listen(3001, () => {
  console.log('Wawiz API listening on port ' + (server.address() as any).port);
});
