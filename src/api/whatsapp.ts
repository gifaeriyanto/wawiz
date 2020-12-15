import { create, Id, Whatsapp } from 'venom-bot';

export const sessionCreate = async (browserSession?: object) => {
  return new Promise<Whatsapp>((resolve, reject) => {
    create(
      'wablast',
      undefined,
      undefined,
      {
        headless: false,
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

export const getGroupMembers = (client: Whatsapp, groupId: string) => {
  return new Promise<groupMembers>(async (resolve, reject) => {
    let result: groupMembers = [];
    try {
      await client.getGroupMembers(groupId).then((res) => {
        result = res
          .filter(({ isMe }) => !isMe)
          .map(({ id, name }) => ({
            id,
            name,
          }));
      });
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

interface blastMessagesParams {
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
}: blastMessagesParams) => {
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
  getGroupMembers,
  blastMessages,
};

export default waUtils;
