import { pgTable, integer, varchar, timestamp } from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};

export const departements = pgTable("departements", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  description: varchar("description", { length: 255 }).notNull(),
  ...timestamps,
});
export const subjects  = pgTable("subjects", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    departementId: integer("departement_id").notNull().references(()=>departements.id,{onDelete : 'restrict'}) ,
    code: varchar("code", { length: 50 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    ...timestamps,

});
export const departementRelation = relations(departements,({many}) => ({ subjects : many(subjects)}))
export const subjectRelation = relations(subjects, ({one , many}) => ({
    departement: one(departements,{
        fields : [subjects.departementId],
        references : [departements.id ],
    }),
}) )


export type Departement = typeof departements.$inferSelect;
export type NewDepartement = typeof departements.$inferInsert;

export type Subject = typeof subjects.$inferSelect;
export type NewSubject = typeof subjects.$inferInsert;