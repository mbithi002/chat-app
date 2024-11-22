const postTypeDef = `#graphql
    type Post {
        _id: ID!
        user: ID!
        content: String!
        hashtags: [String]
        media: [String]
        likes: [ID!]
    }

    type Query {
        getPosts: [Post!]!
        getPost(postId: ID!): Post
        getFollowing(userId: ID!): [Post!]
        getMyPosts(userId: ID!): [Post!]
    }

    type Mutation {
        createPost(input: createPostInput): Post
        deletePost(postId: ID!): Post!
    }

    input createPostInput {
        user: ID!
        content: String!
        hashtags: [String]
        media: [String]
    }
`


export { postTypeDef }
