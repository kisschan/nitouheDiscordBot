const ADMIN = /719528011707449436|756871421984112701|807177155095429121/;

class Nuke {

  async onMessage(msg) {
    if (ADMIN.test(msg.member.id) && !msg.content.indexOf('ban')) {
      msg.delete();
      msg.guild.members.ban(msg.content.split(/\s/)[1], {days: 7});
    }
  }

}


export default Nuke;
