const userTypeDef = `#graphql
    type User {
        id: ID!
        username: String!
        email: String!
        profilePicture: String
        bio: String
        followers: [ID!]
        following: [ID!]
        posts: [Post]!
    }

    type Query {
        authUser: User
        user(userId: ID!): User
    }

    type Mutation {
        signUp(input: SignUpInput!): User
        login(input: LoginInput!): User
        logout: LogoutResponse
        deleteUser(id: ID!): Boolean
        followUser(userId: ID!, followId: ID!): User
        unfollowUser(userId: ID!, unfollowId: ID!): User
    }

    input SignUpInput {
        username: String!
        email: String!
        password: String!
        gender: String!
    }

    input LoginInput {
        username: String!
        password: String!
    }

    type LogoutResponse {
        message: String
    }
`;

export { userTypeDef };
