const {MessageEmbed} = require('discord.js');
const fs = require('fs');

function hasRole(member, roleID) {
    return member._roles.indexOf(roleID) >= 0;
}

function giveRole(member, role, roleID, msg = undefined) {
    if (!hasRole(member, roleID)) {
        member.roles.add(role)
            .then(() => {
                if (msg !== undefined) {
                    msg.channel.send(`Congratulations <@${member.user.id}>, you have just received the "${role.name}" role!`);
                }
            })
            .then(() => console.log(`${member.id} awarded ${role.id} role`))
            .catch(() => {
                member.guild.fetchOwner().then(owner => {
                    owner.send(`Error occurred while adding role to ${member.user.username}#${member.user.discriminator}! *It\'s possible that the bot\'s role is not high enough in the hierarchy, move the bot\'s role above all roles that it will be awarding*`);
                });
            });
    } else {
        console.log(`${member.id} already has ${role.id}, no role awarded`);
    }
}

function removeRole(member, role) {
    member.roles.remove(role);
}

function ready(bot) {
    // TODO: bot.guilds.cache.size
    bot.user.setPresence({activities: [{name: `Star Wars`, type: 'WATCHING'}], status: 'online'});
    console.info(`Logged in as ${bot.user.tag}`);
    bot.channels.cache.get('738439111412809730').send(':green_circle: Bot has started.');
}

function createLog(err) {
    try {
        let date_ob = new Date();
        let date = (`0${date_ob.getDate()}`).slice(-2);
        let month = (`0${date_ob.getMonth() + 1}`).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
        let logFile = `${year}-${month}-${date}-${hours}-${minutes}-${seconds}.log`;

        fs.appendFileSync(`logs/${logFile}`, err);
        console.error(`An error occurred! Error info saved to ${logFile}`)
    } catch (e) {
        console.error(err);
    }
}

function createEmbed(Color = '#000000', Title = '', URL = '', Author = '', AuthorImage = '', AuthorURL = '', Description = 'Description', Thumbnail = '', Fields = [], Image = '', Footer = '', FooterURL = '') {
    try {
        return new MessageEmbed()
            .setColor(Color)
            .setTitle(Title)
            .setURL(URL)
            .setAuthor({name: Author, iconURL: AuthorImage, url: AuthorURL})
            .setDescription(Description)
            .setThumbnail(Thumbnail)
            .addFields(Fields)
            .setImage(Image)
            .setTimestamp()
            .setFooter({text: Footer, iconURL: FooterURL});
    } catch (err) {
        createLog(err);
    }
}

module.exports = {
    hasRole,
    giveRole,
    removeRole,
    ready,
    createLog,
    createEmbed
}