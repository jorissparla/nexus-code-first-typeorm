import { queryType, stringArg, makeSchema, objectType } from "nexus";

const Customer = objectType({
  name: "Customer",
  definition(t) {
    t.int("id"), t.string("name", { nullable: false });
  }
});

export { Customer };
