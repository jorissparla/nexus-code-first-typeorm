import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  RelationId
} from "typeorm";

@Entity("Customer", { schema: "dbo" })
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "id"
  })
  id: number;

  @Column("nvarchar", {
    nullable: false,
    length: 50,
    name: "name"
  })
  name: string;
}
