
export class Message {
    constructor({ time, author, text}) {
      this.time = time;
      this.author = author;
      this.text = text;
    }
  }
  
  export class ChatMessage extends Message {
    static types = {  sent: 'sent', received: 'received' } ;
    constructor({
        from, to,
      sendtimestamp, receivedtimestamp, readtimestamp,
      message, messagestate
    }) {
      super({type: to& sendtimestamp ? 'sent' : 'received', time: sendtimestamp, text: message});
      this.from = from;
      this.to = to;
      this.sendtimestamp = sendtimestamp;
      this.receivedtimestamp = receivedtimestamp;
      this.readtimestamp = readtimestamp;
      this.message = message;
      this.messagestate = messagestate;
    }
} 

export class Chat {

    static chatId = ({from, to}) =>  from > to ? `__${from}~${to}__` : `__${to}~${from}__`;
     constructor(options) {
      this.from = options.from;
      this.to = options.to;
      this.created_at = options.created_at || Date.now();
      this.chatId = options.chatId || Chat.chatId({from : this.from,  to: this.to});
      this.messages = options.messages || [];
    }   

    getChatId() {
      return this.chatId || Chat.chatId({from : this.from,  to: this.to});
    }
  }
  
 export class User {
    constructor({id, username, avatar, preference, location}) {
      this.id = id;
      this.username = username;
      this.avatar = avatar;
      this.usePrivate = false;
      this.userData = {
        pictures: [],
        messages: {
          sent: [],
          received: [],
          chats: []
        },
        preference: {
          channels: [],
          categories: []
        },
      },
      this.location =  location,
      this.connected_at = Date.now();
    }
  }

