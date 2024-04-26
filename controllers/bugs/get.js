const db = require('../../db')

async function get(req, res) {
    if (req.params.id) {
        const dbResponse = await db.query('SELECT bugs.id, title, description, Urep.email as reporter, Uass.email as assigned_to, created, severity, status FROM bugs left join users as Urep on reporter = Urep.id left join users as Uass on assigned_to = Uass.id where bugs.id = $1', [req.params.id])
        
        if (dbResponse.rowCount === 0) {
            return res.status(404).json({
                error: 'not found'
            })
        }
        
        return res.status(200).json({
            status: 'ok',
            bug: dbResponse.rows[0]
        })
    }

    const dbResponse = await db.query('SELECT bugs.id, title, Urep.email as reporter, Uass.email as assigned_to, created, severity, status FROM bugs left join users as Urep on reporter = Urep.id left join users as Uass on assigned_to = Uass.id')
    return res.status(200).json({
        status: 'ok',
        bugs: dbResponse.rows
    })
}

module.exports = get