const util = require('../util.js');

function buttonClicked(interaction, author, guild) {
    let roleID = interaction.data.custom_id;
    let role = guild.roles.cache.find(role => role.id === roleID);
    if (util.hasRole(author, roleID)) {
        util.removeRole(author, role);
    } else {
        util.giveRole(author, role, roleID);
    }
}

function execute(interaction, guild) {
    let name = interaction.data.options[0].name
    switch (name) {
        case 'create':
            return create(interaction, guild);

        case 'edit':
            return edit(interaction, guild);
    }
}

function create(interaction, guild) {
    let params = interaction.data.options[0].options;
    let message = params[0].value;
    let components = []

    for (let i = 1; i < params.length; i++) {
        let role = guild.roles.cache.find(role => role.id === params[i].value);
        components.push({
            "type": 2,
            "label": role.name,
            "style": 1,
            "custom_id": role.id
        });
    }

    return {
        "content": message,
        "components": [
            {
                "type": 1,
                "components": components

            }
        ]
    }
}

function edit(interaction, guild) {
    return {
        "content": "This command is currently being worked on!",
        "components": []
    }
}

module.exports = {
    execute,
    buttonClicked
}
