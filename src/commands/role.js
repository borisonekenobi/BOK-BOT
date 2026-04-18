const util = require('../util');
const roleDB = require('../db/dbRole');

async function execute(interaction, guild) {
    let name = interaction.data.options[0].name
    switch (name) {
        case 'add':
            return await add(interaction, guild);

        case 'edit':
            return await edit(interaction, guild);

        case 'list':
            return await list(interaction, guild);

        case 'remove':
            return await remove(interaction, guild);
    }
}

async function add(interaction, guild) {
    const roleID = interaction.data.options[0].options[0].value;
    const roleLevel = interaction.data.options[0].options[1].value;

    if (await roleDB.serverHasRole(guild.id, roleID)) {
        return util.createEmbed('#F9A825', 'Warning!', '', '', '', '', 'That role is already setup!\n*Use* `/role edit` *to edit a role*');
    }

    await roleDB.addRole(guild.id, roleID, roleLevel);

    const role = guild.roles.cache.find(role => role.id === roleID);
    return util.createEmbed('#00FF00', '', '', '', '', '', `The ${role.toString()} role has been set to level ${roleLevel}`);
}

async function edit(interaction, guild) {
    let roleID = interaction.data.options[0].options[0].value;
    let roleLevel = interaction.data.options[0].options[1].value;

    if (!await roleDB.serverHasRole(guild.id, roleID)) {
        return util.createEmbed('#F9A825', 'Warning!', '', '', '', '', 'Role is not setup yet!\n*Use* `/role add` *to add a role*')
    }

    await roleDB.editRole(guild.id, roleID, roleLevel);

    const role = guild.roles.cache.find(role => role.id === roleID);
    return util.createEmbed('#00FF00', '', '', '', '', '', 'The ' + role.toString() + ' role\'s level has been changed to ' + roleLevel);
}

async function list(interaction, guild) {
    let roles = await roleDB.listRoles(guild.id);
    let fields = [];
    for (let server_role of roles) {
        let role = guild.roles.cache.find(role => role.id === server_role.id);
        let level = server_role.level === 0 ? 'Join Server:' : `Level ${server_role.level}:`;
        fields.push({name: level, value: role.toString()});
    }

    if (fields.length === 0) {
        return util.createEmbed('#00FF00', '', '', '', '', '', 'No roles have been setup!\n*Use* `/role add` *to add a role*');
    } else {
        return util.createEmbed('#00FF00', '', '', '', '', '', 'All roles and their levels', '', fields);
    }
}

async function remove(interaction, guild) {
    let roleID = interaction.data.options[0].options[0].value;

    if (!await roleDB.serverHasRole(guild.id, roleID)) {
        return util.createEmbed('#F9A825', 'Warning!', '', '', '', '', 'Role is not setup yet!\n*Use* `/role add` *to add a role*')
    }

    await roleDB.removeRole(guild.id, roleID);

    const role = guild.roles.cache.find(role => role.id === roleID);
    return util.createEmbed('#00FF00', '', '', '', '', '', `The ${role.toString()} role has been removed`);

}

module.exports = {
    execute
}
