import "reflect-metadata";
import * as dotenv from "dotenv";
import { createConnection } from "typeorm";
import {
  queryType,
  stringArg,
  makeSchema,
  mutationType,
  objectType,
  extendType
} from "nexus";
import { GraphQLServer } from "graphql-yoga";
import { User } from "./entity/User";
import { Customer as CustomerDB } from "./entity/Customer";
import { Customer } from "./customer";
import { createLexer } from "graphql/language";
dotenv.config();

const customers = [{ id: 1, name: "ggdgdgd" }, { id: 2, name: "ggdgdgd" }];

const Query = queryType({
  definition(t) {
    t.string("hello", {
      args: { name: stringArg({ nullable: true }) },
      resolve: (parent, { name }, ctx) => `Hello ${name || "World"}!`
    }),
      t.field("first", {
        type: "Customer",
        resolve: async (_, args, ctx) => {
          const c = await ctx.db.CustomerDB.find();
          return c[0];
        }
      });
    t.list.field("customers", {
      type: "Customer",
      resolve: async (parent, args, ctx) => {
        const c = await ctx.db.CustomerDB.find();
        console.log(c);
        return c;
      }
    });
  }
});

const Hello = extendType({
  type: "Query",
  definition(t) {
    t.string("hello1", { resolve: () => "Hello" });
  }
});
const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    t.field("addCustomer", {
      type: "Customer",
      args: { name: stringArg({ required: true }) },
      resolve: async (parent, args: any, ctx) => {
        const name = args.name;
        const newc = new ctx.db.CustomerDB();
        newc.name = name;
        const c = await newc.save();
        //  const c = { id: 1, name };
        return c;
      }
    });
  }
});

const schema = makeSchema({
  types: [Query, Customer, Mutation, Hello],
  outputs: {
    schema: __dirname + "/generated/schema.graphql",
    typegen: __dirname + "/generated/typings.ts"
  }
});
createConnection()
  .then(async connection => {
    const context = obj => {
      return {
        db: { User, CustomerDB },
        ...obj
      };
    };

    const server = new GraphQLServer({
      schema,
      context
    });
    const port = process.env.PORT;
    const c = await CustomerDB.find();
    server.start({ port }, () =>
      console.log(`Server is running on http://localhost:${port}`)
    );
  })
  .catch(error => console.log(error));
