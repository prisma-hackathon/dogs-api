import { nexusPrismaPlugin } from 'nexus-prisma'
import { idArg, makeSchema, objectType, stringArg } from 'nexus'

const Dog = objectType({
  name: 'Dog',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.attributes({ type: 'Attribute', })
    t.field('isGoodDog', { type: 'Boolean', resolve: () => true })
    t.model.score()
    // t.model.email()
    // t.model.posts({
    //   pagination: false,
    // })
  },
})

const Attribute = objectType({
  name: 'Attribute',
  definition(t) {
    t.model.id()
    t.model.attributeTemplate()
    t.model.value()
    // t.model.createdAt()
    // t.model.updatedAt()
    // t.model.title()
    // t.model.content()
    // t.model.published()
    // t.model.author()
  },
})

const AttributeTemplate = objectType({
  name: 'AttributeTemplate',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.choices()
    t.model.description()
  }
})

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.crud.dog()
    t.crud.dogs({ pagination: false })
    t.crud.attributeTemplates()
    //   t.crud.post({
    //     alias: 'post',
    //   })

    //   t.list.field('feed', {
    //     type: 'Post',
    //     resolve: (_parent, _args, ctx) => {
    //       return ctx.photon.posts.findMany({
    //         where: { published: true },
    //       })
    //     },
    //   })

    //   t.list.field('filterPosts', {
    //     type: 'Post',
    //     args: {
    //       searchString: stringArg({ nullable: true }),
    //     },
    //     resolve: (_, { searchString }, ctx) => {
    //       return ctx.photon.posts.findMany({
    //         where: {
    //           OR: [
    //             { title: { contains: searchString } },
    //             { content: { contains: searchString } },
    //           ],
    //         },
    //       })
    //     },
    //   })
  },
})

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {

    t.crud.createOneDog()
    t.crud.deleteOneDog()

    t.field('dogAddAttribute', {
      type: 'Dog',
      args: {
        dogName: stringArg({ nullable: false }),
        templateName: stringArg({ nullable: false }),
        value: stringArg({ nullable: false })
      },
      resolve: async (_, { dogName, templateName, value }, ctx) => {
        const template = await ctx.photon.attributeTemplates.findOne({
          where: {name: templateName}
        })

        if (!template) {
          throw new Error('template not found')
        }

        const dog = await ctx.photon.dogs.findOne({
          include: { attributes: true },
          where: { name: dogName }
        });

        if (!dog) {
          throw new Error('dog not found')

        }

        if (!template.choices.includes(value)) {
          throw new Error(`${value} is not a valid ${template.name}`)
        }

        await ctx.photon.attributes.create({
          data: {
            value,
            dog: {
              connect: {
                id: dog.id
              }
            },
            attributeTemplate: {
              connect: {
                id: template.id
              }
            },
          }
        })

        const returnDog = await ctx.photon.dogs.findOne({
          include: { attributes: true },
          where: { id: dog.id }
        });

        if (!returnDog) {
          throw new Error('this should be a 404')
        }

        return returnDog
      }
    })
    //   t.crud.createOneUser({ alias: 'signupUser' })
    //   t.crud.deleteOnePost()

    //   t.field('createDraft', {
    //     type: 'Post',
    //     args: {
    //       title: stringArg({ nullable: false }),
    //       content: stringArg(),
    //       authorEmail: stringArg(),
    //     },
    //     resolve: (_, { title, content, authorEmail }, ctx) => {
    //       return ctx.photon.posts.create({
    //         data: {
    //           title,
    //           content,
    //           published: false,
    //           author: {
    //             connect: { email: authorEmail },
    //           },
    //         },
    //       })
    //     },
    //   })

    //   t.field('publish', {
    //     type: 'Post',
    //     nullable: true,
    //     args: {
    //       id: idArg(),
    //     },
    //     resolve: (_, { id }, ctx) => {
    //       return ctx.photon.posts.update({
    //         where: { id },
    //         data: { published: true },
    //       })
    //     },
    //   })
  },
})

export const schema = makeSchema({
  types: [Query, Mutation, Dog, Attribute, AttributeTemplate],
  plugins: [nexusPrismaPlugin()],
  typegenAutoConfig: {
    contextType: 'Context.Context',
    sources: [
      {
        source: '@generated/photon',
        alias: 'photon',
      },
      {
        source: require.resolve('./context'),
        alias: 'Context',
      },
    ],
  },
})
