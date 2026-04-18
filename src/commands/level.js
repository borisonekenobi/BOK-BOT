const util = require("../util");
const dbLevel = require("../db/dbLevel");

async function execute(guildID, member, otherMember = false) {
    const userID = member.id;

    const user = await dbLevel.getUser(guildID, userID)
    const pointsForNextLevel = await dbLevel.getPointsForLevel(user.level + 1);

    const otherMemberText = otherMember ? `${member.displayName} - ` : '';

    const percent = Math.round(user.points / pointsForNextLevel * 100);

    const numFilled = Math.round(percent / 5);
    const numEmpty = 20 - numFilled;

    const underline = '⠀'.repeat(10);

    const filled = '█'.repeat(numFilled);
    const empty = '▒'.repeat(numEmpty);

    const fields = [
        {
            name: `__${underline}⠀${percent}%${underline}${percent >= 10 ? '' : '⠀'}__`,
            value: `${user.level} ${filled}${empty} ${user.level + 1}`
        }
    ]

    return util.createEmbed('#00FF00', `${otherMemberText}Rank #${user.rank} - Level ${user.level}`, '', '', '', '', `${user.points}/${pointsForNextLevel}`, '', fields);
}

function infinite() {
    const underline = '⠀'.repeat(11);
    const fields = [
        {
            name: `__${underline}∞%${underline}__`,
            value: `∞ ${'█'.repeat(20)} ∞`
        }
    ]
    return util.createEmbed('#00FF00', `Level ∞`, '', '', '', '', `∞/∞`, '', fields);
}

module.exports = {
    execute,
    infinite
}