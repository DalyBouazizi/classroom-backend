ALTER TABLE "subjects" RENAME COLUMN "departementId" TO "departement_id";--> statement-breakpoint
ALTER TABLE "subjects" DROP CONSTRAINT "subjects_departementId_departements_id_fk";
--> statement-breakpoint
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_departement_id_departements_id_fk" FOREIGN KEY ("departement_id") REFERENCES "public"."departements"("id") ON DELETE restrict ON UPDATE no action;