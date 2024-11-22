import bcrypt from 'bcryptjs'
import passport from 'passport'
import { GraphQLLocalStrategy } from 'graphql-passport'
import User from '../models/user.model'

export const configurePassport = async () => [
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id)
            done(null, user)
        } catch (error) {
            done(error)
        }
    })

    passport.user(
        new GraphQLLocalStrategy(async (username, password, done) => {
            try {
                const user = await User.findOne({ userName })
                if (!user) {
                    return done(null, false, { message: 'Invalid username or password' })
                }
                const validPassword = await bcrypt.compare(password, user.password)
                if (!validPassword) {
                    return done(null, false, { message: 'Invalid username or password' })
                }
                return done(null, user)
            } catch (error) {
                return done(error)
            }
        })
    )
]