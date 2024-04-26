const db = require('../../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const axios = require('axios')

async function register(req, res) {
    const { email, password, token } = req.body

    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.reCAPTCHA_SECRET_KEY}&response=${token}`
        );

        console.log(response.data)
            
        if (!response.data.success) {s
            return res.status(500).json({
                error: 'captcha ignored'
            })
        } 
    } catch (error) {
        return res.status(500).send("Error verifying reCAPTCHA")
    }

    let expectedUser = await db.query('SELECT * FROM users WHERE email = $1::text', [email])

    if (expectedUser.rowCount < 1) {
        return res.status(400).json({
            error: 'Incorrect data'
        })
    }


    expectedUser = expectedUser.rows[0]

    const passwordMatch = await bcrypt.compare(password, expectedUser.password_hash)

    if (!passwordMatch) {
        return res.status(400).json({
            error: 'Incorrect data'
        })
    }

    const accessToken = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, { 'expiresIn': '1d' });

    return res.status(200).json({
        accessToken,
        firstName: expectedUser.first_name,
        secondName: expectedUser.second_name,
        email,
        role: expectedUser.role
    })

}

module.exports = register