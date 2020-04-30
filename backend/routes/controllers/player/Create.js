
const axios = require('axios');

const { PlayerModel } = require('@models');

/**
 * Request structure
 */
// req = { body: { tag: 'xxx' } }
// res = { json: { } }

/**
 * SECURE : Params and Body
 */
const secure = async (req) => {

    const inputs = {};

    if (req.body.tag === undefined || req.body.tag === null) {
        throw new Error('Tag undefined/null');
    }
    inputs.tag = req.body.tag;

    return inputs;
};

/**
 * PROCESS :
 */
const process = async (inputs) => {
    try {
        // const output = {};
        let output;
        // console.log(process.env.TOKEN_API_BRAWLSTAR);
        const isExist = await PlayerModel.find({ tag: inputs.tag }).exec();
        if (isExist.length === 0) {
            console.log( `Bearer ${process.env.TOKEN_API_BRAWLSTAR}`);
            const res = await axios.get(`https://api.brawlstars.com/v1/players/%23${inputs.tag}`, {
                headers: {
                    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjhkODVjYmI2LWRiZTEtNDQ1OC1iYTViLWYwZTBkZmY2NDY5YSIsImlhdCI6MTU4ODIwODE5OCwic3ViIjoiZGV2ZWxvcGVyLzliYzhkNjYxLWZmMDgtZjJjMS01NTJmLTI2NzM5YTBlZjU0ZSIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiNzguMTI2LjE3Ni4yNDkiLCIxMDkuMTMuMTQ3LjY1IiwiOTkuODEuMTM1LjMyIiwiOTkuODAuMTgzLjExNyJdLCJ0eXBlIjoiY2xpZW50In1dfQ.wN5t-Becil_zV-Fo4LshzOUhnPGqQhlMnQlvG_BFsICdAQ3D8Ge8ik9GLdwC1JpMgMMs9GmGeN-E92Z6iUS_xw'
                }
            });
            // eslint-disable-next-line no-param-reassign
            inputs.name = res.data.name;
            output = await PlayerModel.create(inputs);
        } else {
            throw new Error('This player already exist');
        }

        return output;
    } catch (error) {
        throw new Error('Error while getting name'.concat(' > ', error.message));
    }
};

const Create = async (req, res) => {
    try {
        const inputs = await secure(req);

        const output = await process(inputs);

        res.status(200).json({ output });
    } catch (error) {
        console.log('ERROR MESSAGE :', error.message);
        console.log('ERROR :', error);
        res.status(400).json({ 'message': error.message });
    }
};

module.exports = Create;
