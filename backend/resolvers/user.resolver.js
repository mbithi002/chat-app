import bcrypt from 'bcryptjs'
import Post from '../models/post.model.js'
import User from '../models/user.model.js'

const userResolver = {
    Mutation: {
        signUp: async (_, { input }, context) => {
            try {
                const {
                    username,
                    email,
                    password,
                    gender
                } = input
                if (!username || !password || !email || !gender) {
                    throw new Error('Please fill in all fields')
                }
                const emailTaken = await User.findOne({ email })
                const usernameTaken = await User.findOne({ username })
                if (emailTaken) {
                    throw new Error('Email is already taken')
                }
                if (usernameTaken) {
                    throw new Error('Username is already taken')
                }
                const salt = await bcrypt.genSalt(15)
                const hashedPassword = await bcrypt.hash(password, salt)
                const newUser = new User({
                    username,
                    email,
                    password: hashedPassword,
                    gender
                })
                await newUser.save()
                context.login(newUser)
                newUser.password = null
                return newUser
            } catch (error) {
                console.log("Error in signup: ", error);
                throw new Error(error.message) || "Something went wrong"
            }
        },
        login: async (_, { input }, context) => {
            try {
                const { username, password } = input
                if (!username || !password) {
                    throw new Error('Please fill in all fields')
                }
                const user = await User.findOne({ username })
                if (!user) {
                    throw new Error('Invalid username or password')
                }
                const isValidPassword = await bcrypt.compare(password, user.password)
                if (!isValidPassword) {
                    throw new Error('Invalid username or password')
                }
                context.login(user)
                user.password = null
                return user
            } catch (error) {
                console.log("Error in login: ", error);
                throw new Error(error.message) || "Something went wrong"
            }
        },
        logout: async (_, __, context) => {
            try {
                const { req, res } = context
                await context.logout()
                req.session.destroy((err) => {
                    if (err) throw err
                })
                res.clearCookie('connect.sid')
                return { message: 'logout success' }
            } catch (error) {
                console.log("Error in logout: ", error);
                throw new Error(error.message) || "Something went wrong"
            }
        }
    },
    Query: {
        authUser: async (_, __, context) => {
            try {
                const user = await context.getUser()
                user?.password = null
                return user
            } catch (error) {
                console.log("Error in authUser: ", error);
                throw new Error(error.message) || "Something went wrong"
            }
        },
        user: async (_, { userId }) => {
            try {
                const user = await User.findById(userId)
                if (!user) {
                    throw new Error('User not found')
                }
                user.password = null
                return user
            } catch (error) {
                console.log("Error in user: ", error);
                throw new Error(error.message) || "Something went wrong"
            }
        }
    },
    User: {
        posts: async (parent) => {
            try {
                const posts = await Post.find({ user: parent._id })
                return posts
            } catch (error) {
                console.log("Error in posts: ", error);
                throw new Error(error.message) || "Something went wrong"
            }
        }
    }
}

export default userResolver;