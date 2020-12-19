import { create, Id, Whatsapp } from 'venom-bot';
import { tokenSession } from 'venom-bot/dist/config/tokenSession.config';

export const sessionCreate = async (browserSession?: tokenSession) => {
  return new Promise<Whatsapp>((resolve, reject) => {
    create(
      'wawiz',
      undefined,
      undefined,
      {
        headless: true,
        logQR: false,
        mkdirFolderToken: '/public',
        waitForLogin: false,
      },
      browserSession,
    )
      .then((client) => {
        resolve(client);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

type groupMembers = {
  id: Id;
  name: string;
}[];

interface BlastMessagesParams {
  client: Whatsapp;
  ids: groupMembers;
  text: string;
  filepath?: string;
  interval?: number;
}

export const blastMessages = ({
  client,
  ids,
  text,
  filepath,
  interval = 2000,
}: BlastMessagesParams) => {
  let counter = 0;
  const i = setInterval(() => {
    const id = ids[counter].id._serialized;
    client
      .sendText(id, text)
      .then(async () => {
        console.log(
          'Successfully sent message to',
          ids[counter]?.name,
          ids[counter]?.id,
        );

        if (filepath) {
          client.sendImage(id, filepath);
        }

        counter++;
        if (counter === ids.length) {
          clearInterval(i);
          console.log('Done');
        }
      })
      .catch((err: any) => {
        console.error('Error when sending: ', err);
      });
  }, interval);
};

const waUtils = {
  sessionCreate,
  blastMessages,
};

export default waUtils;
